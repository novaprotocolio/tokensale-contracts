// const ProviderEngine = require('web3-provider-engine');
// const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');

// const {
//   RevertTraceSubprovider,
//   TruffleArtifactAdapter
// } = require('@0x/sol-trace');

const PrivateKeyProvider = require('truffle-privatekey-provider');
const config = require('./config');

//require('babel-register');
//require('babel-polyfill');

const solcVersion = process.env.SOLC_VERSION || '0.4.17';

module.exports = {
  networks: {
    development: {
      network_id: '*',
      host: '127.0.0.1',
      port: 8545,
      from: config.addresses.development.WALLET_ADDRESS,
      gas: config.constants.MAX_GAS || 10000000,
      gasPrice: 1
    },
    ganache: {
      network_id: '*',
      host: '127.0.0.1',
      port: 7545,
      from: config.addresses.ganache.WALLET_ADDRESS,
      gas: config.constants.MAX_GAS || 10000000,
      gasPrice: 1
    },
    // debug: {
    //   network_id: '*',
    //   provider: () => {
    //     const projectRoot = '.';
    //     const artifactAdapter = new TruffleArtifactAdapter(
    //       projectRoot,
    //       solcVersion
    //     );

    //     const providerEngine = new ProviderEngine();
    //     providerEngine.addProvider(
    //       new RevertTraceSubprovider(
    //         artifactAdapter,
    //         config.addresses.development.WALLET_ADDRESS,
    //         true
    //       )
    //     );
    //     providerEngine.addProvider(
    //       new RpcSubprovider({ rpcUrl: 'http://127.0.0.1:8545' })
    //     );
    //     providerEngine.start();
    //     return providerEngine;
    //   },
    //   gas: config.constants.MAX_GAS || 10000000,
    //   gasPrice: 1
    // },
    production: {
      provider: () =>
        new PrivateKeyProvider(
          process.env.PK,
          config.infura.ethereum || 'https://mainnet.infura.io'
        ),
      network_id: 1,
      gasPrice: config.constants.DEFAULT_GAS_PRICE || 10000000000,
      gas: config.constants.MAX_GAS || 4000000
    },
    ropsten: {
      provider: () =>
        new PrivateKeyProvider(
          process.env.PK,
          config.infura.ropsten || 'https://ropsten.infura.io'
        ),
      network_id: 3,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: () =>
        new PrivateKeyProvider(
          process.env.PK,
          config.infura.rinkeby || 'https://rinkeby.infura.io'
        ),
      network_id: 4,
      gasPrice: 10000000000
    }
  },

  compilers: {
    solc: {
      version: solcVersion
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
