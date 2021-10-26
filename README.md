# solfarm-lending

### Installation

To install dependencies run:

```npm i```

### Usage

An example usage can be found on index.js file with pre-loaded POLIS (Star Atlas) lending pool account addresses.

You will need the pool information with all associated accounts, like so:

```
  {
    name: "POLIS",
    account: "7hxTjiLvBuZcUQnztSRhtvthcsVdu7Na5WWXocwBWA8y",
    mintAddress: "poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk",
    liquiditySupplyTokenAccount: "5XHT644Lbgn7HCY93JSu8Vp8QjfmrEz8ZvD5QyB3EieE",
    liquidityFeeReceiver: "64bogB1G4Km8Toequs4bcwmrPb9evrzof2CugFpL8SNN",
    collateralTokenMint: "658FZo9B4HgKxsKsM7cUHN7jfNFgC7YftusWWYWc4piD",
    collateralTokenSupply: "3AH6WZBW5yYbS6shZAvQTB4iW5d4Shb1EBMMPThGzyQP",
    destinationCollateralTokenAccount: "3x5ZLLUwreSHmdPqegC3dt8jH6TXzmqSTxc9iFnt8Y9e",
    quoteTokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: TOKENS.POLIS.decimals,
    logo: polisLogo,
    visible: true,
    borrowDisabled: true
  },
```
For different accounts of different pools check:
[Lending Pool Info](https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093)

If accounts are properly setted, result will show something like:

```
{
  userTokenBalance: 0.61700456,
  userUSDBalance: 4.4547729232,
  totalSupply: 1191782.3235852825,
  tvl: 8604668.37628574
}
```

Note: token price needs to be included in order to do proper calculations. Check Coingecko API docs for Token IDs.

For more information check Solfarm discord.