// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MultiSigWallet {
    address[] public owners;
    mapping(address => bool) isOwner;

    uint256 public necessaryApprovals;

    mapping(uint256 => Transaction) public transactions;
    uint256 public currentTransactionId;

    struct Transaction {
        address from;
        address payable to;
        uint256 ammount;
        uint256 timestamp;
        mapping(address => bool) hasApproved;
        uint256 approvalCount;
        bool isApproved;
        bool isProccesed;
    }

    modifier contructorGuard(
        address[] memory _owners,
        uint256 _necessaryApprovals
    ) {
        require(
            _owners.length >= _necessaryApprovals,
            "The number of approvals must me equal or less than the length of owners"
        );
        _;
    }

    modifier onlyOwner(address _sender) {
        require(isOwner[_sender] == true, "You are not one of the owners");
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

    modifier proccessedGuard(uint256 _transactionId) {
        require(
            transactions[_transactionId].isProccesed == false,
            "Double spending is not allowed"
        );
        _;
    }

    modifier balanceGuard(uint256 _amount) {
        uint256 contractBalance = address(this).balance;
        require(
            _amount <= contractBalance,
            "Trancaction ammount exceeds contracts balance"
        );
        _;
    }

    constructor(address[] memory _owners, uint256 _necessaryApprovals)
        contructorGuard(_owners, _necessaryApprovals)
    {
        for (uint256 i = 0; i < _owners.length; i++) {
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
        }
        necessaryApprovals = _necessaryApprovals;
    }

    function addTransaction(address payable _to, uint256 _ammount)
        public
        balanceGuard(_ammount)
    {
        Transaction storage transaction = transactions[currentTransactionId];

        transaction.from = msg.sender;
        transaction.to = _to;
        transaction.ammount = _ammount;
        transaction.timestamp = block.timestamp;

        currentTransactionId++;
    }

    function approveTransaction(uint256 _transactionId)
        public
        onlyOwner(msg.sender)
        singleApprovalGuard(msg.sender, _transactionId)
    {
        transactions[_transactionId].hasApproved[msg.sender] = true;
        transactions[_transactionId].approvalCount++;

        if (transactions[_transactionId].approvalCount >= necessaryApprovals) {
            exectueTransaction(_transactionId, msg.sender);
        }
    }

    function exectueTransaction(uint256 _transactionId, address _sender)
        public
        payable
        onlyOwner(_sender)
        balanceGuard(transactions[_transactionId].ammount)
        approvalGuard(_transactionId)
        proccessedGuard(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];

        transaction.isApproved = true;
        transaction.isProccesed = true;
        transaction.to.transfer(transaction.ammount);
    }

    receive() external payable {}
}
