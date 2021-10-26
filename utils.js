const { PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const { publicKey, u64, u8, u128, u32, bool, struct } = require("@project-serum/borsh");
const axios = require('axios');
const BigNumber = require('bignumber.js');
const WAD = 10 ** 18;


const LENDING_RESERVE_LAYOUT = struct([
  u8('version'),
  struct(
    [
      u64('slot'),
      bool('stale')
    ],
    'lastUpdateSlot'
  ),
  publicKey('lendingMarket'),
  publicKey('borrowAuthorizer'),
  struct(
    [
      publicKey('mintPubKey'),
      u8('mintDecimals'),
      publicKey('supplyPubKey'),
      publicKey('feeReceiver'),
      publicKey('oraclePubKey'),
      u64('availableAmount'),
      u128('borrowedAmount'),
      u128('cumulativeBorrowRate'),
      u128('marketPrice'),
      u128('platformAmountWads'),
      u8('platformFees')
    ],
    'liquidity'
  )
]);

/**
 * Returns account data information
 * @param {account address} _address base58
 * @returns 
 */
const getAccountInfo = async (_address) => {

  try {
    const data = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getAccountInfo",
      "params": [
        `${_address}`,
        {
          "encoding": "jsonParsed"
        }
      ]
    });

    const config = {
      method: 'post',
      url: 'https://solana-api.projectserum.com',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    let result = await axios(config);
    return result.data.result;

  } catch (error) {
    console.log(error);
  }

};


/**
 * Returns ATA (Associated Token Account) 
 * @param {user address} _userAddress base58
 * @param {mint address} _tokenMint base58
 * @returns 
 */
const getAssociatedTokenAddress = async (_userAddress, _tokenMint) => {

  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  try {

    let walletAddress = new PublicKey(_userAddress);
    let tokenMintAddress = new PublicKey(_tokenMint);

    let associatedAddress = await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );

    return associatedAddress[0].toBase58();

  } catch (error) {
    throw (error);
  }
};

/**
 * Gets USD value of given token from Coingecko
 * @returns used value
 */
const getCoinsUsdValue = async (_tokenId) => {

  try {

    let BASE_URL = 'https://api.coingecko.com/api/v3';
    let URL_PARAMS = `/simple/price?ids=${_tokenId}&vs_currencies=usd`

    const config = {
      method: 'GET',
      url: `${BASE_URL}${URL_PARAMS}`
    };

    let result = await axios(config);

    return result.data[_tokenId].usd;

  } catch (error) {
    log(error.message);
    throw (error);
  }

};


/**
 * Fetches reserves information for given pool / user address-wallet
 * @param {user/wallet address} _userAddr string
 * @param {reserver collateral token mint address} _collateralTokenMint string
 * @param {reserve account} _reserveAccount address
 * @param {token USD price} _tokenPrice Number
 * @returns Object with reserves data
 */
const getReservePoolData = async (
  _userAddr,
  _collateralTokenMint,
  _reserveAccount,
  _tokenPrice
) => {

  try {

    if (_userAddr == undefined || _collateralTokenMint == undefined || _reserveAccount == undefined || _tokenPrice == undefined)
      throw ("Missing Parameters");

    const associatedAccount = await getAssociatedTokenAddress(_userAddr, _collateralTokenMint);

    const ATABalance = (await getAccountInfo(associatedAccount)).value.data.parsed.info.tokenAmount.uiAmount;

    const reserveAccountInfo = await getAccountInfo(_reserveAccount);

    const reserveData = reserveAccountInfo.value.data[0];

    const {
      liquidity
    } = LENDING_RESERVE_LAYOUT.decode(Buffer.from(reserveData, "base64"));

    const borrowedAmount = new BigNumber(liquidity.borrowedAmount);
    const platformAmountWads = new BigNumber(liquidity.platformAmountWads);
    const availableAmount = new BigNumber(liquidity.availableAmount);

    const borrowedAmountWads = borrowedAmount.div(WAD);
    const platformAmount = platformAmountWads.div(WAD);
    const availableAmountWei = availableAmount
    const totalSupply = availableAmountWei.plus(borrowedAmountWads).minus(platformAmount);


    return {
      userTokenBalance: ATABalance,
      userUSDBalance: ATABalance * _tokenPrice,
      totalSupply: totalSupply.div(10 ** liquidity.mintDecimals).toNumber(),
      tvl: (totalSupply.div(10 ** liquidity.mintDecimals).toNumber() * _tokenPrice),
    };
  } catch (error) {
    console.log(`[-] Error found ${error}`);
    throw (error);
  }

};

module.exports = {
  getCoinsUsdValue,
  getReservePoolData
};