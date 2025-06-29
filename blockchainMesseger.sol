// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract TheBlockchainMessenger {
    uint256 public changeCounter;

    address public myAddress;

    string public worldMessage;

    constructor() {
        myAddress = msg.sender;
    }

    function updateMessage(string memory _worldMessage) public {
        if (msg.sender == myAddress) {
            worldMessage = _worldMessage;
            changeCounter++;
        }
    }
}
