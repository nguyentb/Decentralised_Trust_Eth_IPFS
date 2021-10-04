// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}

contract DDS {
  function ePayment(address _storageNode,
    unit _amount, string _datahash) {
    ...
    if (success) {
      //call FeEx using deployed address scAddr
      FeEx fe = FeEx(scAddr);
      fe.enFeedback(msg.sender, _storageNode,
      string _transID);
    }
  }
}
contract FeEx {
  function enFeedback(address _owner,
    address _storageNode, string _transID);
  function expCal(address _owner, uint _fbScore,
    address _storageNode, string _transID);
}

