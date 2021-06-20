// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract MultipleOwners{
    address[] public owners;
    mapping(address => bool) isOwner;

        modifier onlyOwner(address _sender) {
        require(isOwner[_sender] == true, "You are not one of the owners");
        _;
    }

        constructor(address[] memory _owners)
    {
        for (uint256 i = 0; i < _owners.length; i++) {
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
        }
    }
}