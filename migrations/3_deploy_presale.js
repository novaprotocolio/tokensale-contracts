const config = require('../config.js')

const NovaPresaleToken = artifacts.require('./NovaPresaleToken.sol')

let wallet, gas, gasPrice

module.exports = function (deployer) {
  if (deployer.network == 'ethereum') {
    wallet = config.addresses.ethereum.WALLET_ADDRESS
    gas = config.constants.MAX_GAS
    gasPrice = config.constants.DEFAULT_HIGH_GAS_PRICE
  } else if (deployer.network == 'ropsten') {
    wallet = config.addresses.ropsten.WALLET_ADDRESS
    gas = config.constants.DEFAULT_GAS
    gasPrice = config.constants.DEFAULT_HIGH_GAS_PRICE
  } else if (deployer.network == 'rinkeby') {
    wallet = config.addresses.rinkeby.WALLET_ADDRESS
    gas = config.constants.MAX_GAS
    gasPrice = config.constants.DEFAULT_GAS_PRICE
  } else if (deployer.network == 'development') {
    wallet = config.addresses.development.WALLET_ADDRESS
    gas = config.constants.MAX_GAS
    gasPrice = config.constants.DEFAULT_GAS_PRICE
  } else {
    throw new Error('Wallet not set')
  }

  deployer.deploy(NovaPresaleToken, { gas: gas, gasPrice: gasPrice })
}
