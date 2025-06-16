
# Makefile for Foundry project

install:
	forge install foundry-rs/forge-std --no-commit
	forge install Uniswap/v4-core --no-commit  
	forge install Uniswap/v4-periphery --no-commit

build:
	forge build

test:
	forge test -vv

test-extended:
	forge test -vv --match-contract CreatorRoyaltyHookExtendedTest

test-all:
	forge test -vvv

fmt:
	forge fmt

deploy-zora-testnet:
	forge script script/DeployRoyaltyHook.s.sol --rpc-url $(ZORA_TESTNET_RPC_URL) --broadcast --verify

clean:
	forge clean

coverage:
	forge coverage

gas-report:
	forge test --gas-report

.PHONY: install build test test-extended test-all fmt deploy-zora-testnet clean coverage gas-report
