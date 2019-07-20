const BigNumber = web3.BigNumber;
let chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var chaiStats = require('chai-stats');
var chaiBigNumber = require('chai-bignumber')(BigNumber);
chai
  .use(chaiAsPromised)
  .use(chaiBigNumber)
  .use(chaiStats)
  .should();

import { TOKENS_ALLOCATED_TO_PROOF } from '../scripts/testConfig.js';
import { getAddress, latestTime } from '../scripts/helpers.js';
import { baseUnits, mintToken } from '../scripts/tokenHelpers.js';
import { transferOwnership } from '../scripts/ownershipHelpers.js';
import { transferControl } from '../scripts/controlHelpers.js';
import { getPrice } from '../scripts/tokenSaleHelpers.js';

const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

const NovaPresaleToken = artifacts.require('./NovaPresaleToken.sol');
const NovaToken = artifacts.require('./NovaToken.sol');
const TokenSale = artifacts.require('./TokenSale.sol');

contract('Crowdsale', accounts => {
  let fund = accounts[0];
  let tokenSale;
  let tokenSaleAddress;
  let novaToken;
  let novaPresaleToken;
  let novaPresaleTokenAddress;
  let novaTokenAddress;
  let sender = accounts[1];
  let novaWalletAddress = accounts[9];

  let startTime;
  let endTime;
  let contractUploadTime;

  let novaMultiSig = '0xE1e8fBf326eEed5ddAc1C4a5f757F218E69C86F3';

  beforeEach(async function() {
    novaPresaleToken = await NovaPresaleToken.new();
    novaPresaleTokenAddress = await getAddress(novaPresaleToken);

    novaToken = await NovaToken.new(
      '0x0',
      '0x0',
      0,
      'Nova Token Test',
      'PRFT Test'
    );

    novaTokenAddress = await getAddress(novaToken);

    contractUploadTime = latestTime();
    startTime = contractUploadTime.add(1, 'day').unix();
    endTime = contractUploadTime.add(31, 'day').unix();

    tokenSale = await TokenSale.new(novaTokenAddress, startTime, endTime);

    tokenSaleAddress = await getAddress(tokenSale);
  });

  // it('should be ended only after end', async function() {
  //   let ended = await tokenSale.hasEnded()
  //   ended.should.equal(false)
  // })

  describe('Initial State', function() {
    beforeEach(async function() {
      transferControl(novaToken, fund, tokenSaleAddress);
    });

    it('should initially set the multisig', async function() {
      let multisig = await tokenSale.novaMultiSig.call();
      multisig.should.be.equal(novaMultiSig);
    });

    it('should initially be linked to the Nova token', async function() {
      let token = await tokenSale.novaToken.call();
      token.should.be.equal(novaTokenAddress);
    });

    it('Token base price should be equal to 0.0748 ether', async function() {
      let price = await getPrice(tokenSale);
      expect(price).almost.equal(0.85 * 0.088);
    });
  });
});
