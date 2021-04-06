var swipeIWO = artifacts.require("./SwipeIWO.sol");
var baseToken = artifacts.require("./BaseToken.sol");
var saleToken = artifacts.require("./SaleToken.sol");

module.exports = function (deployer) {
  deployer.deploy(swipeIWO);
  deployer.deploy(baseToken);
  deployer.deploy(saleToken);
};
