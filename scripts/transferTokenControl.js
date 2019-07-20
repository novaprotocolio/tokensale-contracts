module.exports = async function(callback) {
  //require('babel-register');
  //require('babel-polyfill');
  require('./jsHelpers.js');

  const NovaToken = artifacts.require('./NovaToken.sol');
  const TokenSale = artifacts.require('./TokenSale.sol');
  const config = require('../config');

  let novaToken;
  let tokenSale;
  let sender = config.addresses[artifacts.options.network].WALLET_ADDRESS;

  const run = async function(sender) {
    novaToken = await NovaToken.deployed();
    tokenSale = await TokenSale.deployed();
    let txn = await novaToken.transferControl(tokenSale.address, {
      from: sender,
      gas: config.constants.DEFAULT_GAS,
      gasPrice: config.constants.DEFAULT_HIGH_GAS_PRICE
    });
    return txn;
  };

  try {
    const receipt = await run(sender);
    callback(JSON.stringify(receipt));
  } catch (ex) {
    callback(ex);
  }
};
