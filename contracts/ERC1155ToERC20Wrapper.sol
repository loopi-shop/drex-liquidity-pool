// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "hardhat/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155ToERC20Wrapper is IERC20, Ownable {
    IERC1155 public immutable _1155Token_;
    uint256 public immutable _1155TokenId_;
    

    constructor(address initialOwner, address _1155TokenAddress, uint256 _1155TokenId)
        Ownable(initialOwner)
    {
        _1155Token_ = IERC1155(_1155TokenAddress);
        _1155TokenId_ = _1155TokenId;
        // _1155Token_.setApprovalForAll(address(this), true);
    }

    function  totalSupply() public view virtual returns (uint256){
        return ERC1155Supply(address(_1155Token_)).totalSupply(_1155TokenId_);
    }

    function balanceOf(address account) public view virtual returns (uint256){
        return _1155Token_.balanceOf(account, _1155TokenId_);
    }

    function transfer(address recipient, uint256 amount) public virtual returns (bool) {
        console.log("TRANSFER", _msgSender(), recipient);
        _1155Token_.safeTransferFrom(_msgSender(), recipient, _1155TokenId_, amount, "0x0");
        return true;
    }

    function allowance(address owner, address spender) public view virtual returns (uint256){
        uint256 max = type(uint256).max;
        if (_1155Token_.isApprovedForAll(owner, spender)) {
            return max;
        } else {
            return 0;
        }
    }

    function approve(address spender, uint256 amount) public virtual returns (bool) {
        _1155Token_.setApprovalForAll(address(this), true);
        _1155Token_.setApprovalForAll(spender, true);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool) {
        _1155Token_.safeTransferFrom(sender, recipient, _1155TokenId_, amount, "0x0");
        return true;
    }
}