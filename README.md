# Simple IERC20 Interface

This Solidity interface represents a minimalistic version of the ERC20 standard, allowing for token approval, balance queries, and transfers between addresses. 


# IUniswap Interface for Solidity

This Solidity interface outlines key functions for interacting with Uniswap-like decentralized exchanges. It supports various swap operations (tokens for tokens, tokens for ETH, and ETH for tokens with fee-on-transfer tokens support) and liquidity provision.

- Swapping an exact amount of input tokens for a minimum output of other tokens, with support for specifying a deadline and the swap path.
- Swapping tokens for an exact amount of output tokens or ETH, allowing for maximum input amounts and specifying deadlines.
- Adding liquidity to a pool, specifying the desired and minimum amounts for both tokens.

This interface is essential for developers integrating Uniswap functionality into their dApps or for creating custom trading strategies.




