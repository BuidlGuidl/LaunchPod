//Before running this test file, make sure contract constructor arguments are set to deployer in 00_deploy_your_contract in the packages\hardhat\deploy directory
//Also, make sure to verify that the CYCLE variable is set to 30 days in YourContract.sol in packages\hardhat\contracts directory


import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { YourContract,ERC20Mock1} from "../../typechain-types";
import { Address } from "hardhat-deploy/types";

const chalk = require('chalk');


const CYCLE = 30 * 24 * 60 * 60;


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CAP = ethers.utils.parseEther("0.5");
const ERC20CAP = 5;
const halfERC20CAP = ethers.BigNumber.from(5);
const CAP_UPDATE = ethers.utils.parseEther("0.6");

describe("Test file for YourContract.sol", () => {
   let admin: SignerWithAddress;
   let user_1: SignerWithAddress;
   let user_2: SignerWithAddress;
   let user_3: SignerWithAddress;
   let user_4: SignerWithAddress;
   let user_5: SignerWithAddress;
   let user_6: SignerWithAddress;
   let user_7: SignerWithAddress;
   let user_8: SignerWithAddress;
   let user_9: SignerWithAddress;
   let user_10: SignerWithAddress;
   let user_11: SignerWithAddress;
   let user_12: SignerWithAddress;
   let user_13: SignerWithAddress;
   let user_14: SignerWithAddress;
   let user_15: SignerWithAddress;
   let user_16: SignerWithAddress;
   let user_17: SignerWithAddress;
   let user_18: SignerWithAddress;
   let user_19: SignerWithAddress;
   let user_20: SignerWithAddress;
   let user_21: SignerWithAddress;
   let user_22: SignerWithAddress;
   let user_23: SignerWithAddress;
   let user_24: SignerWithAddress;
   let user_25: SignerWithAddress;
   let user_26: SignerWithAddress;

   let contract: YourContract;
   let mock_1: ERC20Mock1;
   let mock_2: ERC20Mock2;
  

  beforeEach(async () => {
    const signers: SignerWithAddress[] = await ethers.getSigners();

    admin = signers[0];
    user_1 = signers[1];
    user_2 = signers[2];
    user_3 = signers[3];
    user_4 = signers[4];
    user_5 = signers[5];
    user_6 = signers[6];
    user_7 = signers[7];
    user_8 = signers[8];
    user_9 = signers[9];
    user_10 = signers[10];
    user_11 = signers[11];
    user_12 = signers[12];
    user_13 = signers[13];
    user_14 = signers[14];
    user_15 = signers[15];
    user_16 = signers[16];
    user_17 = signers[17];
    user_18 = signers[18];
    user_19 = signers[19];
    user_20 = signers[20];
    user_21 = signers[21];
    user_22 = signers[22];
    user_23 = signers[23];
    user_24 = signers[24];
    user_25 = signers[25];
    user_26 = signers[26];    

await deployments.fixture(["YourContract", "ERC20Mock1","ERC20Mock2"]);


contract = await ethers.getContract("YourContract", admin);
mock_1 = await ethers.getContract("ERC20Mock1");
mock_2 = await ethers.getContract("ERC20Mock2");



  });

  const hasAdminRole = async (account: Address) => {
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    return await contract.hasRole(DEFAULT_ADMIN_ROLE, account);
  };

  const addCreatorFlows = async () => {
    await contract.addCreatorFlow(user_1.address, CAP);
    await contract.addCreatorFlow(user_2.address, CAP);
    await contract.addCreatorFlow(user_3.address, CAP);
    await contract.addCreatorFlow(user_4.address, CAP);
    await contract.addCreatorFlow(user_5.address, CAP);
    await contract.addCreatorFlow(user_6.address, CAP);
    await contract.addCreatorFlow(user_7.address, CAP);
    await contract.addCreatorFlow(user_8.address, CAP);
    await contract.addCreatorFlow(user_9.address, CAP);
    await contract.addCreatorFlow(user_10.address, CAP);
    await contract.addCreatorFlow(user_11.address, CAP);
    await contract.addCreatorFlow(user_12.address, CAP);
    await contract.addCreatorFlow(user_13.address, CAP);
    await contract.addCreatorFlow(user_14.address, CAP);
    await contract.addCreatorFlow(user_15.address, CAP);
    await contract.addCreatorFlow(user_16.address, CAP);
    await contract.addCreatorFlow(user_17.address, CAP);
    await contract.addCreatorFlow(user_18.address, CAP);
    await contract.addCreatorFlow(user_19.address, CAP);
    await contract.addCreatorFlow(user_20.address, CAP);
    await contract.addCreatorFlow(user_21.address, CAP);
    await contract.addCreatorFlow(user_22.address, CAP);
    await contract.addCreatorFlow(user_23.address, CAP);
    await contract.addCreatorFlow(user_24.address, CAP);
    await contract.addCreatorFlow(user_25.address, CAP);
  };

  const addCreatorFlowsERC20 = async () => {
    await contract.addCreatorFlow(user_1.address, ERC20CAP);
    await contract.addCreatorFlow(user_2.address, ERC20CAP);
    await contract.addCreatorFlow(user_3.address, ERC20CAP);
    await contract.addCreatorFlow(user_4.address, ERC20CAP);
    await contract.addCreatorFlow(user_5.address, ERC20CAP);
    await contract.addCreatorFlow(user_6.address, ERC20CAP);
    await contract.addCreatorFlow(user_7.address, ERC20CAP);
    await contract.addCreatorFlow(user_8.address, ERC20CAP);
    await contract.addCreatorFlow(user_9.address, ERC20CAP);
    await contract.addCreatorFlow(user_10.address, ERC20CAP);
    await contract.addCreatorFlow(user_11.address, ERC20CAP);
    await contract.addCreatorFlow(user_12.address, ERC20CAP);
    await contract.addCreatorFlow(user_13.address, ERC20CAP);
    await contract.addCreatorFlow(user_14.address, ERC20CAP);
    await contract.addCreatorFlow(user_15.address, ERC20CAP);
    await contract.addCreatorFlow(user_16.address, ERC20CAP);
    await contract.addCreatorFlow(user_17.address, ERC20CAP);
    await contract.addCreatorFlow(user_18.address, ERC20CAP);
    await contract.addCreatorFlow(user_19.address, ERC20CAP);
    await contract.addCreatorFlow(user_20.address, ERC20CAP);
    await contract.addCreatorFlow(user_21.address, ERC20CAP);
    await contract.addCreatorFlow(user_22.address, ERC20CAP);
    await contract.addCreatorFlow(user_23.address, ERC20CAP);
    await contract.addCreatorFlow(user_24.address, ERC20CAP);
    await contract.addCreatorFlow(user_25.address, ERC20CAP);
  };

  describe("Checking ERC20 mode", () => {

    it("ERC20 mode life-cycle", async () => {
      const isERC20Mode = await contract.isERC20();
      if (isERC20Mode) {
        console.log(`      Contract is in ERC20 mode`);
        // This test case checks if the contract correctly receives the ERC20 tokens
        
        //log the balance of admin
        const balance = await mock_1.balanceOf(admin.address);
        console.log(`      Balance of admin is ${balance} before hitting faucet`);
        console.log(`      Admin hits mock_1 faucet...`);
        await mock_1.connect(admin).faucet(admin.address);

        //log the balance of admin
        const balancemock1 = await mock_1.balanceOf(admin.address);
        console.log(`      Balance of admin is ${balancemock1} after hitting mock_1 faucet`);
        //log the balance of contract
        const balanceContractmock1 = await mock_1.balanceOf(contract.address);
        console.log(`      Balance of contract is ${balanceContractmock1}`);

        console.log(`      Admin approves contract to spend ${balancemock1} tokens...`)
        await mock_1.connect(admin).approve(contract.address, balancemock1);

        //fund the contract with tokens
        console.log(`      Admin funds Contract with ${balancemock1} tokens`);
        await contract.connect(admin).fundContract(balancemock1);
      
        const balanceAfterFunding = await mock_1.balanceOf(contract.address);
        console.log(`      Balance of contract is ${balanceAfterFunding} after funding`);
        
      
        //add user 1 as creator
        console.log(`      Admin adds user_1 as creator with a cap of 10`);
        await contract.connect(admin).addCreatorFlow(user_1.address, 10);


        //trigger allCreatorsData with user_1 inside an array

        const allcreatordataoutput =  await contract.connect(admin).allCreatorsData([user_1.address]);
        console.log(`      allCreatorsData for user_1 is (cap/last) ${allcreatordataoutput}`);

        console.log(`      Simulating the passage of time of 15 days...`);
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine"); 

        //check available balance for user_1
        const availableCreator1Balance = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      Available balance for user_1 is ${availableCreator1Balance}`);

        //user_1 one tries to withdraw more than its cap and fails
        console.log(`      user_1 tries to withdraw more than its available cap and fails`);
        await expect(contract.connect(user_1).flowWithdraw(availableCreator1Balance.add(50), "For testing")).to.be.revertedWithCustomError(
          contract,
          "InsufficientInFlow",
        );

        //user_2 that is not even added as creator tries to withdraw and fails
        console.log(`      user_2 that is not even added as creator tries to withdraw and fails`);
        await expect(contract.connect(user_2).flowWithdraw(availableCreator1Balance, "For testing")).to.be.revertedWithCustomError(
          contract,
          "NoActiveFlowForCreator",
        );

        //user_1 withdraws its available balance
        console.log(`      user_1 withdraws its available balance`);
        await contract.connect(user_1).flowWithdraw(availableCreator1Balance, "For testing");
        const balanceAfterWithdraw = await mock_1.balanceOf(contract.address);
        console.log(`      Balance of contract is ${balanceAfterWithdraw} after user_1 withdraws`);
        console.log(`      Balance of user_1 is ${await mock_1.balanceOf(user_1.address)} after user_1 withdraws`);
        console.log(`      The available balance for user_1 is now ${await contract.connect(admin).availableCreatorAmount(user_1.address)}`);

        //Simulate the passage of time of 15 days
        console.log(`      Simulating the passage of time of 15 days...`);
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        //show the available balance for user_1
        console.log(`      The available balance for user_1 is now ${await contract.connect(admin).availableCreatorAmount(user_1.address)}`);

        //admin triggers emergency mode and the contract is paused
        console.log(`      Admin triggers emergency mode and the contract is paused`);
        await contract.connect(admin).emergencyMode(true);
        expect(await contract.stopped()).to.be.true;

        //user_1 tries to withdraw and fails
        console.log(`      user_1 tries to withdraw and fails`);
        await expect(contract.connect(user_1).flowWithdraw(availableCreator1Balance, "For testing")).to.be.revertedWithCustomError(
          contract,
          "ContractIsStopped",
        );

        //admin triggers emergency mode and the contract is unpaused
        console.log(`      Admin turns off emergency mode and the contract is unpaused`);
        await contract.connect(admin).emergencyMode(false);
        expect(await contract.stopped()).to.be.false;

        //user_1 withdraws its available balance
        //get available balance for user_1
        const availableCreator1Balance2 = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      Available balance for user_1 is ${availableCreator1Balance2}`);

        console.log(`      user_1 withdraws its available balance`);
        await contract.connect(user_1).flowWithdraw(availableCreator1Balance2, "For testing");
        const balanceAfterWithdraw2 = await mock_1.balanceOf(contract.address);
        console.log(`      Balance of contract is ${balanceAfterWithdraw2} after user_1 withdraws`);
        console.log(`      Balance of user_1 is ${await mock_1.balanceOf(user_1.address)} after user_1 withdraws`);
        console.log(`      The available balance for user_1 is now ${await contract.connect(admin).availableCreatorAmount(user_1.address)}`);

        //simulate the passage of time of 7.5 days

        console.log(`      Simulating the passage of time of 7.5 days...`);
        await ethers.provider.send("evm_increaseTime", [7.5 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        //user_1 available amount
        console.log(`      The available balance for user_1 is now ${await contract.connect(admin).availableCreatorAmount(user_1.address)}`);
        
        //update the cap of user_1 to 110
        console.log(`      Admin updates the cap of user_1 to 110`);
        await contract.connect(admin).updateCreatorFlowCapCycle(user_1.address, 110);

        //user_1 allCreatorsData
        const allcreatordataoutput2 =  await contract.connect(admin).allCreatorsData([user_1.address]);
        console.log(`      allCreatorsData for user_1 is (cap/last) ${allcreatordataoutput2}`);

        //user_1 available amount
        console.log(`      The available balance for user_1 is now ${await contract.connect(admin).availableCreatorAmount(user_1.address)}`);

        //simulate the passage of time to 22.5 days
        console.log(`      Simulating the passage of time of 22.5 days...`);
        await ethers.provider.send("evm_increaseTime", [22.5 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        //user_1 available amount
        console.log(`      The available balance for user_1 is now ${await contract.connect(admin).availableCreatorAmount(user_1.address)}`);

        //user_1 is removed as creator
        console.log(`      Admin removes user_1 as creator`);
        await contract.connect(admin).removeCreatorFlow(user_1.address);

        //user_1 allCreatorsData
        const allcreatordataoutput3 =  await contract.connect(admin).allCreatorsData([user_1.address]);
        console.log(`      allCreatorsData for user_1 is (cap/last) ${allcreatordataoutput3}`);

        //user_1 tries to withdraw and fails
        console.log(`      user_1 tries to withdraw 10 tokens and fails`);
        await expect(contract.connect(user_1).flowWithdraw(10, "For testing")).to.be.revertedWithCustomError(
          contract,
          "NoActiveFlowForCreator",
        );

        //admin grants user_2 as admin
        console.log(`      Admin grants user_2 as admin`);
        await contract.connect(admin).grantRole(ethers.utils.id("ADMIN_ROLE"), user_2.address);


        //user_2, as admin, batch adds user_3, user_4 and user_5 as creators with caps 30, 40 and 50
        console.log(`      user_2, as admin, batch adds user_3, user_4 and user_5 as creators with caps 3, 4 and 5`);
        await contract.connect(admin).addBatch([user_3.address, user_4.address, user_5.address], [30, 40, 50]);

        //allcreatorsdata for user_3, user_4 and user_5
        const allcreatordataoutput4 =  await contract.connect(admin).allCreatorsData([user_3.address, user_4.address, user_5.address]);
        console.log(`      allCreatorsData for user_3, user_4 and user_5 is (cap/last) ${allcreatordataoutput4}`);

        //user_3, user_4 and user_5 available amount
        console.log(`      The available balance for user_3 is now ${await contract.connect(admin).availableCreatorAmount(user_3.address)}`);
        console.log(`      The available balance for user_4 is now ${await contract.connect(admin).availableCreatorAmount(user_4.address)}`);
        console.log(`      The available balance for user_5 is now ${await contract.connect(admin).availableCreatorAmount(user_5.address)}`);

        //simulate the passage of time of 15 days

        console.log(`      Simulating the passage of time of 15 days...`);
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        //user_3, user_4 and user_5 available amount
        console.log(`      The available balance for user_3 is now ${await contract.connect(admin).availableCreatorAmount(user_3.address)}`);
        console.log(`      The available balance for user_4 is now ${await contract.connect(admin).availableCreatorAmount(user_4.address)}`);
        console.log(`      The available balance for user_5 is now ${await contract.connect(admin).availableCreatorAmount(user_5.address)}`);

        //update the cap of user_3 to 10
        console.log(`      Admin updates the cap of user_3 to 10`);
        await contract.connect(admin).updateCreatorFlowCapCycle(user_3.address, 10);

        //user_3 allCreatorsData
        const allcreatordataoutput5 =  await contract.connect(admin).allCreatorsData([user_3.address]);
        console.log(`      allCreatorsData for user_3 is (cap/last) ${allcreatordataoutput5}`);

        //user_3 available amount
        console.log(`      The available balance for user_3 is now ${await contract.connect(admin).availableCreatorAmount(user_3.address)}`);

        //user_3 withdraws available amount
        console.log(`      user_3 withdraws available amount`);
        await contract.connect(user_3).flowWithdraw(await contract.connect(admin).availableCreatorAmount(user_3.address), "For testing");

        //user_3 available amount
        console.log(`      The available balance for user_3 is now ${await contract.connect(admin).availableCreatorAmount(user_3.address)}`);

        //admin removes user_3 as creator
        console.log(`      Admin removes user_3 as creator`);
        await contract.connect(admin).removeCreatorFlow(user_3.address);
        
        //user_3,user_4 and user_5 allCreatorsData
        const allcreatordataoutput6 =  await contract.connect(admin).allCreatorsData([user_3.address, user_4.address, user_5.address]);
        console.log(`      allCreatorsData for user_3, user_4 and user_5 is (cap/last) ${allcreatordataoutput6}`);

        //simulate the passage of time of 15 days
        console.log(`      Simulating the passage of time of 15 days...`);
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        //user_4 and user_5 available amount
        console.log(`      The available balance for user_4 is now ${await contract.connect(admin).availableCreatorAmount(user_4.address)}`);
        console.log(`      The available balance for user_5 is now ${await contract.connect(admin).availableCreatorAmount(user_5.address)}`);

        //user_4 withdraws available amount
        console.log(`      user_4 withdraws available amount`);
        //show user_4 balance before withdraw
        console.log(`      The balance for user_4 is now ${await contract.connect(admin).availableCreatorAmount(user_4.address)}`);
        console.log(`      user_4 withdraws available amount of ${await contract.connect(admin).availableCreatorAmount(user_4.address)}`);
        await contract.connect(user_4).flowWithdraw(await contract.connect(admin).availableCreatorAmount(user_4.address), "For testing");
        //show user_4 balance after withdraw
        console.log(`      The balance for user_4 is now ${await contract.connect(admin).availableCreatorAmount(user_4.address)}`);

        //user_5 withdraws half of the available amount
        console.log(`      user_5 withdraws half of the available amount`);
        //show user_5 balance before withdraw
        console.log(`      The balance for user_5 is now ${await contract.connect(admin).availableCreatorAmount(user_5.address)}`);
        console.log(`      user_5 withdraws available amount of ${await contract.connect(admin).availableCreatorAmount(user_5.address) / 2}`);
        await contract.connect(user_5).flowWithdraw(await contract.connect(admin).availableCreatorAmount(user_5.address) / 2, "For testing");
        //show user_5 balance after withdraw
        console.log(`      The balance for user_5 is now ${await contract.connect(admin).availableCreatorAmount(user_5.address)}`);

        //show balance of tokens in contract
        console.log(`      The balance of tokens in contract is ${await mock_1.connect(admin).balanceOf(contract.address)}`);
        //show balance of tokens of admin
        console.log(`      The balance for  admin is ${await mock_1.connect(admin).balanceOf(admin.address)}`);
        //drain all tokens from contract
        console.log(`      Admin drains all tokens from contract`);
        await contract.connect(admin).drainAgreement(mock_1.address);
        //show balance of tokens in contract
        console.log(`      The balance of tokens in contract is ${await mock_1.connect(admin).balanceOf(contract.address)}`);

        //show balance of tokens of admin
        console.log(`      The balance for  admin is ${await mock_1.connect(admin).balanceOf(admin.address)}`);

        //send eth to contract and try to drain it as admin
        console.log(`      Admin sends 1 eth to contract`);
        //send eth without using a function
        await admin.sendTransaction({to: contract.address, value: ethers.utils.parseEther("1.0")});
        //show balance of eth in contract
        console.log(`      The balance of eth in contract is ${await ethers.provider.getBalance(contract.address)}`);
        //show balance of eth of admin
        console.log(`      The balance for  admin is ${await ethers.provider.getBalance(admin.address)}`);
        //drain all eth from contract
        console.log(`      Admin drains all eth from contract`);
        await contract.connect(admin).drainAgreement(ZERO_ADDRESS);
        //show balance of eth in contract
        console.log(`      The balance of eth in contract is ${await ethers.provider.getBalance(contract.address)}`);
        //show balance of eth of admin
        console.log(`      The balance for  admin is ${await ethers.provider.getBalance(admin.address)}`);

        //send as admin 10 tokens of mock_2 to contract to test the drainAgreement function
        console.log(`      Admin sends 10 tokens of mock_2 to contract`);
        await mock_2.connect(admin).transfer(contract.address, 10);
        //show balance of tokens in contract
        console.log(`      The balance of tokens in contract is ${await mock_2.connect(admin).balanceOf(contract.address)}`);
        //show balance of tokens of admin
        console.log(`      The balance for  admin is ${await mock_2.connect(admin).balanceOf(admin.address)}`);
        //drain all tokens from contract
        console.log(`      Admin drains all tokens from contract`);
        await contract.connect(admin).drainAgreement(mock_2.address);
        //show balance of tokens in contract
        console.log(`      The balance of tokens in contract is ${await mock_2.connect(admin).balanceOf(contract.address)}`);
        //show balance of tokens of admin
        console.log(`      The balance for  admin is ${await mock_2.connect(admin).balanceOf(admin.address)}`);








      } else {
        console.log(chalk.red('      The contract is in ETH mode, skipping this test case'));
      }
    });
        
        }); 

  














  












  //more rests



}); 
