
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/BaseHook.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";
import {Currency, CurrencyLibrary} from "v4-core/types/Currency.sol";

contract CreatorRoyaltyHook is BaseHook {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    // Immutable storage for royalty basis points (e.g., 250 = 2.5%)
    uint256 public immutable royaltyBps;
    address public immutable creator;

    event RoyaltyPaid(address payer, uint256 amount);

    constructor(IPoolManager _poolManager, uint256 _royaltyBps, address _creator) 
        BaseHook(_poolManager) 
    {
        require(_royaltyBps <= 10000, "Royalty BPS cannot exceed 10000");
        require(_creator != address(0), "Creator cannot be zero address");
        royaltyBps = _royaltyBps;
        creator = _creator;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        // Calculate royalty from the input amount
        uint256 amountIn = params.amountSpecified < 0 
            ? uint256(-params.amountSpecified) 
            : uint256(params.amountSpecified);
        
        uint256 royalty = (amountIn * royaltyBps) / 10000;
        
        if (royalty > 0) {
            // Determine the input currency
            Currency inputCurrency = params.zeroForOne ? key.currency0 : key.currency1;
            
            // Take the royalty from the pool manager
            poolManager.take(inputCurrency, creator, royalty);
            
            // Emit royalty paid event
            emit RoyaltyPaid(sender, royalty);
        }

        // Return the selector to continue with the swap
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }
}
