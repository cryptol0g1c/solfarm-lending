const {
  getCoinsUsdValue,
  getReservePoolData
} = require('./utils');

/**
 * The following example uses USDC for Solfarm Reserve Pool
 * Information about accounts can be found here: https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093
 */
(async () => {

  const coinUsdvalue = await getCoinsUsdValue("usd-coin");//Check the string id on Coingecko
  
  console.log(await getReservePoolData(
    "BN2vN85Q4HiWJL6JejX2ke82fKY7nxnFUBjAWFMC8Wcb",// User address
    "Amig8TisuLpzun8XyGfC5HJHHGUQEscjLgoTWsCCKihg",// https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093#file-solfarm-lending-reserves-L168
    "FTkSmGsJ3ZqDSHdcnY7ejN1pWV3Ej7i88MYpZyyaqgGt",// https://gist.github.com/therealssj/11a0f7b9e27ca43b783dcc1e5a6bb093#file-solfarm-lending-reserves-L164
    coinUsdvalue
  ));

})()


