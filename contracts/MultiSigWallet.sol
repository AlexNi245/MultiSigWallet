// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/open-zeppelin/Ownable.sol";

contract MultiSigWallet is Ownable {
    //Todo
    //1. Constuctor How man sigs; How many approvals;

    modifier contructorGuard(
        address[] memory owners,
        uint256 
        necessaryApprovals
    ) {
        require(
            owners.length >= necessaryApprovals,
            "The number of approvals must me equal or less than the length of owners"
        );
        _;
    }

    constructor(address[] memory owners, uint256 necessaryApprovals)
        contructorGuard(owners, necessaryApprovals)
    {}
}
