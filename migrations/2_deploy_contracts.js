const config = require('../config.js')

const NovaToken = artifacts.require('./NovaToken.sol')
const TokenSale = artifacts.require('./TokenSale.sol')
const TokenFactory = artifacts.require('./TokenFactory.sol')

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

  deployer
    .deploy(TokenFactory, { gas: gas, gasPrice: gasPrice })
    .then(function () {
      return deployer.deploy(
        NovaToken,
        TokenFactory.address,
        '0x0000000000000000000000000000000000000000',
        process.env.BLOCK_NUMBER || 0,
        'NovaToken',
        'Nova',
        { gas: gas, gasPrice: gasPrice }
      )
    })
    .then(function () {
      return deployer.deploy(
        TokenSale,
        NovaToken.address,
        1560840819, // Tue Jun 18 2019 13:53:39 GMT+0700 (Indochina Time)
        1568789619, // Wed Sep 18 2019 13:53:39 GMT+0700 (Indochina Time)
        { gas: gas, gasPrice: gasPrice }
      )
    })
}
