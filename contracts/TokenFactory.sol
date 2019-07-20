pragma solidity 0.4.17;

import './NovaToken.sol';
import './Ownable.sol';

contract TokenFactory {

    function createCloneToken(
        address _parentToken,
        uint _snapshotBlock,
        string _tokenName,
        string _tokenSymbol
        ) public returns (NovaToken) 
    {

        NovaToken newToken = new NovaToken(
            this,
            _parentToken,
            _snapshotBlock,
            _tokenName,
            _tokenSymbol
        );

        newToken.transferControl(msg.sender);
        return newToken;
    }
}