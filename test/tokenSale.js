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

import moment from 'moment';
import { TOKENS_ALLOCATED_TO_PROOF, ether } from '../scripts/testConfig.js';
import {
  getAddress,
  advanceToBlock,
  expectInvalidOpcode,
  waitUntilTransactionsMined,
  latestTime,
  increaseTime
} from '../scripts/helpers.js';
import {
  baseUnits,
  mintToken,
  getTokenBalance,
  getTotalSupply
} from '../scripts/tokenHelpers.js';
import { transferControl } from '../scripts/controlHelpers.js';
import {
  enableTransfers,
  buyTokens,
  finalize,
  getCap,
  getPrice,
  getPriceInWei,
  getBasePrice,
  getBasePriceInWei
} from '../scripts/tokenSaleHelpers.js';
import { pause, unpause } from '../scripts/pausableHelpers';

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
  let receiver = accounts[2];
  let hacker = accounts[3];
  let wallet = accounts[5];
  let novaWalletAddress = accounts[9];

  let startTime;
  let endTime;
  let contractUploadTime;

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

  describe('Token Information', async function() {
    beforeEach(async function() {
      await transferControl(novaToken, fund, tokenSaleAddress);
      await enableTransfers(tokenSale, fund);
      await increaseTime(moment.duration(1.1, 'day'));
    });

    it('should return the correct token supply', async function() {
      await buyTokens(tokenSale, sender, 1 * ether);

      let supply = await getTotalSupply(novaToken);
      let tokenSaleDisplaySupply = await getTotalSupply(tokenSale);
      supply.should.be.equal(tokenSaleDisplaySupply);
    });

    // the token balance of each token holder can also be displayed via the token sale contract - by routing towards the nova token balanceOf() method
    // we verify both balances are equal
    it('should return the correct token balance (tokenSale.balanceOf must be equal to novaToken.balanceOf)', async function() {
      await buyTokens(tokenSale, sender, 1 * ether);
      let senderBalance = await getTokenBalance(novaToken, sender);
      let senderDisplayBalance = await getTokenBalance(tokenSale, sender);
      senderBalance.should.be.equal(senderDisplayBalance);
    });
  });

  describe('Initial State', function() {
    beforeEach(async function() {
      await transferControl(novaToken, fund, tokenSaleAddress);
      await increaseTime(moment.duration(1.01, 'day'));
    });

    it('should initially set the multisig', async function() {
      let tokenSaleWallet = await tokenSale.novaMultiSig.call();
      tokenSaleWallet.should.be.equal(
        '0xE1e8fBf326eEed5ddAc1C4a5f757F218E69C86F3'
      );
    });

    it('should initially be linked to the Nova token', async function() {
      let tokenSaleToken = await tokenSale.novaToken.call();
      tokenSaleToken.should.be.equal(novaTokenAddress);
    });

    it('Initial Price should be equal to 0.0748 ether', async function() {
      let price = await getPrice(tokenSale);
      expect(price).almost.equal(0.85 * 0.088);
    });

    it('Base Price should be equal to 0.088 ether', async function() {
      let price = await getBasePrice(tokenSale);
      price.should.be.equal(0.088);
    });

    it('cap should be equal to remaining tokens adjusted to multiplier', async function() {
      let cap = await getCap(tokenSale);
      cap.should.be.equal(1068644);
    });
  });

  describe('Finalized state', function() {
    beforeEach(async function() {
      contractUploadTime = latestTime();
      startTime = contractUploadTime.add(1, 'day').unix();
      endTime = contractUploadTime.add(31, 'day').unix();
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

      tokenSale = await TokenSale.new(novaTokenAddress, startTime, endTime);

      tokenSaleAddress = await getAddress(tokenSale);
      transferControl(novaToken, fund, tokenSaleAddress);
    });

    it('should initially not be finalized', async function() {
      let finalized = await tokenSale.finalized.call();
      finalized.should.be.false;
    });

    it('should not be finalizeable if the token sale is not paused', async function() {
      await expectInvalidOpcode(finalize(tokenSale, fund));
      let finalized = await tokenSale.finalized.call();
      finalized.should.be.false;
    });

    it('should be finalizeable if the token sale is paused', async function() {
      await pause(tokenSale, fund);
      await finalize(tokenSale, fund);
      let finalized = await tokenSale.finalized.call();
      finalized.should.be.true;
    });

    it('should not be finalizeable if the token sale is paused/unpaused', async function() {
      await pause(tokenSale, fund);
      await unpause(tokenSale, fund);
      await expectInvalidOpcode(finalize(tokenSale, fund));
      let finalized = await tokenSale.finalized.call();
      finalized.should.be.false;
    });

    it('should not be finalizeable by non-owner', async function() {
      await pause(tokenSale, fund);
      await expectInvalidOpcode(finalize(tokenSale, hacker));
      let finalized = await tokenSale.finalized.call();
      finalized.should.be.false;
    });
  });
});
