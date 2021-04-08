const fs = require('fs');
const swipeIWO = artifacts.require("./SwipeIWO.sol");
const baseToken = artifacts.require("./BaseToken.sol");
const saleToken = artifacts.require("./SaleToken.sol");

function expertContractJSON(contractName, instance) {
  const path = "./test/abis/" + contractName + ".json";
  const data = {
    contractName,
    "address": instance.address,
    "abi": instance.abi
  }

  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('Contract data written to file');
  });  
};

module.exports = async function (deployer) {
  await deployer.deploy(swipeIWO);
  await deployer.deploy(baseToken);
  await deployer.deploy(saleToken);

  expertContractJSON('swipeIWO', swipeIWO);
  expertContractJSON('baseToken', baseToken);
  expertContractJSON('saleToken', saleToken);
};
