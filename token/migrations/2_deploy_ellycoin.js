var Ellycoin = artifacts.require("./Ellycoin.sol");

module.exports = function (deployer) {
  deployer.deploy(Ellycoin);
};
