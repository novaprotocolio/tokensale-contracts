const novaTokenJSON = require('./build/contracts/NovaToken.json');
const tokenSaleJSON = require('./build/contracts/TokenSale.json');
const fs = require('fs');
const csv = require('csv-parser');

// const provider = artifacts.options.provider;
// override this may cause the problem, instead should use with trace
// const web3 = new Web3(provider);
const Web3 = require('web3');
const web3 = new Web3();
// console.log(novaTokenJSON.deployedBytecode);

const type = process.argv[2] || 'novatoken';

function run(callback) {
  if (type === 'novatoken') {
    const txParams = [
      process.env.TOKEN_FACTORY_ADDRESS,
      '0x0000000000000000000000000000000000000000',
      process.env.BLOCK_NUMBER || 0,
      'NovaToken',
      'Nova'
    ];

    const bytecodeWithParameters =
      novaTokenJSON.bytecode +
      web3.eth.abi
        .encodeParameters(
          ['address', 'address', 'uint256', 'string', 'string'],
          txParams
        )
        .slice(2);
    // slice(2) because we want to remove the '0x' at the beginning.
    callback(bytecodeWithParameters);
  } else if (type === 'tokensale') {
    const startDate = process.env.START_DATE || 1571045021;
    const endDate = process.env.END_DATE || startDate + 7948800;
    const txParams = [
      process.env.NOVA_TOKEN_ADDRESS,
      startDate, // Tue Jun 18 2019 13:53:39 GMT+0700 (Indochina Time)
      endDate // Wed Sep 18 2019 13:53:39 GMT+0700 (Indochina Time)
    ];

    const bytecodeWithParameters =
      tokenSaleJSON.bytecode +
      web3.eth.abi
        .encodeParameters(['address', 'uint256', 'uint256'], txParams)
        .slice(2);
    callback(bytecodeWithParameters);
  } else if (type === 'importbalances') {
    let addresses = [];
    let balances = [];
    fs.createReadStream('./scripts/balances.csv')
      .pipe(csv())
      .on('data', function(data) {
        const tokenAmount = new web3.utils.BN(data['balance']);
        addresses.push(data['address']);
        balances.push(tokenAmount);
      })
      .on('end', () =>
        callback([
          addresses.join(','),
          balances.map(balance => balance.toString()).join(',')
        ])
      );
  }
}

run(output => console.log(output));
