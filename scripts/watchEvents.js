module.exports = async function(callback) {
  //require('babel-register');
  //require('babel-polyfill')
  require('./jsHelpers.js');

  // const Web3 = require('web3');
  // const provider = artifacts.options.provider;
  // const web3 = new Web3(provider);

  const NovaToken = artifacts.require('./NovaToken.sol');
  const TokenSale = artifacts.require('./TokenSale.sol');

  const novaToken = await NovaToken.deployed();
  const novaTokenSale = await TokenSale.deployed();

  console.log(novaToken.address);
  console.log(novaTokenSale.address);

  let tokenEvents = novaToken.allEvents();
  let tokenSaleEvents = novaTokenSale.allEvents();

  tokenEvents.watch((err, res) => {
    console.log('\n****************\n');
    console.log(res);
    console.log('\n****************\n');
  });

  tokenSaleEvents.watch((err, res) => {
    console.log('\n****************\n');
    console.log(res);
    console.log('\n****************\n');
  });

  callback();
};
