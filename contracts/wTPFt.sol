// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

error NotApproved(address user);
error InsufficientBalance(address user, uint256 balance, uint256 requiredAmount);
error InsufficientAllowance(address spender, uint256 allowedAmount, uint256 requiredAmount);

/**
 * @title WrappedTPFt
 * @dev This contract wraps an ERC1155 token (TPFt) into an ERC20 token (wTPFt), enabling users to mint and burn wrapped tokens.
 */
contract WrappedTPFt is ERC20, ERC20Pausable, Ownable, ERC20Permit, ERC1155Holder, ReentrancyGuard {
    uint256 public TPFtId;       // ID of the specific token in the ERC1155 contract
    address public TPFtAddress;  // Address of the ERC1155 token contract (TPFt)

    // Events
    event Wrap(address indexed investorAddress, uint256 id, uint256 amount);
    event Redeem(address indexed investorAddress, uint256 id, uint256 amount);

    /**
     * @dev Modifier to ensure that the caller has sufficient balance of the wrapped ERC1155 token.
     * @param _amount The amount of the token being checked.
     */
    modifier hasSufficientBalance(uint256 _amount) {
        if (IERC1155(TPFtAddress).balanceOf(msg.sender, TPFtId) < _amount) {
            revert InsufficientBalance(msg.sender, IERC1155(TPFtAddress).balanceOf(msg.sender, TPFtId), _amount);
        }
        _;
    }

    /**
     * @dev Modifier to ensure that the caller has approved the contract to transfer the token on their behalf.
     */
    modifier isApprovedForTransfer() {
        if (!IERC1155(TPFtAddress).isApprovedForAll(msg.sender, address(this))) {
            revert NotApproved(msg.sender);
        }
        _;
    }

    /**
     * @dev Sets the initial values for the contract, including the owner, ERC1155 token address, and token ID.
     * @param _initialOwner The initial owner of the contract.
     * @param _TPFtAddress The address of the ERC1155 token contract.
     * @param _TPFtId The ID of the specific ERC1155 token to be wrapped.
     */
    constructor(address _initialOwner, address _TPFtAddress, uint256 _TPFtId)
        ERC20("Wrapped TPFt", "wTPFt")
        Ownable(_initialOwner)
        ERC20Permit("Wrapped TPFt")
    {
        TPFtAddress = _TPFtAddress;
        TPFtId = _TPFtId;
        transferOwnership(_initialOwner);
    }

    /**
     * @dev Allows a user to wrap their ERC1155 tokens into the ERC20 wrapped token.
     * The user must have sufficient balance of the original token and have approved the contract to transfer tokens.
     * @param _amount The amount of tokens to wrap.
     */
    function wrap(uint256 _amount) public nonReentrant isApprovedForTransfer hasSufficientBalance(_amount) {
        // Transfer ERC1155 tokens from the user to the contract
        IERC1155(TPFtAddress).safeTransferFrom(msg.sender, address(this), TPFtId, _amount, "0x0");
        
        // Mint the equivalent amount of the wrapped ERC20 tokens
        _mint(msg.sender, _amount);

        emit Wrap(msg.sender, TPFtId, _amount);
    }

    /**
     * @dev Allows a user to redeem their wrapped ERC20 tokens for the original ERC1155 tokens.
     * The user must have sufficient allowance and balance of the wrapped tokens.
     * @param _amount The amount of wrapped tokens to redeem.
     */
    function redeem(uint256 _amount) public nonReentrant {
        // Check if the user has approved the contract to spend the specified amount of wrapped tokens
        if (allowance(msg.sender, address(this)) < _amount) {
            revert InsufficientAllowance(msg.sender, allowance(msg.sender, address(this)), _amount);
        }

        // Ensure the user has enough wrapped tokens to redeem
        if (balanceOf(msg.sender) < _amount) {
            revert InsufficientBalance(msg.sender, balanceOf(msg.sender), _amount);
        }

        // Spend the user's allowance and burn the equivalent amount of wrapped tokens
        _spendAllowance(msg.sender, address(this), _amount);
        _burn(msg.sender, _amount);

        // Transfer the original ERC1155 tokens back to the user
        IERC1155(TPFtAddress).safeTransferFrom(address(this), msg.sender, TPFtId, _amount, "0x0");

        emit Redeem(msg.sender, TPFtId, _amount);
    }

    /**
     * @dev Pauses the contract, disabling token transfers and minting.
     * Only callable by the owner.
     */
    function pause() public onlyOwner {
        _pause();
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpauses the contract, re-enabling token transfers and minting.
     * Only callable by the owner.
     */
    function unpause() public onlyOwner {
        _unpause();
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Internal function to update the balances during a transfer, with pausable functionality.
     * @param from The address sending the tokens.
     * @param to The address receiving the tokens.
     * @param value The value being transferred.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
