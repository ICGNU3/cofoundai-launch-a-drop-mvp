
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CreatorRoyaltyHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";

contract MockPoolManagerExtended {
    mapping(Currency => mapping(address => uint256)) public balances;
    
    function take(Currency currency, address to, uint256 amount) external {
        balances[currency][to] += amount;
    }
}

contract CreatorRoyaltyHookExtendedTest is Test {
    CreatorRoyaltyHook hook;
    MockPoolManagerExtended poolManager;
    address creator = address(0x123);
    uint256 royaltyBps = 250; // 2.5%

    event RoyaltyPaid(address payer, uint256 amount);

    function setUp() public {
        poolManager = new MockPoolManagerExtended();
        hook = new CreatorRoyaltyHook(IPoolManager(address(poolManager)), royaltyBps, creator);
    }

    function testLargeSwapAmount() public {
        address sender = address(0x456);
        
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x789)),
            currency1: Currency.wrap(address(0xABC)),
            fee: 3000,
            tickSpacing: 60,
            hooks: hook
        });

        // Test with 1000 ETH (large amount)
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1000 ether,
            sqrtPriceLimitX96: 0
        });

        uint256 expectedRoyalty = (1000 ether * 250) / 10000; // 25 ETH

        vm.expectEmit(true, false, false, true);
        emit RoyaltyPaid(sender, expectedRoyalty);

        hook.beforeSwap(sender, key, params, "");

        assertEq(poolManager.balances(key.currency0, creator), expectedRoyalty);
    }

    function testSmallSwapAmount() public {
        address sender = address(0x456);
        
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x789)),
            currency1: Currency.wrap(address(0xABC)),
            fee: 3000,
            tickSpacing: 60,
            hooks: hook
        });

        // Test with very small amount (1 wei)
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1,
            sqrtPriceLimitX96: 0
        });

        // Expected royalty: 1 * 250 / 10000 = 0 (due to integer division)
        uint256 expectedRoyalty = 0;

        // Should not emit event when royalty is 0
        vm.recordLogs();
        hook.beforeSwap(sender, key, params, "");
        
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 0, "No events should be emitted for zero royalty");
        assertEq(poolManager.balances(key.currency0, creator), expectedRoyalty);
    }

    function testMaxRoyalty() public {
        // Test with maximum royalty (100%)
        CreatorRoyaltyHook maxRoyaltyHook = new CreatorRoyaltyHook(
            IPoolManager(address(poolManager)), 
            10000, // 100%
            creator
        );

        address sender = address(0x456);
        
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x789)),
            currency1: Currency.wrap(address(0xABC)),
            fee: 3000,
            tickSpacing: 60,
            hooks: maxRoyaltyHook
        });

        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1000,
            sqrtPriceLimitX96: 0
        });

        uint256 expectedRoyalty = 1000; // 100% of input

        vm.expectEmit(true, false, false, true);
        emit RoyaltyPaid(sender, expectedRoyalty);

        maxRoyaltyHook.beforeSwap(sender, key, params, "");

        assertEq(poolManager.balances(key.currency0, creator), expectedRoyalty);
    }

    function testReturnValues() public {
        address sender = address(0x456);
        
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x789)),
            currency1: Currency.wrap(address(0xABC)),
            fee: 3000,
            tickSpacing: 60,
            hooks: hook
        });

        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1000,
            sqrtPriceLimitX96: 0
        });

        (bytes4 selector, , uint24 fee) = hook.beforeSwap(sender, key, params, "");
        
        assertEq(selector, hook.beforeSwap.selector);
        assertEq(fee, 0);
    }
}
