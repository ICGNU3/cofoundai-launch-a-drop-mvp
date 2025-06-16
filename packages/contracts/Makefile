
# Makefile for Foundry project

install:
	forge install foundry-rs/forge-std --no-commit
	forge install Uniswap/v4-core --no-commit  
	forge install Uniswap/v4-periphery --no-commit

build:
	forge build

test:
	forge test -vv

fmt:
	forge fmt

deploy-zora-testnet:
	forge script script/DeployRoyaltyHook.s.sol --rpc-url $(ZORA_TESTNET_RPC_URL) --broadcast --verify

clean:
	forge clean

.PHONY: install build test fmt deploy-zora-testnet clean
