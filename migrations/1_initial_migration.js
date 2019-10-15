const config = require('../config.js');

var Migrations = artifacts.require('./Migrations.sol');

let wallet, gas, gasPrice;
module.exports = function(deployer) {
  const networkName = deployer.network.replace(/(?:-fork)?$/, '');
  if (networkName == 'ethereum') {
    wallet = config.addresses.ethereum.WALLET_ADDRESS;
    gas = config.constants.MAX_GAS;
    gasPrice = config.constants.DEFAULT_HIGH_GAS_PRICE;
  } else if (networkName == 'ropsten') {
    wallet = config.addresses.ropsten.WALLET_ADDRESS;
    gas = config.constants.DEFAULT_GAS;
    gasPrice = config.constants.DEFAULT_HIGH_GAS_PRICE;
  } else if (networkName == 'rinkeby') {
    wallet = config.addresses.rinkeby.WALLET_ADDRESS;
    gas = config.constants.MAX_GAS;
    gasPrice = config.constants.DEFAULT_GAS_PRICE;
  } else if (networkName == 'development') {
    wallet = config.addresses.development.WALLET_ADDRESS;
    gas = config.constants.DEFAULT_GAS;
    gasPrice = config.constants.DEFAULT_GAS_PRICE;
  } else {
    throw 'Wallet not set: ' + networkName;
  }

  deployer.deploy(Migrations, { gas: gas, gasPrice: gasPrice });
};
