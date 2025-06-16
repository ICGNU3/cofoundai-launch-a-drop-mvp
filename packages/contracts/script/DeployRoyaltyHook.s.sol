
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/CreatorRoyaltyHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";

contract DeployRoyaltyHook is Script {
    // Zora testnet PoolManager address (you may need to update this)
    address constant POOL_MANAGER = 0x0000000000000000000000000000000000000000; // TODO: Update with actual address
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address creator = vm.envAddress("CREATOR_ADDRESS");
        uint256 royaltyBps = vm.envUint("ROYALTY_BPS"); // Default to 250 (2.5%) if not set
        
        vm.startBroadcast(deployerPrivateKey);

        CreatorRoyaltyHook hook = new CreatorRoyaltyHook(
            IPoolManager(POOL_MANAGER),
            royaltyBps,
            creator
        );

        vm.stopBroadcast();

        // Print deployment information
        console.log("CreatorRoyaltyHook deployed at:", address(hook));
        console.log("Creator address:", creator);
        console.log("Royalty BPS:", royaltyBps);
        
        // Calculate and print hook flags
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        uint160 hookFlags = 0;
        
        if (permissions.beforeInitialize) hookFlags |= uint160(1 << 159);
        if (permissions.afterInitialize) hookFlags |= uint160(1 << 158);
        if (permissions.beforeAddLiquidity) hookFlags |= uint160(1 << 157);
        if (permissions.afterAddLiquidity) hookFlags |= uint160(1 << 156);
        if (permissions.beforeRemoveLiquidity) hookFlags |= uint160(1 << 155);
        if (permissions.afterRemoveLiquidity) hookFlags |= uint160(1 << 154);
        if (permissions.beforeSwap) hookFlags |= uint160(1 << 153);
        if (permissions.afterSwap) hookFlags |= uint160(1 << 152);
        if (permissions.beforeDonate) hookFlags |= uint160(1 << 151);
        if (permissions.afterDonate) hookFlags |= uint160(1 << 150);
        if (permissions.beforeSwapReturnDelta) hookFlags |= uint160(1 << 149);
        if (permissions.afterSwapReturnDelta) hookFlags |= uint160(1 << 148);
        if (permissions.afterAddLiquidityReturnDelta) hookFlags |= uint160(1 << 147);
        if (permissions.afterRemoveLiquidityReturnDelta) hookFlags |= uint160(1 << 146);
        
        console.log("Hook flags (hex):", vm.toString(hookFlags));
        console.log("Hook flags (decimal):", hookFlags);
    }
}
