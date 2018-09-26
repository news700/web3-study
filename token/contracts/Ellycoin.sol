pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Ellycoin is StandardToken {
  string public name = "Ellycoin";
  string public symbol = "ELY";
  uint public decimals = 9;
  uint public INITIAL_SUPPLY = 10 * (10 ** decimals);

  function Ellycoin() public {
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}
