const swipeIWO = artifacts.require('SwipeIWO');
const baseToken = artifacts.require('BaseToken');
const saleToken = artifacts.require('SaleToken');
const swipeIWOABI = require('./abis/swipeIWO.json');
const baseTokenABI = require('./abis/baseToken.json');
const saleTokenABI = require('./abis/saleToken.json');
const truffleAssert = require('truffle-assertions');
const BigNumber = require('bignumber.js');

const { 
  callMethod
}  =  require('./utils');

contract("SwipeIWO", async (accounts) => {
  const deployer = accounts[0];
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const defaultValue = '1000000000000000000';
  let lastBlockTimeStamp;
  
  beforeEach(async () => {
    // Create Instances
    this.swipeIWOInstance = await swipeIWO.new({ from: deployer });
    // Get Current Block
    const currentBlockNumber = await new web3.eth.getBlockNumber();
    const currentBlock = await new web3.eth.getBlock(currentBlockNumber);
    lastBlockTimeStamp = currentBlock.timestamp.toString();
    
    this.baseTokenInstance = await baseToken.new({ from: deployer });
    this.saleTokenInstance = await saleToken.new({ from: deployer });

    // Create Contracts
    this.swipeIWO = await new web3.eth.Contract(swipeIWOABI.abi, this.swipeIWOInstance.address);
    this.baseToken = await new web3.eth.Contract(baseTokenABI.abi, this.baseTokenInstance.address);
    this.saleToken = await new web3.eth.Contract(saleTokenABI.abi, this.saleTokenInstance.address);
  });
  
  describe('Base Token Test', async() => {
    let baseToken;
    beforeEach(async() => {
      baseToken = this.baseTokenInstance.address;
    });

    it ('Check Initial Base Token', async() => {
      // Get Base Token Address
      const baseTokenAddress = await callMethod(this.swipeIWO.methods.getBaseToken, []);
      // Check Base Token Address
      assert.equal(baseTokenAddress, zeroAddress);
    });

    it ('Check Set Base Token', async() => {
      // Set Base Token Address
      await this.swipeIWOInstance.setBaseToken(baseToken);
      // Get Base Token Address
      const baseTokenAddress = await callMethod(this.swipeIWO.methods.getBaseToken, []);
      // Check Base Token Address
      assert.equal(baseTokenAddress, baseToken);
    });
  });

  describe('Sale Token Test', async() => {
    let saleToken;
    beforeEach(async() => {
      saleToken = this.saleTokenInstance.address;
    });

    it ('Check Initial Sale Token', async() => {
      // Get Sale Token Address
      const saleTokenAddress = await callMethod(this.swipeIWO.methods.getSaleToken, []);
      // Check Sale Token Address
      assert.equal(saleTokenAddress, zeroAddress);
    });

    it ('Check Set Sale Token', async() => {
      // Set Sale Token Address
      await this.swipeIWOInstance.setSaleToken(saleToken);
      // Get Sale Token Address
      const saleTokenAddress = await callMethod(this.swipeIWO.methods.getSaleToken, []);
      // Check Sale Token Address
      assert.equal(saleTokenAddress, saleToken);
    });
  });

  describe('Sale Rate Test', async() => {
    const newSaleRate = '15000000000000000000';

    it ('Check Initial Sale Rate', async() => {
      // Get Sale Rate
      const saleRate = await callMethod(this.swipeIWO.methods.getSaleRate, []);
      // Check Sale Rate
      assert.equal(saleRate, defaultValue);
    });

    it ('Check Set Sale Rate', async() => {
      // Set Sale Rate
      await this.swipeIWOInstance.setSaleRate(newSaleRate);
      // Get Sale Rate
      const saleRate = await callMethod(this.swipeIWO.methods.getSaleRate, []);
      // Check Sale Rate
      assert.equal(saleRate, newSaleRate);
    });
  });

  describe('Is Sale Test', async() => {
    const saleFlag = true;

    it ('Check Initial IsSale', async() => {
      // Get IsSale
      const isSale = await callMethod(this.swipeIWO.methods.getIsSale, []);
      // Check IsSale
      assert.equal(isSale, false);
    });

    it ('Check Set IsSale', async() => {
      // Set Is Sale
      await this.swipeIWOInstance.setIsSale(saleFlag);
      // Get IsSale
      const isSale = await callMethod(this.swipeIWO.methods.getIsSale, []);
      // Check Is Sale
      assert.equal(isSale, saleFlag);
    });
  });

  describe('Start Time Test', async() => {
    let newStartTime;

    beforeEach(() => {
      newStartTime = (parseInt(lastBlockTimeStamp, 10) + 100).toString();
    })

    it ('Check Initial Start Time', async() => {
      // Get StartTime
      const startTime = await callMethod(this.swipeIWO.methods.getStartTime, []);
      // Check StartTime
      assert.equal(startTime, lastBlockTimeStamp);
    });

    it ('Check Set Start Time', async() => {
      // Set Start Time
      await this.swipeIWOInstance.setStartTime(newStartTime);
      // Get Start Time
      const startTime = await callMethod(this.swipeIWO.methods.getStartTime, []);
      // Check Start Time
      assert.equal(startTime, newStartTime);
    });
  });

  describe('End Time Test', async() => {
    let newEndTime;

    beforeEach(() => {
      newEndTime = (parseInt(lastBlockTimeStamp, 10) + 200).toString();
    })

    it ('Check Initial End Time', async() => {
      // Get EndTime
      const endTime = await callMethod(this.swipeIWO.methods.getEndTime, []);
      // Check EndTime
      assert.equal(endTime, lastBlockTimeStamp);
    });

    it ('Should Be More than First Time', async() => {
      // Set Start Time
      await this.swipeIWOInstance.setStartTime(newEndTime);
      // Set End Time
      await truffleAssert.reverts(this.swipeIWOInstance.setEndTime(newEndTime), "EndTime should be over than startTime");
    });

    it ('Check Set End Time', async() => {
      // Set End Time
      await this.swipeIWOInstance.setEndTime(newEndTime);
      // Get End Time
      const endTime = await callMethod(this.swipeIWO.methods.getEndTime, []);
      // Check End Time
      assert.equal(endTime, newEndTime);
    });
  });

  describe('Min Base Amount Test', async() => {
    let newMinBaseAmount;

    beforeEach(() => {
      newMinBaseAmount = '2000000000000000000'; // 2 baseToken
    })

    it ('Check Initial Min Base Amount', async() => {
      // Get Min Base Amount
      const minBaseAmount = await callMethod(this.swipeIWO.methods.getMinBaseAmount, []);
      // Check Min Base Amount
      assert.equal(minBaseAmount, defaultValue);
    });

    it ('Check Set Min Base Amouont', async() => {
      // Set Min Base Amount
      await this.swipeIWOInstance.setMinBaseAmount(newMinBaseAmount);
      // Get Min Base Amount
      const minBaseAmount = await callMethod(this.swipeIWO.methods.getMinBaseAmount, []);
      // Check Min Base Amount
      assert.equal(minBaseAmount, newMinBaseAmount);
    });
  });

  describe('Max Base Amount Test', async() => {
    let newMaxBaseAmount;

    beforeEach(() => {
      newMaxBaseAmount = '3000000000000000000'; // 3 baseToken
    })

    it ('Check Initial Max Base Amount', async() => {
      // Get Max Base Amount
      const maxBaseAmount = await callMethod(this.swipeIWO.methods.getMaxBaseAmount, []);
      // Check Max Base Amount
      assert.equal(maxBaseAmount, defaultValue);
    });

    it ('Should Be More than Min Base Amount', async() => {
      // Set Min Base Amount
      await this.swipeIWOInstance.setMinBaseAmount(newMaxBaseAmount);
      // Set Max Base Amount
      await truffleAssert.reverts(this.swipeIWOInstance.setMaxBaseAmount(newMaxBaseAmount), "MaxBaseAmount should be over than minBaseAmount");
    });

    it ('Check Set Max Base Amount', async() => {
      // Set Max Base Amount
      await this.swipeIWOInstance.setMaxBaseAmount(newMaxBaseAmount);
      // Get Max Base Amount
      const maxBaseAmount = await callMethod(this.swipeIWO.methods.getMaxBaseAmount, []);
      // Check Max Base Amount
      assert.equal(maxBaseAmount, newMaxBaseAmount);
    });
  });

  describe('Limit Base Amount Test', async() => {
    let newLimitBaseAmount;

    beforeEach(() => {
      newLimitBaseAmount = '10000000000000000000'; // 10 baseToken
    })

    it ('Check Initial Limit Base Amount', async() => {
      // Get Limit Base Amount
      const limitBaseAmount = await callMethod(this.swipeIWO.methods.getLimitBaseAmount, []);
      // Check Limit Base Amount
      assert.equal(limitBaseAmount, defaultValue);
    });

    it ('Check Set Limit Base Amouont', async() => {
      // Set Limit Base Amount
      await this.swipeIWOInstance.setLimitBaseAmount(newLimitBaseAmount);
      // Get Limit Base Amount
      const limitBaseAmount = await callMethod(this.swipeIWO.methods.getLimitBaseAmount, []);
      // Check Limit Base Amount
      assert.equal(limitBaseAmount, newLimitBaseAmount);
    });
  });

  describe('Allocation Amount Test', async() => {
    let allocationAmount = '100000000000000000000'; // 100 Sale Token
    let maxAllocationAmount;
    let saleTotalSupply;

    beforeEach(async() => {
      saleTotalSupply = await callMethod(this.saleToken.methods.totalSupply, []);
      maxAllocationAmount = new BigNumber(saleTotalSupply).plus(1);

      // Set Sale Token
      await this.swipeIWOInstance.setSaleToken(
        this.saleTokenInstance.address
      );
    });

    it ('Check Owner', async() => {
      // Call allocationAmount with different address
      await truffleAssert.reverts(
        this.swipeIWOInstance.allocationAmount(allocationAmount, { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it ('Check allocationAmount more than balance of Owner', async() => {
      // Call allocationAmount with maxAllocationAmount
      await truffleAssert.reverts(
        this.swipeIWOInstance.allocationAmount(maxAllocationAmount.toFixed()),
        "Owner should have more than amount with Sale Token"
      );
    });

    it ('Check allocationAmount', async() => {
      // Approve the Amount
      await this.saleTokenInstance.approve(this.swipeIWOInstance.address, allocationAmount, { from: deployer });
      // Call allocationAmount
      await this.swipeIWOInstance.allocationAmount(allocationAmount, { from: deployer });
      // Get Balance of SwipeIWO with saleToken
      const balanceSakeToken = await callMethod(
        this.saleToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );
      // Check Balance
      assert.equal(balanceSakeToken, allocationAmount);
    });
  });

  describe('Burn Base Token Test', async() => {
    const baseAmount = '100000000000000000000'; // 100 Base Token
    const maxBurnAmount = (new BigNumber(baseAmount)).plus(1);
    const burnAmount = '10000000000000000000'; // 10 Base Token

    beforeEach(async() => {
      // Set Base Token
      await this.swipeIWOInstance.setBaseToken(
        this.baseTokenInstance.address
      );

      // Transfer baseAmount to Contract
      await this.baseTokenInstance.transfer(
        this.swipeIWOInstance.address,
        baseAmount
      );
    });

    it ('Check Balance of Contract', async() => {
      // Get Balance
      const baseBalance = await callMethod(
        this.baseToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );

      // Check Balance
      assert.equal(baseBalance, baseAmount);
    });

    it ('Check Owner', async() => {
      // Call burnBaseToken with different address
      await truffleAssert.reverts(
        this.swipeIWOInstance.burnBaseToken(baseAmount, { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it ('Check baseAmount more than balance of Contract', async() => {
      // Call burnBaseToken with maxBurnAmount
      await truffleAssert.reverts(
        this.swipeIWOInstance.burnBaseToken(maxBurnAmount.toFixed()),
        "Burn Amount should be less than balance of contract"
      );
    });

    it ('Check burnBaseToken', async() => {
      // Get Original Total Supply
      const originalTotalSupply = await callMethod(
        this.baseToken.methods.totalSupply
      );

      // Burn BaseToken with burnAmount
      await this.swipeIWOInstance.burnBaseToken(burnAmount);

      // Check Contract Balance
      const remainAmount = new BigNumber(baseAmount).minus(new BigNumber(burnAmount));
      const remainBalance = await callMethod(
        this.baseToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );
      assert.equal(remainBalance, remainAmount.toFixed());

      // // Check Base Token Total Supply
      // const remainTotalSupply = new BigNumber(originalTotalSupply).minus(new BigNumber(burnAmount));
      // const newTotalSupply = await callMethod(
      //   this.baseToken.methods.totalSupply
      // );
      // assert.equal(newTotalSupply, remainTotalSupply.toFixed());
    });
  });

  describe('Withdraw Base Token Test', async() => {
    const baseAmount = new BigNumber('100000000000000000000'); // 100 Base Token
    const withdrawAmount = new BigNumber('50000000000000000000'); // 50 Base Token

    beforeEach(async() => {
      // Set Base Token
      await this.swipeIWOInstance.setBaseToken(
        this.baseTokenInstance.address
      );
    });

    it ('Check Owner', async() => {
      // Call withdrawBaseToken with different address
      await truffleAssert.reverts(
        this.swipeIWOInstance.withdrawBaseToken(
          accounts[2],
          withdrawAmount.toFixed(),
          { 
            from: accounts[1]
          }
        ),
        "Ownable: caller is not the owner"
      );
    });

    it ('Check Initial withdrawBaseToken', async() => {
      // Call burnBaseToken initially
      await truffleAssert.reverts(
        this.swipeIWOInstance.withdrawBaseToken(
          accounts[1],
          withdrawAmount.toFixed()
        ),
        "The withdrawAmount should be less than balance"
      );
    });

    it ('Check withdrawBaseToken', async() => {
      // Transfer baseAmount to Contract
      await this.baseTokenInstance.transfer(
        this.swipeIWOInstance.address,
        baseAmount
      );

      // Get Base Balance of Contract
      const baseBalance = await callMethod(
        this.baseToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );
      // Check Balance
      assert.equal(baseBalance, baseAmount);

      // Withdraw BaseToken To Withdrawal Address
      await this.swipeIWOInstance.withdrawBaseToken(
        accounts[1],
        withdrawAmount
      );

      // Check Contract Balance
      const newBalanceOfContract = await callMethod(
        this.baseToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );
      assert.equal(
        newBalanceOfContract,
        baseAmount.minus(withdrawAmount).toFixed()
      );

      // Check Base Balance Of Withdrawal Address
      const baseBalanceOfWithdrawalAddress = await callMethod(
        this.baseToken.methods.balanceOf,
        [accounts[1]]
      );
      assert.equal(baseBalanceOfWithdrawalAddress, withdrawAmount.toFixed());
    });
  });

  describe('Withdraw Sale Token Test', async() => {
    const saleAmount = new BigNumber('100000000000000000000'); // 100 Sale Token
    const withdrawAmount = new BigNumber('50000000000000000000'); // 50 Sale Token

    beforeEach(async() => {
      // Set Sale Token
      await this.swipeIWOInstance.setSaleToken(
        this.saleTokenInstance.address
      );
    });

    it ('Check Owner', async() => {
      // Call withdrawSaleToken with different address
      await truffleAssert.reverts(
        this.swipeIWOInstance.withdrawSaleToken(
          accounts[2],
          withdrawAmount.toFixed(),
          {
            from: accounts[1]
          }
        ),
        "Ownable: caller is not the owner"
      );
    });

    it ('Check Initial withdrawSaleToken', async() => {
      // Call burnSaleToken initially
      await truffleAssert.reverts(
        this.swipeIWOInstance.withdrawSaleToken(
          accounts[1],
          withdrawAmount.toFixed()
        ),
        "The withdrawAmount should be less than balance"
      );
    });

    it ('Check withdrawSaleToken', async() => {
      // Transfer saleAmount to Contract
      await this.saleTokenInstance.transfer(
        this.swipeIWOInstance.address,
        saleAmount
      );

      // Get Sale Balance of Contract
      const saleBalance = await callMethod(
        this.saleToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );
      // Check Balance
      assert.equal(saleBalance, saleAmount);

      // Withdraw SaleToken To Withdrawal Address
      await this.swipeIWOInstance.withdrawSaleToken(
        accounts[1],
        withdrawAmount
      );

      // Check Contract Balance
      const newBalanceOfContract = await callMethod(
        this.saleToken.methods.balanceOf,
        [this.swipeIWOInstance.address]
      );
      assert.equal(
        newBalanceOfContract,
        saleAmount.minus(withdrawAmount).toFixed()
      );

      // Check Sale Balance Of Withdrawal Address
      const saleBalanceOfWithdrawalAddress = await callMethod(
        this.saleToken.methods.balanceOf,
        [accounts[1]]
      );
      assert.equal(saleBalanceOfWithdrawalAddress, withdrawAmount.toFixed());
    });
  });

  describe('Swipe IWO Over Test', async() => {
    beforeEach(async() => {
      // Set Base Token Address
      await this.swipeIWOInstance.setBaseToken(this.baseTokenInstance.address);
      // Set Sale Token Address
      await this.swipeIWOInstance.setSaleToken(this.saleTokenInstance.address);
    });

    it ('Check IWO IsSale', async() => {
      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(defaultValue, { from: accounts[1] }),
        "SwipeIWO is sale over"
      );
    });

    it ('Check IWO Start Time', async() => {
      const startTime = (parseInt(lastBlockTimeStamp, 10) + 1000).toString();
      // Set IWO IsSale
      await this.swipeIWOInstance.setIsSale(true);
      // Set IWO Start Time
      await this.swipeIWOInstance.setStartTime(startTime);
      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(defaultValue, { from: accounts[1] }),
        "SwipeIWO is not started yet"
      );      
    });

    it ('Check IWO End Time', async() => {
      const startTime = (parseInt(lastBlockTimeStamp, 10) - 100).toString();
      const endTime = (parseInt(lastBlockTimeStamp, 10) - 50).toString();
      // Set IWO IsSale
      await this.swipeIWOInstance.setIsSale(true);
      // Set IWO Start Time
      await this.swipeIWOInstance.setStartTime(startTime);
      // Set IWO End Time
      await this.swipeIWOInstance.setEndTime(endTime);
      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(defaultValue, { from: accounts[1] }),
        "SwipeIWO is already finished"
      );
    });

    it ('Check IWO Limit Base Amount', async() => {
      const startTime = (parseInt(lastBlockTimeStamp, 10) - 1000).toString();
      const endTime = (parseInt(lastBlockTimeStamp, 10) + 1000).toString();
      const limitBaseAmount = new BigNumber('1000000000000000000000');
      const maxLimitBaseAmount = limitBaseAmount.plus(1);
      // Set IWO IsSale
      await this.swipeIWOInstance.setIsSale(true);
      // Set IWO Start Time
      await this.swipeIWOInstance.setStartTime(startTime);
      // Set IWO End Time
      await this.swipeIWOInstance.setEndTime(endTime);
      // Set Limit Base Amount
      await this.swipeIWOInstance.setLimitBaseAmount(limitBaseAmount.toFixed());

      // Transfer maxLimitBaseAmount To Contract
      await this.baseTokenInstance.transfer(
        this.swipeIWOInstance.address,
        maxLimitBaseAmount.toFixed()
      );

      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(defaultValue, { from: accounts[1] }),
        "Already sold out."
      );
    });

    it ('Check IWO Purchase Allowed', async() => {
      const startTime = (parseInt(lastBlockTimeStamp, 10) - 1000).toString();
      const endTime = (parseInt(lastBlockTimeStamp, 10) + 1000).toString();
      const limitBaseAmount = new BigNumber('1000000000000000000000');
      const purchaseAmount = new BigNumber('5000000000000000000');
      // Set IWO IsSale
      await this.swipeIWOInstance.setIsSale(true);
      // Set IWO Start Time
      await this.swipeIWOInstance.setStartTime(startTime);
      // Set IWO End Time
      await this.swipeIWOInstance.setEndTime(endTime);
      // Set Limit Base Amount
      await this.swipeIWOInstance.setLimitBaseAmount(limitBaseAmount.toFixed());

      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseAmount.toFixed(), { from: accounts[1] }),
        "You're not allowed to purchased"
      );
    });

    it ('Check IWO Purchase Max Allowance', async() => {
      const startTime = (parseInt(lastBlockTimeStamp, 10) - 1000).toString();
      const endTime = (parseInt(lastBlockTimeStamp, 10) + 1000).toString();
      const limitBaseAmount = new BigNumber('1000000000000000000000');
      const purchaseAmount = new BigNumber('5000000000000000000');

      // Set IWO IsSale
      await this.swipeIWOInstance.setIsSale(true);
      // Set IWO Start Time
      await this.swipeIWOInstance.setStartTime(startTime);
      // Set IWO End Time
      await this.swipeIWOInstance.setEndTime(endTime);
      // Set Limit Base Amount
      await this.swipeIWOInstance.setLimitBaseAmount(limitBaseAmount.toFixed());
      // Set White Status
      await this.swipeIWOInstance.setWhiteStatus(
        [
          accounts[1]
        ],
        [
          {
            isWhite: true,
            maxAllowance: purchaseAmount.minus(1).toFixed()
          }
        ], {
          from: deployer
        }
      );
      // Get White Status
      const whiteStatus = await callMethod(this.swipeIWO.methods.getWhiteStatus, [accounts[1]]);
      // Check White Status
      assert.equal(whiteStatus[0], '1');
      assert.equal(whiteStatus[1], purchaseAmount.minus(1).toFixed());

      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseAmount.toFixed(), { from: accounts[1] }),
        "You can not purchase more than maxAllowance"
      );
    });
  });

  /* describe('Swipe IWO Purchase Test', async() => {
    const limitBaseAmount = new BigNumber('100000000000000000000'); // 100 Base Token
    const purchaseBaseAmount = new BigNumber('5000000000000000000'); // 5 Base Token
    const saleRate = new BigNumber('10000000000000000000'); // 10 Sale Token = 1 Base Token, Unit: 1e18, Should Divide By 1e18
    const minBaseAmouont = new BigNumber('1000000000000000000'); // Min Base: 1
    const maxBaseAmouont = new BigNumber('10000000000000000000'); // Min Base: 10
    const purchaseSaleAmount = purchaseBaseAmount.multipliedBy(saleRate).dividedBy(new BigNumber(defaultValue));
    const limitSaleAmount = limitBaseAmount.multipliedBy(saleRate).dividedBy(new BigNumber(defaultValue));
    const addressList = [
      accounts[1],
      accounts[2]
    ];
    const whiteList = [
      {
        isWhite: true,
        maxAllowance: purchaseBaseAmount.multipliedBy(2).toFixed(),
      },
      {
        isWhite: true,
        maxAllowance: purchaseBaseAmount.multipliedBy(2).minus(1).toFixed()
      }
    ]

    beforeEach(async() => {
      const startTime = (parseInt(lastBlockTimeStamp, 10) - 1000).toString();
      const endTime = (parseInt(lastBlockTimeStamp, 10) + 1000).toString();

      // Set Base Token Address
      await this.swipeIWOInstance.setBaseToken(this.baseTokenInstance.address);
      // Set Sale Token Address
      await this.swipeIWOInstance.setSaleToken(this.saleTokenInstance.address);    
      // Set Sale Rate
      await this.swipeIWOInstance.getSaleRate(saleRate.toFixed());
      // Set IWO IsSale
      await this.swipeIWOInstance.setIsSale(true);
      // Set IWO Start Time
      await this.swipeIWOInstance.setStartTime(startTime);
      // Set IWO End Time
      await this.swipeIWOInstance.setEndTime(endTime);
      // Set Min Base Amount
      await this.swipeIWOInstance.setMinBaseAmount(minBaseAmouont.toFixed());
      // Set Max Base Amount
      await this.swipeIWOInstance.setMaxBbaseAmount(maxBaseAmouont.toFixed());
      // Set Limit Base Amount
      await this.swipeIWOInstance.setLimitBaseAmount(limitBaseAmount.toFixed());
      // Set White Status
      await this.swipeIWOInstance.setWhiteStatus(
        addressList,
        whiteList,
        {
          from: deployer
        }
      );

      // Transfer Limit Sale Amount to Contract
      await this.saleTokenInstance.transfer(
        this.swipeIWOInstance.address,
        limitSaleAmount.toFixed()
      );

      // Transfer Base Token To First Account
      await this.baseTokenInstance.transfer(
        accounts[1],
        limitBaseAmount.toFixed()
      );

      // Transfer Base Token To First Account
      await this.baseTokenInstance.transfer(
        accounts[2],
        limitBaseAmount.toFixed()
      );
    });

    it ('Check Purchase Min Amount', async() => {
      const purchaseAmount = minBaseAmouont.minus(1);

      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseAmount, { from: accounts[1] }),
        "Purchase Amount should be more than minBaseAmount"
      );
    });

    it ('Check Purchase Max Amount', async() => {
      const purchaseAmount = maxBaseAmouont.plus(1);

      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseAmount, { from: accounts[1] }),
        "Purchase Amount should be less than maxBaseAmount"
      );
    });

    it ('Check Purchase Base Token With Single Account', async() => {
      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        purchaseBaseAmount.toFixed(),
        { from: accounts[1] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[1] });

      // Check User Base Amount
      const userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userBaseAmount, limitBaseAmount.minus(purchaseBaseAmount).toFixed());

      // Check User Sale Amount
      const userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userSaleAmount, purchaseSaleAmount.toFixed());

      // Check Contract Base Amount
      const contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, purchaseBaseAmount.toFixed());

      // Check Contract Sale Amount
      const contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, limitSaleAmount.minus(purchaseSaleAmount));
    });

    it ('Check Purchase Base Token With Multiple Accounts', async() => {
      // Check First User
      // Get User Old Amounts
      let userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      let userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      // Get Contract Old Amounts
      let contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      let contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        purchaseBaseAmount.toFixed(),
        { from: accounts[1] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[1] });

      // Check User Base Amount
      let userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(purchaseBaseAmount).toFixed());

      // Check User Sale Amount
      let userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(purchaseSaleAmount).toFixed());

      // Check Contract Base Amount
      let contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(purchaseBaseAmount).toFixed());

      // Check Contract Sale Amount
      let contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(purchaseSaleAmount).toFixed());

      // Check Second User
      // Get User Old Amounts
      userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[2]]);
      userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[2]]);
      // Get Contract Old Amounts
      contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        purchaseBaseAmount.toFixed(),
        { from: accounts[2] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[2] });

      // Check User Base Amount
      userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[2]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(purchaseBaseAmount).toFixed());

      // Check User Sale Amount
      userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[2]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(purchaseSaleAmount).toFixed());

      // Check Contract Base Amount
      contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(purchaseBaseAmount).toFixed());

      // Check Contract Sale Amount
      contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(purchaseSaleAmount).toFixed());
    });

    it ('Check Purchase Base Token Limit Base Token', async() => {
      // Increase Base Max Amount
      await this.swipeIWOInstance.setMaxBaseAmount(limitBaseAmount.toFixed());
      await this.swipeIWOInstance.setWhiteStatus(
        [accounts[1]],
        [
          {
            isWhite: true,
            maxAllowance: limitBaseAmount.toFixed(),
          }
        ],
        {
          from: deployer
        }
      );

      // Get User Old Amounts
      let userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      let userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      // Get Contract Old Amounts
      let contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      let contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        limitBaseAmount.toFixed(),
        { from: accounts[1] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(limitBaseAmount.toFixed(), { from: accounts[1] });

      // Check User Base Amount
      let userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(limitBaseAmount).toFixed());

      // Check User Sale Amount
      let userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(limitSaleAmount).toFixed());

      // Check Contract Base Amount
      let contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(limitBaseAmount).toFixed());

      // Check Contract Sale Amount
      let contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(limitSaleAmount).toFixed());

      // Call purchaseSaleToken with Second Account
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount, { from: accounts[2] }),
        "Total Base Amount shoould be less than baseLimitAmount"
      );
    });

    it ('Check Double Purchase Base Token Max Amount', async() => {
      // Get User Old Amounts
      let userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      let userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      // Get Contract Old Amounts
      let contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      let contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      const newSaleAmount = maxBaseAmouont.multipliedBy(saleRate).dividedBy(new BigNumber(defaultValue));

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        maxBaseAmouont.toFixed(),
        { from: accounts[1] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(maxBaseAmouont.toFixed(), { from: accounts[1] });

      // Check User Base Amount
      let userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(maxBaseAmouont).toFixed());

      // Check User Sale Amount
      let userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(newSaleAmount).toFixed());

      // Check Contract Base Amount
      let contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(maxBaseAmouont).toFixed());

      // Check Contract Sale Amount
      let contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(newSaleAmount).toFixed());

      // Call purchaseSaleToken with First Account Again
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount, { from: accounts[1] }),
        "Purchase Amount should be less than maxBaseAmount"
      );
    });

    it ('Check Double Purchase Base Token Max Allowance - Successful Case', async() => {
      // Purchase - First
      // Get User Old Amounts
      let userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      let userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      // Get Contract Old Amounts
      let contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      let contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        purchaseBaseAmount.toFixed(),
        { from: accounts[1] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[1] });

      // Check User Base Amount
      let userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(purchaseBaseAmount).toFixed());

      // Check User Sale Amount
      let userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(purchaseSaleAmount).toFixed());

      // Check Contract Base Amount
      let contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(purchaseBaseAmount).toFixed());

      // Check Contract Sale Amount
      let contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(purchaseSaleAmount).toFixed());

      // Purchase - Second
      // Get User Old Amounts
      userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      // Get Contract Old Amounts
      contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        purchaseBaseAmount.toFixed(),
        { from: accounts[1] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[1] });

      // Check User Base Amount
      userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(purchaseBaseAmount).toFixed());

      // Check User Sale Amount
      userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[1]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(purchaseSaleAmount).toFixed());

      // Check Contract Base Amount
      contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(purchaseBaseAmount).toFixed());

      // Check Contract Sale Amount
      contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(purchaseSaleAmount).toFixed());
    });

    it ('Check Double Purchase Base Token Max Allowance - Failed Case', async() => {
      // Purchase - First
      // Get User Old Amounts
      let userOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[2]]);
      let userOldSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[2]]);
      // Get Contract Old Amounts
      let contractOldBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      let contractOldSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);

      await this.baseTokenInstance.approve(
        this.swipeIWOInstance.address,
        purchaseBaseAmount.toFixed(),
        { from: accounts[2] }
      );
      await this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[2] });

      // Check User Base Amount
      let userBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [accounts[2]]);
      assert.equal(userBaseAmount, (new BigNumber(userOldBaseAmount)).minus(purchaseBaseAmount).toFixed());

      // Check User Sale Amount
      let userSaleAmount = await callMethod(this.saleToken.methods.balanceOf, [accounts[2]]);
      assert.equal(userSaleAmount, (new BigNumber(userOldSaleAmount)).plus(purchaseSaleAmount).toFixed());

      // Check Contract Base Amount
      let contractBaseAmount = await callMethod(this.baseToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractBaseAmount, (new BigNumber(contractOldBaseAmount)).plus(purchaseBaseAmount).toFixed());

      // Check Contract Sale Amount
      let contractSaleAmount =  await callMethod(this.saleToken.methods.balanceOf, [this.swipeIWOInstance.address]);
      assert.equal(contractSaleAmount, (new BigNumber(contractOldSaleAmount)).minus(purchaseSaleAmount).toFixed());

      // Purchase - Second
      // Call purchaseSaleToken
      await truffleAssert.reverts(
        this.swipeIWOInstance.purchaseSaleToken(purchaseBaseAmount.toFixed(), { from: accounts[2] }),
        "You can not purchase more than maxAllowance"
      );      
    });
  });*/
});
