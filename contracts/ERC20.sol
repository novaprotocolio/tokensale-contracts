pragma solidity 0.4.17;

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 {

  uint256 public totalSupply;

  function balanceOf(address _owner) constant returns (uint256);
  function transfer(address _to, uint256 _value) returns (bool);
  function transferFrom(address _from, address _to, uint256 _amount) returns (bool);
  function approve(address _spender, uint256 _amount) returns (bool);
  function allowance(address _owner, address _spender) constant returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

}