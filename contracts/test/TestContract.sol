// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;


contract TestContract {
    
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }
}