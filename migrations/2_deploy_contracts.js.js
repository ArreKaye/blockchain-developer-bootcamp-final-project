const IntermediateMarket = artifacts.require("./IntermediateMarket.sol");

module.exports = function (deployer) {
  deployer.deploy(IntermediateMarket);
};

