// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MultipleOwners.sol";

contract MultiSigWallet is MultipleOwners {
    uint256 public necessaryApprovals;

    mapping(uint256 => Transaction) public transactions;
    uint256 public currentTransactionId;

    mapping(uint256 => Fund) public funds;
    uint256 public currentFundId;


    struct Fund {
        address from;
        uint256 value;
        uint256 timestamp;
    }

    struct Transaction {
        address from;
        address payable to;
        uint256 amount;
        uint256 timestamp;
        mapping(address => bool) hasApproved;
        uint256 approvalCount;
        bool isApproved;
        bool isProcessed;
    }

    modifier constructorGuard(
        address[] memory _owners,
        uint256 _necessaryApprovals
    ) {
        require(
            _owners.length >= _necessaryApprovals,
            "The number of approvals must me equal or less than the length of owners"
        );
        _;
    }

    modifier singleApprovalGuard(address _sender, uint256 transactionId) {
        require(
            transactions[transactionId].hasApproved[_sender] == false,
            "You already approved the transaction"
        );
        _;
    }

    modifier approvalGuard(uint256 _transactionId) {
        require(
            transactions[_transactionId].approvalCount >= necessaryApprovals,
            "Necessary approvals are not reached"
        );
        _;
    }

    modifier processedGuard(uint256 _transactionId) {
        require(
            transactions[_transactionId].isProcessed == false,
            "Double spending is not allowed"
        );
        _;
    }

    modifier balanceGuard(uint256 _amount) {
        uint256 contractBalance = address(this).balance;
        require(
            _amount <= contractBalance,
            "Transaction amount exceeds contracts balance"
        );
        _;
    }

    event TransactionAdded();
    event TransactionApproved();


    constructor(address[] memory _owners, uint256 _necessaryApprovals)
    MultipleOwners(_owners)
    constructorGuard(_owners, _necessaryApprovals)
    {
        necessaryApprovals = _necessaryApprovals;
    }

    function addTransaction(address payable _to, uint256 _amount)
    public
    balanceGuard(_amount)
    {
        Transaction storage transaction = transactions[currentTransactionId];

        transaction.from = msg.sender;
        transaction.to = _to;
        transaction.amount = _amount;
        transaction.timestamp = block.timestamp;

        currentTransactionId++;

        emit TransactionAdded();
    }

    function approveTransaction(uint256 _transactionId)
    public
    onlyOwner(msg.sender)
    singleApprovalGuard(msg.sender, _transactionId)
    {
        transactions[_transactionId].hasApproved[msg.sender] = true;
        transactions[_transactionId].approvalCount++;

        if (transactions[_transactionId].approvalCount >= necessaryApprovals) {
            executeTransaction(_transactionId, msg.sender);
        }
        emit TransactionApproved();
    }

    function executeTransaction(uint256 _transactionId, address _sender)
    public
    payable
    onlyOwner(_sender)
    balanceGuard(transactions[_transactionId].amount)
    approvalGuard(_transactionId)
    processedGuard(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];

        transaction.isApproved = true;
        transaction.isProcessed = true;
        transaction.to.transfer(transaction.amount);
    }

    function addFund() payable public {
        funds[currentFundId].value = msg.value;
        funds[currentFundId].from = msg.sender;
        funds[currentFundId].timestamp = block.timestamp;
        currentFundId++;
    }


}
