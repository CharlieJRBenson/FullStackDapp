//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Motivation {
    string[] motivations;

    constructor(string memory _motivation) {
        motivations.push(_motivation);
    }

    function motivate(uint _i) public view returns (string memory) {
        return motivations[_i];
    }

    function addMotivation(string memory _motivation) public {
        motivations.push(_motivation);
    }

    function size() public view returns (uint){
        return motivations.length;
    }
}