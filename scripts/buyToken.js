module.exports = async function(callback) {
  //require('babel-register');
  //require('babel-polyfill');
  require('./jsHelpers.js');

  const moment = require('moment');
  const { buyTokens, enableTransfers } = require('./tokenSaleHelpers.js');
  const { ether } = require('./testConfig.js');

  const NovaToken = artifacts.require('./NovaToken.sol');
  const TokenSale = artifacts.require('./TokenSale.sol');

  const config = require('../config');

  let tokenSale = await TokenSale.deployed();
  let sender = config.addresses[artifacts.options.network].WALLET_ADDRESS;

  const run = async function(sender) {
    let txn = await buyTokens(tokenSale, sender, 1 * ether);
    return txn;
  };

  try {
    const receipt = await run(sender);
    callback(receipt);
  } catch (ex) {
    callback(ex);
  }
};
