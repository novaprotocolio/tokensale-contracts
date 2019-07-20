module.exports = async function(callback) {
  //require('babel-register');
  //require('babel-polyfill')
  require('./jsHelpers.js');

  // const Web3 = require('web3');
  const TokenSale = artifacts.require('./TokenSale.sol');
  // const provider = artifacts.options.provider;
  // const web3 = new Web3(provider);
  const config = require('../config');

  let tokenSale;
  let sender = config.addresses[artifacts.options.network].WALLET_ADDRESS;

  let newOwner = process.env.OWNER_ADDRESS;
  if (!newOwner) {
    return callback(new Error('OWNER_ADDRESS is empty'));
  }
  // web3.eth.getAccounts(function (error, result) {
  //   let sender = result[0]
  //   run(sender)
  //   callback()
  // })

  const run = async function(sender) {
    tokenSale = await TokenSale.deployed();
    let txn = await tokenSale.transferOwnership(newOwner, {
      from: sender,
      gas: config.constants.DEFAULT_GAS,
      gasPrice: config.constants.DEFAULT_GAS_PRICE
    });
    return txn;
  };

  try {
    const receipt = await run(sender);
    callback('Success');
  } catch (ex) {
    callback(ex);
  }
};
