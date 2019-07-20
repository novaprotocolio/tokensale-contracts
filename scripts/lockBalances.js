module.exports = async function(callback) {
  require('babel-register');
  require('babel-polyfill');
  require('./jsHelpers.js');

  const NovaToken = artifacts.require('./NovaToken.sol');
  const config = require('../config');

  let novaToken;

  const run = async function(sender) {
    novaToken = await NovaToken.deployed();
    let txn = await novaToken.lockPresaleBalances({
      from: sender,
      gas: config.constants.DEFAULT_GAS,
      gasPrice: config.constants.DEFAULT_HIGH_GAS_PRICE
    });
    return txn;
  };

  let sender = config.addresses[artifacts.options.network].WALLET_ADDRESS;
  try {
    const receipt = await run(sender);
    callback(JSON.stringify(receipt));
  } catch (ex) {
    callback(ex);
  }
};
