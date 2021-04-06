const BigNumber = require('bignumber.js');

const divByDecimal = (v, d = 18) => {
  return new BigNumber(v).div(new BigNumber(10).pow(d)).toString(10);
}

const callMethod = async (method, args = []) => {
  const result = await method(...args).call();
  return result;
};

const bnToString = (v, d = 18) => {
  return new BigNumber(v).toString(10);
}

module.exports = {
  divByDecimal,
  bnToString,
  callMethod
}
