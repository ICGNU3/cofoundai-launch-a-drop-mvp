
import { BigInt, BigDecimal, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  CoinCreated
} from "../generated/ZoraFactory/ZoraFactory"
import {
  Swap,
  RoyaltyPaid,
  ModifyLiquidity
} from "../generated/templates/Pool/Pool"
import {
  Coin,
  PoolStat,
  RoyaltyFlow,
  LPPosition,
  SwapEvent,
  DailyPoolStat
} from "../generated/schema"
import { Pool } from "../generated/templates"

// Constants
const ZERO_BD = BigDecimal.fromString("0")
const ONE_BD = BigDecimal.fromString("1")
const SECONDS_PER_DAY = BigInt.fromI32(86400)

export function handleCoinCreated(event: CoinCreated): void {
  let coin = new Coin(event.params.coinAddress.toHexString())
  coin.symbol = event.params.symbol
  coin.name = event.params.name
  coin.creator = event.params.creator
  coin.createdAt = event.block.timestamp
  coin.createdAtBlock = event.block.number
  
  // Create PoolStat entity
  let poolStat = new PoolStat(event.params.poolAddress.toHexString())
  poolStat.coin = coin.id
  poolStat.volume24h = ZERO_BD
  poolStat.depth = ZERO_BD
  poolStat.feeAPR = ZERO_BD
  poolStat.totalVolumeUSD = ZERO_BD
  poolStat.totalRoyalties = ZERO_BD
  poolStat.lastUpdated = event.block.timestamp
  poolStat.lastUpdatedBlock = event.block.number
  
  coin.poolAddress = event.params.poolAddress
  coin.poolStat = poolStat.id
  
  // Start indexing the pool
  Pool.create(event.params.poolAddress)
  
  coin.save()
  poolStat.save()
}

export function handleSwap(event: Swap): void {
  let poolAddress = event.address.toHexString()
  let poolStat = PoolStat.load(poolAddress)
  
  if (!poolStat) {
    return
  }
  
  // Create swap event
  let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let swapEvent = new SwapEvent(swapId)
  swapEvent.pool = poolStat.id
  swapEvent.sender = event.params.sender
  swapEvent.recipient = event.params.recipient
  swapEvent.amount0 = convertTokenToDecimal(event.params.amount0, 18)
  swapEvent.amount1 = convertTokenToDecimal(event.params.amount1, 18)
  swapEvent.sqrtPriceX96 = event.params.sqrtPriceX96
  swapEvent.liquidity = event.params.liquidity
  swapEvent.tick = event.params.tick
  swapEvent.blockTime = event.block.timestamp
  swapEvent.blockNumber = event.block.number
  swapEvent.transactionHash = event.transaction.hash
  
  // Update pool stats
  let volumeUSD = swapEvent.amount0.abs().plus(swapEvent.amount1.abs())
  poolStat.totalVolumeUSD = poolStat.totalVolumeUSD.plus(volumeUSD)
  
  // Update 24h volume (simplified - in production would need time-based calculation)
  poolStat.volume24h = poolStat.volume24h.plus(volumeUSD)
  
  poolStat.lastUpdated = event.block.timestamp
  poolStat.lastUpdatedBlock = event.block.number
  
  swapEvent.save()
  poolStat.save()
  
  // Update daily stats
  updateDailyStats(poolStat as PoolStat, volumeUSD, event.block.timestamp)
}

export function handleRoyaltyPaid(event: RoyaltyPaid): void {
  let poolAddress = event.address.toHexString()
  let poolStat = PoolStat.load(poolAddress)
  
  if (!poolStat) {
    return
  }
  
  // Create royalty flow event
  let royaltyId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let royaltyFlow = new RoyaltyFlow(royaltyId)
  royaltyFlow.pool = poolStat.id
  royaltyFlow.coin = poolStat.coin
  royaltyFlow.payer = event.params.payer
  royaltyFlow.amount = convertTokenToDecimal(event.params.amount, 18)
  royaltyFlow.blockTime = event.block.timestamp
  royaltyFlow.blockNumber = event.block.number
  royaltyFlow.transactionHash = event.transaction.hash
  
  // Update pool total royalties
  poolStat.totalRoyalties = poolStat.totalRoyalties.plus(royaltyFlow.amount)
  poolStat.lastUpdated = event.block.timestamp
  
  royaltyFlow.save()
  poolStat.save()
}

export function handleModifyLiquidity(event: ModifyLiquidity): void {
  let poolAddress = event.address.toHexString()
  let poolStat = PoolStat.load(poolAddress)
  
  if (!poolStat) {
    return
  }
  
  // Update LP position
  let positionId = poolAddress + "-" + event.params.sender.toHexString()
  let position = LPPosition.load(positionId)
  
  if (!position) {
    position = new LPPosition(positionId)
    position.pool = poolStat.id
    position.owner = event.params.sender
    position.liquidity = ZERO_BD
    position.unclaimed = ZERO_BD
    position.createdAt = event.block.timestamp
  }
  
  // Update liquidity (simplified calculation)
  let liquidityDelta = convertTokenToDecimal(event.params.liquidityDelta, 18)
  position.liquidity = position.liquidity.plus(liquidityDelta)
  position.lastModified = event.block.timestamp
  
  // Update pool depth
  poolStat.depth = poolStat.depth.plus(liquidityDelta)
  poolStat.lastUpdated = event.block.timestamp
  
  position.save()
  poolStat.save()
}

function convertTokenToDecimal(amount: BigInt, decimals: i32): BigDecimal {
  if (decimals == 0) {
    return amount.toBigDecimal()
  }
  return amount.toBigDecimal().div(exponentToBigDecimal(decimals))
}

function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString("1")
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString("10"))
  }
  return bd
}

function updateDailyStats(pool: PoolStat, volumeUSD: BigDecimal, timestamp: BigInt): void {
  let dayID = timestamp.div(SECONDS_PER_DAY).toI32()
  let dayStartTimestamp = BigInt.fromI32(dayID).times(SECONDS_PER_DAY)
  let dailyStatId = pool.id + "-" + dayID.toString()
  
  let dailyStat = DailyPoolStat.load(dailyStatId)
  if (!dailyStat) {
    dailyStat = new DailyPoolStat(dailyStatId)
    dailyStat.pool = pool.id
    dailyStat.date = dayID
    dailyStat.volumeUSD = ZERO_BD
    dailyStat.royaltiesUSD = ZERO_BD
    dailyStat.swapCount = BigInt.fromI32(0)
    dailyStat.uniqueUsers = BigInt.fromI32(0)
  }
  
  dailyStat.volumeUSD = dailyStat.volumeUSD.plus(volumeUSD)
  dailyStat.swapCount = dailyStat.swapCount.plus(BigInt.fromI32(1))
  
  dailyStat.save()
}
