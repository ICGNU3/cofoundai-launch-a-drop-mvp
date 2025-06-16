
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CreatorRoyaltyHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {PoolId} from "v4-core/types/PoolId.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";

contract MockPoolManager {
    mapping(Currency => mapping(address => uint256)) public balances;
    
    function take(Currency currency, address to, uint256 amount) external {
        balances[currency][to] += amount;
    }
}

contract CreatorRoyaltyHookTest is Test {
    CreatorRoyaltyHook hook;
    MockPoolManager poolManager;
    address creator = address(0x123);
    uint256 royaltyBps = 250; // 2.5%

    event RoyaltyPaid(address payer, uint256 amount);

    function setUp() public {
        poolManager = new MockPoolManager();
        hook = new CreatorRoyaltyHook(IPoolManager(address(poolManager)), royaltyBps, creator);
    }

    function testConstructor() public {
        assertEq(hook.royaltyBps(), royaltyBps);
        assertEq(hook.creator(), creator);
    }

    function testConstructorRevertsOnInvalidRoyalty() public {
        vm.expectRevert("Royalty BPS cannot exceed 10000");
        new CreatorRoyaltyHook(IPoolManager(address(poolManager)), 10001, creator);
    }

    function testConstructorRevertsOnZeroCreator() public {
        vm.expectRevert("Creator cannot be zero address");
        new CreatorRoyaltyHook(IPoolManager(address(poolManager)), royaltyBps, address(0));
    }

    function testGetHookPermissions() public {
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        assertTrue(permissions.beforeSwap);
        assertFalse(permissions.afterSwap);
        assertFalse(permissions.beforeInitialize);
    }

    function testBeforeSwapCalculatesRoyalty() public {
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
            amountSpecified: -1000, // Negative for exact input
            sqrtPriceLimitX96: 0
        });

        // Expected royalty: 1000 * 250 / 10000 = 25
        uint256 expectedRoyalty = 25;

        // Expect the RoyaltyPaid event
        vm.expectEmit(true, false, false, true);
        emit RoyaltyPaid(sender, expectedRoyalty);

        // Call beforeSwap
        hook.beforeSwap(sender, key, params, "");

        // Check that creator received the royalty
        assertEq(poolManager.balances(key.currency0, creator), expectedRoyalty);
    }

    function testBeforeSwapWithZeroRoyalty() public {
        // Create hook with 0% royalty
        CreatorRoyaltyHook zeroRoyaltyHook = new CreatorRoyaltyHook(
            IPoolManager(address(poolManager)), 
            0, 
            creator
        );

        address sender = address(0x456);
        
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x789)),
            currency1: Currency.wrap(address(0xABC)),
            fee: 3000,
            tickSpacing: 60,
            hooks: zeroRoyaltyHook
        });

        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: -1000,
            sqrtPriceLimitX96: 0
        });

        // Should not emit RoyaltyPaid event when royalty is 0
        vm.recordLogs();
        zeroRoyaltyHook.beforeSwap(sender, key, params, "");
        
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 0, "No events should be emitted for zero royalty");
    }

    function testBeforeSwapWithPositiveAmountSpecified() public {
        address sender = address(0x456);
        
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x789)),
            currency1: Currency.wrap(address(0xABC)),
            fee: 3000,
            tickSpacing: 60,
            hooks: hook
        });

        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: false,
            amountSpecified: 2000, // Positive for exact output
            sqrtPriceLimitX96: 0
        });

        // Expected royalty: 2000 * 250 / 10000 = 50
        uint256 expectedRoyalty = 50;

        vm.expectEmit(true, false, false, true);
        emit RoyaltyPaid(sender, expectedRoyalty);

        hook.beforeSwap(sender, key, params, "");

        // Check that creator received the royalty from currency1 (zeroForOne = false)
        assertEq(poolManager.balances(key.currency1, creator), expectedRoyalty);
    }
}
