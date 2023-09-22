//Before running this test file, make sure contract constructor arguments are set to deployer in 00_deploy_your_contract in the packages\hardhat\deploy directory
//Also, make sure to verify that the CYCLE variable is set to 30 days in YourContract.sol in packages\hardhat\contracts directory


import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { YourContract, ERC20Mock1, ERC20Mock2 } from "../../typechain-types";
import { Address } from "hardhat-deploy/types";

const chalk = require('chalk');


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";


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

    await deployments.fixture(["YourContract", "ERC20Mock1", "ERC20Mock2"]);


    contract = await ethers.getContract("YourContract", admin);
    mock_1 = await ethers.getContract("ERC20Mock1");
    mock_2 = await ethers.getContract("ERC20Mock2");



  });

  const hasAdminRole = async (account: Address) => {
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    return await contract.hasRole(DEFAULT_ADMIN_ROLE, account);
  };

  describe("Checking ERC20 mode", () => {

    it("ERC20 mode life-cycle", async () => {
      const isERC20Mode = await contract.isERC20();
      if (isERC20Mode) {
        console.log(`      Contract is in ERC20 mode`);
        console.log(" ");
        console.log(chalk.green("      Testing admin getting tokens from mock_1 faucet and depositing it in contract..."));
        const balance = await mock_1.balanceOf(admin.address);
        console.log(`      ⚖️  Balance of admin is ${ethers.utils.formatUnits(balance, 18)} before hitting faucet`);
        console.log(`      🚰 Admin hits mock_1 faucet`);
        await mock_1.connect(admin).faucet(admin.address);
        const balancemock1 = await mock_1.balanceOf(admin.address);
        console.log(`      ⚖️  Balance of admin is ${ethers.utils.formatUnits(balancemock1, 18)} after hitting mock_1 faucet`);
        const balanceContractmock1 = await mock_1.balanceOf(contract.address);
        console.log(`      ⚖️  Balance of contract is ${ethers.utils.formatUnits(balanceContractmock1, 18)}`);
        console.log(`      ✔️  Admin approves contract to spend ${ethers.utils.formatUnits(balancemock1, 18)} tokens`)
        await mock_1.connect(admin).approve(contract.address, balancemock1);
        expect(await mock_1.allowance(admin.address, contract.address)).to.equal(balancemock1);
        console.log(`      💰 Admin funds contract with ${ethers.utils.formatUnits(balancemock1, 18)} tokens`);
        await contract.connect(admin).fundContract(balancemock1);
        expect(await mock_1.balanceOf(contract.address)).to.equal(balancemock1);
        const balanceAfterFunding = await mock_1.balanceOf(contract.address);
        expect(balanceAfterFunding).to.equal(ethers.utils.parseUnits("200", 18)); // Fixed line
        console.log(`      ⚖️  Balance of contract is ${ethers.utils.formatUnits(balanceAfterFunding, 18)} after funding`);



        // add user 1 as creator
        console.log(" ");
        console.log(chalk.green("      Testing creator transactions with mock_1 ERC20 tokens..."));
        console.log(`      🏟️  Admin adds user_1 as creator with a cap of 10`);
        await contract.connect(admin).addCreatorFlow(user_1.address, ethers.utils.parseUnits("10", 18));
        expect(await contract.connect(admin).availableCreatorAmount(user_1.address)).to.equal(ethers.utils.parseUnits("10", 18));

        const allcreatordataoutput = await contract.connect(admin).allCreatorsData([user_1.address]);
        console.log(`      🔍 allCreatorsData for user_1 is (cap,last) ${allcreatordataoutput.map(x => `${ethers.utils.formatUnits(x[0], 18)}, ${x[1]}`)}`);

        const availableCreator1Balance = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      ⚖️  Available balance for user_1 is ${ethers.utils.formatUnits(availableCreator1Balance, 18)}`);

        console.log(`      💀 user_1 tries to withdraw more than its available cap of ${ethers.utils.formatUnits(availableCreator1Balance, 18)} and fails`);
        await expect(contract.connect(user_1).flowWithdraw(availableCreator1Balance.add(ethers.utils.parseUnits("50", 18)), "For testing")).to.be.revertedWithCustomError(
          contract,
          "InsufficientInFlow",
        );

        console.log(`      💀 user_2 that is not even added as creator tries to withdraw and fails`);
        await expect(contract.connect(user_2).flowWithdraw(availableCreator1Balance, "For testing")).to.be.revertedWithCustomError(
          contract,
          "NoActiveFlowForCreator",
        );

        console.log(`      💵 user_1 withdraws its available balance`);
        await contract.connect(user_1).flowWithdraw(availableCreator1Balance, "For testing");

        const balanceAfterWithdraw = await mock_1.balanceOf(contract.address);
        console.log(`      ⚖️  Balance of contract is ${ethers.utils.formatUnits(balanceAfterWithdraw, 18)} after user_1 withdraws`);
        console.log(`      ⚖️  Balance of user_1 is ${ethers.utils.formatUnits(await mock_1.balanceOf(user_1.address), 18)} after user_1 withdraws`);
        console.log(`      ⚖️  The available balance for user_1 is now ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_1.address), 18)}`);

        expect(await contract.connect(admin).availableCreatorAmount(user_1.address)).to.equal(0);

        console.log(`      ⏰ Simulating the passage of time of 15 days`);
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        console.log(`      ⚖️  The available balance for user_1 is now ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_1.address), 18)}`);
        expect(await contract.connect(admin).availableCreatorAmount(user_1.address)).to.equal(ethers.utils.parseUnits("5", 18));


        //admin triggers emergency mode and the contract is paused
        console.log(" ");
        console.log(chalk.green("      Testing emergency mode..."));
        console.log(`      🚨 Admin triggers emergency mode and the contract is paused`);
        await contract.connect(admin).emergencyMode(true);
        expect(await contract.stopped()).to.be.true;
        console.log(`      💀 user_1 tries to withdraw and fails`);
        await expect(contract.connect(user_1).flowWithdraw(availableCreator1Balance, "For testing")).to.be.revertedWithCustomError(
          contract,
          "ContractIsStopped",
        );
        console.log(`      🧯 Admin turns off emergency mode and the contract is unpaused`);
        await contract.connect(admin).emergencyMode(false);
        expect(await contract.stopped()).to.be.false;
        const availableCreator1Balance2 = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      ⚖️  Available balance for user_1 is ${ethers.utils.formatUnits(availableCreator1Balance2, 18)}`);
        console.log(`      💵 user_1 withdraws its available balance of 5`);
        await contract.connect(user_1).flowWithdraw(ethers.utils.parseUnits("5", 18), "For testing");
        console.log(`      ⚖️  Balance of contract is ${ethers.utils.formatUnits(await mock_1.balanceOf(contract.address), 18)} after user_1 withdraws`);


        expect(await mock_1.balanceOf(contract.address)).to.closeTo(ethers.utils.parseUnits("185", 18), 0);

        const user1BalanceAfterWithdraw = await mock_1.balanceOf(user_1.address);
        console.log(`      ⚖️  Balance of user_1 is ${ethers.utils.formatUnits(user1BalanceAfterWithdraw, 18)} after user_1 withdraws`);
        expect(await mock_1.balanceOf(user_1.address)).to.equal(ethers.utils.parseUnits("15", 18));

        const availableCreator1BalanceAfter = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      ⚖️  The available balance for user_1 is now ${ethers.utils.formatUnits(availableCreator1BalanceAfter, 18)}`);






        // updating creator cap
        console.log(" ");
        console.log(chalk.green("      Testing creator cap update for mock_1 ERC20 token..."));
        console.log(`      ⏰ Simulating the passage of time of 7.5 days`);
        await ethers.provider.send("evm_increaseTime", [7.5 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        const initialAvailableBalance = await contract.connect(admin).availableCreatorAmount(user_1.address);
        expect(initialAvailableBalance).to.equal(ethers.utils.parseUnits('2.500011574074074074', 18));
        console.log(`      ⚖️  The available balance for user_1 is now ${ethers.utils.formatUnits(initialAvailableBalance, 18)}`);

        console.log(`      ⚖️  Admin updates the cap of user_1 to 110`);
        await contract.connect(admin).updateCreatorFlowCapCycle(user_1.address, ethers.utils.parseUnits('110', 18));

        const allcreatordataoutput2 = await contract.connect(admin).allCreatorsData([user_1.address]);
        console.log(`      🔍 allCreatorsData for user_1 is (cap,last) ${allcreatordataoutput2.map(x => `${ethers.utils.formatUnits(x[0], 18)}, ${x[1]}`)}`);

        const availableBalanceAfterUpdate = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      ⚖️  The available balance for user_1 is now ${ethers.utils.formatUnits(availableBalanceAfterUpdate, 18)}`);

        console.log(`      ⏰ Simulating the passage of time of 22.5 days`);
        await ethers.provider.send("evm_increaseTime", [22.5 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        const finalAvailableBalance = await contract.connect(admin).availableCreatorAmount(user_1.address);
        console.log(`      ⚖️  The available balance for user_1 is now ${ethers.utils.formatUnits(finalAvailableBalance, 18)}`);
        expect(finalAvailableBalance).to.equal(ethers.utils.parseUnits('110', 18));



        // testing creator removal
        console.log(" ");
        console.log(chalk.green("      Testing creator removal..."));
        console.log(`      🫠 Admin removes user_1 as creator`);
        await contract.connect(admin).removeCreatorFlow(user_1.address);

        const allcreatordataoutput3 = await contract.connect(admin).allCreatorsData([user_1.address]);
        console.log(`      🔍 allCreatorsData for user_1 is (cap,last) ${allcreatordataoutput3.map(x => `${ethers.utils.formatUnits(x[0], 18)}, ${x[1]}`)}`);

        console.log(`      💀 user_1 tries to withdraw 10 tokens and fails`);
        await expect(contract.connect(user_1).flowWithdraw(ethers.utils.parseUnits('10', 18), "For testing")).to.be.revertedWithCustomError(
          contract,
          "NoActiveFlowForCreator",
        );


        // testing role granting and batch adding
        console.log(" ");
        console.log(chalk.green("      Testing admin functions and batch adding for mock_1 ERC20 token..."));
        console.log(`      👔 Admin grants user_2 as admin`);

        expect(await hasAdminRole(user_2.address)).to.be.false;
        await contract.connect(admin).modifyAdminRole(user_2.address, true); // Assuming modifyAdminRole expects a boolean
        expect(await hasAdminRole(user_2.address)).to.be.true;

        console.log(`      🏟️  user_2, as admin, batch adds user_3, user_4, and user_5 as creators with caps 30, 40, and 50`);
        const caps = [ethers.utils.parseUnits('30', 18), ethers.utils.parseUnits('40', 18), ethers.utils.parseUnits('50', 18)];
        await contract.connect(user_2).addBatch([user_3.address, user_4.address, user_5.address], caps);

        const allcreatordataoutput4 = await contract.connect(admin).allCreatorsData([user_3.address, user_4.address, user_5.address]);
        console.log(`      🔍 allCreatorsData for user_3, user_4, and user_5 is (cap,last) ${allcreatordataoutput4.map(x => `${ethers.utils.formatUnits(x[0], 18)}, ${x[1]}`)}`);

        const availableCreator3Balance = await contract.connect(admin).availableCreatorAmount(user_3.address);
        console.log(`      ⚖️  The available balance for user_3 is now ${ethers.utils.formatUnits(availableCreator3Balance, 18)}`);
        expect(availableCreator3Balance).to.equal(caps[0]);

        const availableCreator4Balance = await contract.connect(admin).availableCreatorAmount(user_4.address);
        console.log(`      ⚖️  The available balance for user_4 is now ${ethers.utils.formatUnits(availableCreator4Balance, 18)}`);
        expect(availableCreator4Balance).to.equal(caps[1]);

        const availableCreator5Balance = await contract.connect(admin).availableCreatorAmount(user_5.address);
        console.log(`      ⚖️  The available balance for user_5 is now ${ethers.utils.formatUnits(availableCreator5Balance, 18)}`);
        expect(availableCreator5Balance).to.equal(caps[2]);


        // testing cap update
        console.log(" ");
        console.log(chalk.green("      Testing cap update for mock_1 ERC20 token..."));
        console.log(`      🔥 Admin updates the cap of user_3 to 10`);

        const oldCap = ethers.utils.parseUnits('30', 18);
        const newCap = ethers.utils.parseUnits('10', 18);

        expect(await contract.connect(admin).availableCreatorAmount(user_3.address)).to.equal(oldCap);

        await contract.connect(admin).updateCreatorFlowCapCycle(user_3.address, newCap);

        expect(await contract.connect(admin).availableCreatorAmount(user_3.address)).to.equal(newCap);

        const allcreatordataoutput5 = await contract.connect(admin).allCreatorsData([user_3.address]);
        console.log(`      🔍 allCreatorsData for user_3 is (cap,last) ${allcreatordataoutput5.map(x => `${ethers.utils.formatUnits(x[0], 18)}, ${x[1]}`)}`);

        const availableCreator3BalanceAfter = await contract.connect(admin).availableCreatorAmount(user_3.address);
        console.log(`      ⚖️  The available balance for user_3 is now ${ethers.utils.formatUnits(availableCreator3BalanceAfter, 18)}`);

        console.log(`      ⚖️  user_3 withdraws available amount`);
        await contract.connect(user_3).flowWithdraw(availableCreator3BalanceAfter, "For testing");

        const zeroBalance = ethers.utils.parseUnits('0', 18);
        expect(await contract.connect(admin).availableCreatorAmount(user_3.address)).to.equal(zeroBalance);

        console.log(`      ⚖️  The available balance for user_3 is now ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_3.address), 18)}`);



        // testing removing from batch add and creator withdrawal
        console.log(" ");
        console.log(chalk.green("      Testing removing from batch add and creator withdrawal for mock_1 ERC20 token..."));
        console.log(`      🫠 Admin removes user_3 as creator`);
        await contract.connect(admin).removeCreatorFlow(user_3.address);
        const allcreatordataoutput6map = await contract.connect(admin).allCreatorsData([user_3.address, user_4.address, user_5.address]);
        console.log(`      🔍 allCreatorsData for user_3, user_4 and user_5 is (cap,last) ${allcreatordataoutput6map.map(x => `${ethers.utils.formatUnits(x[0], 18)}, ${x[1]}`)}`);

        console.log(`      ⚖️  The available balance for user_4 is ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_4.address))}`);
        console.log(`      💵 user_4 withdraws available amount of ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_4.address))}`);
        await contract.connect(user_4).flowWithdraw(await contract.connect(admin).availableCreatorAmount(user_4.address), "For testing");
        console.log(`      ⚖️  The available balance for user_4 is now ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_4.address))}`);
        console.log(`      ⚖️  The balance of tokens user_4 has is now ${ethers.utils.formatUnits(await mock_1.connect(admin).balanceOf(user_4.address))}`);
        expect(await mock_1.connect(admin).balanceOf(user_4.address)).to.equal(ethers.utils.parseUnits('40', 18));
        console.log(`      ⚖️  The available balance for user_5 is now ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_5.address))}`);
        console.log(`      💵 user_5 withdraws half of its available amount of ${ethers.utils.formatUnits((await contract.connect(admin).availableCreatorAmount(user_5.address) / 2).toString(), 18)}`);
        expect(await contract.connect(admin).availableCreatorAmount(user_5.address)).to.equal(ethers.utils.parseUnits('50', 18));
        const user5BalanceBeforeWithdrawdivtwo = await contract.connect(admin).availableCreatorAmount(user_5.address) / 2;
        await contract.connect(user_5).flowWithdraw(user5BalanceBeforeWithdrawdivtwo.toString(), "For testing");
        expect(await contract.connect(admin).availableCreatorAmount(user_5.address)).to.equal(ethers.utils.parseUnits('25', 18));
        console.log(`      ⚖️  The available balance for user_5 is now ${ethers.utils.formatUnits(await contract.connect(admin).availableCreatorAmount(user_5.address), 18)}`);
        console.log(`      ⚖️  The balance of tokens user_5 has is now ${ethers.utils.formatUnits(await mock_1.connect(admin).balanceOf(user_5.address), 18)}`);
        expect(await mock_1.connect(admin).balanceOf(user_5.address)).to.equal(ethers.utils.parseUnits('25', 18));
        console.log(`      ⚖️  The balance of tokens in contract is ${ethers.utils.formatUnits(await mock_1.connect(admin).balanceOf(contract.address), 18)}`);
        expect(await mock_1.connect(admin).balanceOf(contract.address)).to.equal(ethers.utils.parseUnits('110', 18));


        // testing rescue function for mock_1 ERC20 tokens
        console.log(" ");
        console.log(chalk.green("      Testing rescue function for mock_1 ERC20 token..."));
        console.log(`      ⚖️  The balance for admin is ${await mock_1.connect(admin).balanceOf(admin.address)}`);
        console.log(`      🛟 Admin drains all tokens from contract`);
        await contract.connect(admin).drainAgreement(mock_1.address);
        expect(await mock_1.connect(admin).balanceOf(contract.address)).to.equal(0);
        console.log(`      ⚖️  The balance of tokens in contract is ${await mock_1.connect(admin).balanceOf(contract.address)}`);
        console.log(`      ⚖️  The balance for admin is ${ethers.utils.formatUnits(await mock_1.connect(admin).balanceOf(admin.address), 18)}`);
        expect(await mock_1.connect(admin).balanceOf(admin.address)).to.equal(ethers.utils.parseUnits('110', 18));

        //testing rescue function for eth
        console.log(" ");
        console.log(chalk.green("      Testing rescue function for ETH..."));
        console.log(`      💰 Admin sends 1 eth to contract`);
        expect(await ethers.provider.getBalance(contract.address)).to.equal(0);
        await admin.sendTransaction({ to: contract.address, value: ethers.utils.parseEther("1") });
        console.log(`      ⚖️  The balance of eth in contract is ${ethers.utils.formatUnits((await ethers.provider.getBalance(contract.address)).toString(), 18)}`);
        expect(await ethers.provider.getBalance(contract.address)).to.equal(ethers.utils.parseEther("1"));
        console.log(`      ⚖️  The balance of eth for admin is ${ethers.utils.formatUnits((await ethers.provider.getBalance(admin.address)).toString(), 18)}`);
        console.log(`      🛟 Admin drains all eth from contract`);
        await contract.connect(admin).drainAgreement(ZERO_ADDRESS);
        expect(await ethers.provider.getBalance(contract.address)).to.equal(0);
        console.log(`      ⚖️  The balance of eth in contract is ${ethers.utils.formatUnits((await ethers.provider.getBalance(contract.address)).toString(), 18)}`);
        console.log(`      ⚖️  The balance of eth for admin is ${ethers.utils.formatUnits(await ethers.provider.getBalance(admin.address), 18)}`);

        //testing rescue function with mock_2 ERC20 tokens
        console.log(" ");
        console.log(chalk.green("      Testing rescue function for mock_2 ERC20 token..."));
        console.log(`      💰 Admin sends 10 tokens of mock_2 to contract`);
        expect(await mock_2.connect(admin).balanceOf(contract.address)).to.equal(0);
        await mock_2.connect(admin).transfer(contract.address, ethers.utils.parseUnits('10', 18));
        expect(await mock_2.connect(admin).balanceOf(contract.address)).to.equal(ethers.utils.parseUnits('10', 18));
        console.log(`      ⚖️  The balance of tokens in contract is ${ethers.utils.formatUnits(await mock_2.connect(admin).balanceOf(contract.address), 18)}`);
        console.log(`      ⚖️  The balance of tokens for admin is ${ethers.utils.formatUnits(await mock_2.connect(admin).balanceOf(admin.address), 18)}`);
        console.log(`      🛟 Admin drains all tokens from contract`);
        await contract.connect(admin).drainAgreement(mock_2.address);
        expect(await mock_2.connect(admin).balanceOf(contract.address)).to.equal(0);
        console.log(`      ⚖️  The balance of tokens in contract is ${await mock_2.connect(admin).balanceOf(contract.address)}`);
        console.log(`      ⚖️  The balance of tokens for admin is ${ethers.utils.formatUnits(await mock_2.connect(admin).balanceOf(admin.address), 18)}`);








      } else {
        console.log(chalk.red('      The contract is in ETH mode, skipping this test case'));
      }
    });

  });





























  //more rests



}); 
