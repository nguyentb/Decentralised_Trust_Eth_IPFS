var FeEx = artifacts.require("./FeEx.sol");
var Reputation = artifacts.require("./Reputation.sol");

module.exports = function(deployer) {
  deployer.deploy(FeEx);
  deployer.deploy(Reputation);
};