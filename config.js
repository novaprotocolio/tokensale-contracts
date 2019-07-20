let config = {
  infura: {
    ethereum: 'https://mainnet.infura.io/Oi27hEUIuGqMsrYGpI7e',
    ropsten: 'https://ropsten.infura.io/Oi27hEUIuGqMsrYGpI7e',
    rinkeby: 'https://rinkeby.infura.io/Oi27hEUIuGqMsrYGpI7e',
    kovan: 'https://kovan.infura.io/Oi27hEUIuGqMsrYGpI7e'
  },
  constants: {
    DEFAULT_GAS: 2 * 10 ** 6,
    MAX_GAS: 4.7 * 10 ** 6,
    DEFAULT_LOW_GAS_PRICE: 0.1 * 10 ** 9,
    DEFAULT_GAS_PRICE: 1 * 10 ** 9,
    DEFAULT_HIGH_GAS_PRICE: 5 * 10 ** 9,
    TOKENS_ALLOCATED_TO_PROOF: 1181031 * 10 ** 18,
    DECIMALS_POINTS: 10 ** 18,
    TOKEN_UNITS: 10 ** 18,
    START_TIMESTAMP: 1509541200,
    END_TIMESTAMP: 1512133200
  },
  addresses: {
    development: {
      WALLET_ADDRESS: '0x31Ebd457b999Bf99759602f5Ece5AA5033CB56B3',
      TOKEN_WALLET_ADDRESS: '0x31Ebd457b999Bf99759602f5Ece5AA5033CB56B3',
      PRESALE_TOKEN: '0xb571920C0b37b136F3880f28981a298bf9303FcD'
    },
    rinkeby: {
      WALLET_ADDRESS: '0x9fbdaac5faf6711f38ab26541b7c0d72cb2c0e11',
      TOKEN_WALLET_ADDRESS: '0x9fbdaac5faf6711f38ab26541b7c0d72cb2c0e11'
    },
    ropsten: {
      WALLET_ADDRESS: '',
      TOKEN_WALLET_ADDRESS: ''
    },
    ethereum: {
      WALLET_ADDRESS: '0x11e3de1bda2650fa6bc74e7cea6a39559e59b103',
      TOKEN_WALLET_ADDRESS: '0x11e3de1bda2650fa6bc74e7cea6a39559e59b103'
    }
  }
};

config.addresses.debug = config.addresses.novalex =
  config.addresses.development;

module.exports = config;
