pragma solidity 0.4.17;

import './NovaToken.sol';

contract TokenFactoryInterface {

    function createCloneToken(
        address _parentToken,
        uint _snapshotBlock,
        string _tokenName,
        string _tokenSymbol
      ) public returns (NovaToken newToken);
}