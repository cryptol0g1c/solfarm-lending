const {
  getCoinsUsdValue,
  getReservePoolData
} = require('./utils');

/**
 * The following example uses Polis (Atlas network) for Solfarm Reserve Pool
 * Information about accounts can be found here: https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093
 */
(async () => {

  const polisUsdValue = await getCoinsUsdValue("star-atlas-dao");//Check the string id on Coingecko
  console.log(await getReservePoolData(
    "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb",//User address
    "658FZo9B4HgKxsKsM7cUHN7jfNFgC7YftusWWYWc4piD",//Collateral token mint: https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093#file-solfarm-lending-reserves-L168
    "7hxTjiLvBuZcUQnztSRhtvthcsVdu7Na5WWXocwBWA8y",//Reserve account: https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093#file-solfarm-lending-reserves-L164
    polisUsdValue
  ));
})()


