module.exports = async function(callback) {
  Array.prototype.toNumber = function() {
    return this.map(elem => {
      return parseFloat(elem);
    });
  };

  //require('babel-register');
  //require('babel-polyfill')
  require('./jsHelpers.js');

  const fs = require('fs');
  const csv = require('csv-parser');
  // const Web3 = require('web3');
  const config = require('../config.js');

  const NovaPresaleToken = artifacts.require('./NovaPresaleToken.sol');
  const NovaToken = artifacts.require('./NovaToken.sol');
  // const provider = artifacts.options.provider;
  // override this may cause the problem, instead should use with trace
  // const web3 = new Web3(provider);

  let novaToken;
  let novaPresaleToken;

  let fund = config.addresses[artifacts.options.network].WALLET_ADDRESS;

  // web3.eth.getAccounts(function (error, result) {
  //   fund = result[0]
  // })

  console.log(fund);

  const getAddress = async contract => {
    let address = contract.address;
    return address;
  };

  const importBalances = async (token, caller, addresses, balances) => {
    let txn = await token.importPresaleBalances(addresses, balances, {
      from: caller,
      gas: config.constants.MAX_GAS,
      gasPrice: config.constants.DEFAULT_HIGH_GAS_PRICE
    });
    console.log('txn', txn);
    return txn;
  };

  const run = async function() {
    novaToken = await NovaToken.deployed();
    await launchImport();
  };

  const launchImport = async function() {
    let addresses = [];
    let balances = [];

    const writeData = new Promise((resolve, reject) => {
      fs.createReadStream('./scripts/balances.csv')
        .pipe(csv())
        .on('data', function(data) {
          const tokenAmount = new web3.utils.BN(data['balance']);
          addresses.push(data['address']);
          balances.push(tokenAmount);
        })
        .on('end', resolve);
    });

    await writeData;
    // balances = balances.toNumber()

    // console.log(balances)

    let addressListNumber = addresses.length;

    for (let i = 0; i < addressListNumber; i = i + 50) {
      let addressesBatch = addresses.slice(i, i + 50);
      let balancesBatch = balances.slice(i, i + 50);

      let receipt = await importBalances(
        novaToken,
        fund,
        addressesBatch,
        balancesBatch
      );
      // console.log(addressesBatch, balancesBatch, receipt)
    }
  };

  try {
    await run();
  } catch (ex) {
    callback(ex);
  }
};
