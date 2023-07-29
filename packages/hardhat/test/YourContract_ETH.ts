//Before running this test file, make sure contract constructor arguments are set to deployer in 00_deploy_your_contract in the packages\hardhat\deploy directory
//Also, make sure to verify that the CYCLE variable is set to 30 days in YourContract.sol in packages\hardhat\contracts directory

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { YourContract,ERC20Mock1 } from "../../typechain-types";
import { Address } from "hardhat-deploy/types";



const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CAP = ethers.utils.parseEther("0.5");

const chalk = require('chalk');

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

await deployments.fixture(["YourContract", "ERC20Mock1"]);


contract = await ethers.getContract("YourContract", admin);
mock_1 = await ethers.getContract("ERC20Mock1");


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

  describe("Checking Ether mode", () => {
it("Ether mode life-cycle", async () => {
    const isEtherMode = await contract.isERC20();
    if (!isEtherMode) {
        const provider = ethers.provider;

        const oldBalance = await provider.getBalance(contract.address);

        //funding contract test
        console.log(" ");
        console.log(chalk.green("      Funding the contract..."))
        console.log("      ⚖️  Contract balance before funding: ", ethers.utils.formatEther(oldBalance)," eth");
        const amount = ethers.utils.parseEther("10");
        console.log("      💰 Funding contract with: ", ethers.utils.formatEther(amount) ," eth");
        await expect(contract.connect(admin).fundContract(0, { value: amount }))
        .to.emit(contract, "FundsReceived")
        .withArgs(admin.address, amount);
        const newBalance = await provider.getBalance(contract.address);
        console.log("      ⚖️  Contract balance after funding: ", ethers.utils.formatEther(newBalance)," eth");
        expect(newBalance).to.equal(oldBalance.add(amount));

        // max creators reached test
        console.log(" ");
        console.log(chalk.green("      Adding creator flows and testing max creators reached error..."));
        await addCreatorFlows();
        console.log("      🏟️  25 Creator flows added with a cap of 0.5 ether");
        console.log("      💀 Adding user 26 as a creator flow and expecting to fail with custom error message");
        await expect(contract.addCreatorFlow(user_26.address, CAP)).to.be.revertedWithCustomError(
          contract,
          "MaxCreatorsReached",
        )
        
        // testing simple creator stream withdrawal
        console.log(" ");
        console.log(chalk.green("      Testing creator stream withdrawal..."));
        const contract_balance_b4withdrawal = await provider.getBalance(contract.address);
        console.log("      ⚖️  Contract balance before withdrawal: ", ethers.utils.formatEther(contract_balance_b4withdrawal), " eth");
        const user_10_availableAmount = await contract.availableCreatorAmount(user_10.address);
        console.log("      ⚖️  User 10 available amount: ", ethers.utils.formatEther(user_10_availableAmount), " eth");
        expect(user_10_availableAmount).to.equal(ethers.utils.parseEther("0.5"));
        await expect(contract.connect(user_10).flowWithdraw(user_10_availableAmount, "testing")).to.emit(contract, "Withdrawn").withArgs(user_10.address, user_10_availableAmount, "testing");
        console.log("      💵 User 10 withdraws his available amount of: ", ethers.utils.formatEther(user_10_availableAmount), " eth");
        const user_10_availableAmount_after = await contract.availableCreatorAmount(user_10.address);
        console.log("      ⚖️  User 10 available amount after withdrawal: ", ethers.utils.formatEther(user_10_availableAmount_after), " eth");
        expect(user_10_availableAmount_after).to.equal(ethers.utils.parseEther("0"));
        const contract_balance_after = await provider.getBalance(contract.address);
        const user_10_balance_after = await provider.getBalance(user_10.address);
        console.log("      ⚖️  Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance_after), " eth");
        expect(contract_balance_after).to.equal(contract_balance_b4withdrawal.sub(user_10_availableAmount));

        //testing creator stream withdrawal after 15 days
        console.log(" ");
        console.log(chalk.green("      Testing creator stream withdrawal after 15 days..."));
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);
        console.log("      ⏰ Simulating the passage of time of 15 days");
        const user_10_availableAmountcheck = await contract.availableCreatorAmount(user_10.address);
        console.log("      ⚖️  User 10 available amount: ", ethers.utils.formatEther(user_10_availableAmountcheck), " eth");
        await expect(contract.connect(user_10).flowWithdraw(user_10_availableAmountcheck, "testing"))
        .to.emit(contract, "Withdrawn") 
        .withArgs(user_10.address, user_10_availableAmountcheck, "testing");
        console.log("      💵 User 10 withdraws his available amount of: ", ethers.utils.formatEther(user_10_availableAmountcheck), " eth");
        const user_10_availableAmount_after2 = await contract.availableCreatorAmount(user_10.address);
        console.log("      ⚖️  User 10 available amount after withdrawal: ", ethers.utils.formatEther(user_10_availableAmount_after2));
        expect(user_10_availableAmount_after2).to.be.closeTo(ethers.utils.parseEther("0"), ethers.utils.parseEther("0.000001"));
        const contract_balance = await provider.getBalance(contract.address);
        console.log("      ⚖️  Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance), " eth");
        expect(contract_balance).to.equal(contract_balance_after.sub(user_10_availableAmountcheck));

        // testing creator stream withdrawal after 15 days and after being removed
        console.log(" ");
        console.log(chalk.green("      Testing creator stream withdrawal after 15 days and after being removed..."));
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);
        console.log("      ⏰ Simulating the passage of time of 15 days");
        const user_10_availableAmount_2 = await contract.availableCreatorAmount(user_10.address);
        console.log("      ⚖️  User 10 available amount: ", ethers.utils.formatEther(user_10_availableAmount_2), " eth");
        console.log("      🫠 Removing user 10 from creator flows");
        await expect(contract.removeCreatorFlow(user_10.address))
        .to.emit(contract, "CreatorRemoved").withArgs(user_10.address);
        console.log("      💀 User 10 tries, but fails, to withdraw his available amount of: ", ethers.utils.formatEther(user_10_availableAmount_2), " eth");
        await expect(contract.connect(user_10).flowWithdraw(user_10_availableAmount_2, "testing"))
        .to.be.revertedWithCustomError(
          contract,
          "NoActiveFlowForCreator",
        )
        const contract_balance_2 = await provider.getBalance(contract.address);
        console.log("      ⚖️  Contract balance after failed withdrawal remains the same: ", ethers.utils.formatEther(contract_balance_2), " eth");
        expect(contract_balance_2).to.equal(contract_balance);


        // testing creator cap update
        console.log(" ");
        console.log(chalk.green("      Testing creator cap update..."));
        const user_11_availableAmount = await contract.availableCreatorAmount(user_11.address);
        console.log("      ⚖️  User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount), " eth");
        console.log("      🔥 Updating cap of user 11 to 1 ether");
        await expect(contract.connect(admin).updateCreatorFlowCapCycle(user_11.address, ethers.utils.parseEther("1")))
        const user_11_availableAmount_2 = await contract.availableCreatorAmount(user_11.address);
        console.log("      ⚖️  User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount_2), );
        console.log("      ⏰ Simulating the passage of time of 15 days");
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);
        const user_11_availableAmount_3 = await contract.availableCreatorAmount(user_11.address);
        console.log("      ⚖️  User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount_3), " eth");
        await expect(contract.connect(user_11).flowWithdraw(user_11_availableAmount_3, "testing"))
        .to.emit(contract, "Withdrawn")
        .withArgs(user_11.address, user_11_availableAmount_3, "testing");
        console.log("      💀 User 11 tries to withdraw 1.1 ether, but fails only 1 ether was available");
        await expect(contract.connect(user_11).flowWithdraw(ethers.utils.parseEther("1.1"), "testing")).revertedWithCustomError(
          contract,"InsufficientInFlow");  
        console.log("      💵 User 11 withdraws his available amount of: ", ethers.utils.formatEther(user_11_availableAmount_3), " eth");
        const contract_balance_3 = await provider.getBalance(contract.address);
        console.log("      ⚖️  Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance_3), " eth");
        expect(contract_balance_3).to.equal(contract_balance_2.sub(user_11_availableAmount_3));

        // testing emergency mode
        console.log(" ");
        console.log(chalk.green("      Testing emergency mode..."));
        const user_12_availableAmount = await contract.availableCreatorAmount(user_12.address);
        console.log("      ⚖️  User 12 available amount: ", ethers.utils.formatEther(user_12_availableAmount), " eth");
        console.log(`      🚨 Admin triggers emergency mode and the contract is paused`);
        await contract.connect(admin).emergencyMode(true);
        expect(await contract.stopped()).to.be.true;
        console.log("      💀 User 12 tries, but fails due to emergency mode, to withdraw his available amount of: ", ethers.utils.formatEther(user_12_availableAmount), " eth");
        await expect(contract.connect(user_12).flowWithdraw(user_12_availableAmount, "testing")).to.be.revertedWithCustomError(
          contract,
          "ContractIsStopped",
        );
        console.log(`      🧯 Admin turns off emergency mode and the contract is unpaused`);
        await contract.connect(admin).emergencyMode(false);
        expect(await contract.stopped()).to.be.false;
        const user_12_availableAmount_2 = await contract.availableCreatorAmount(user_12.address);
        console.log("      ⚖️  User 12 available amount: ", ethers.utils.formatEther(user_12_availableAmount_2), " eth");
        await expect(contract.connect(user_12).flowWithdraw(user_12_availableAmount_2 , "testing"))
        .to.emit(contract, "Withdrawn") 
        .withArgs(user_12.address, user_12_availableAmount_2 , "testing");
        console.log("      💵 User 12 withdraws his available amount of: ", ethers.utils.formatEther(user_12_availableAmount_2),  " eth");
        const contract_balance_4 = await provider.getBalance(contract.address);
        console.log("      ⚖️  Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance_4));
        expect(contract_balance_4).to.equal(contract_balance_3.sub(user_12_availableAmount_2));
        const user_12_availableAmount_3 = await contract.availableCreatorAmount(user_12.address);
        console.log("      ⚖️  User 12 available amount after withdrawal: ", ethers.utils.formatEther(user_12_availableAmount_3),  " eth");

        // testing rescue function: ETH
        console.log(" ");
        console.log(chalk.green("      Testing rescue function with ETH..."));
        const admin_balance_2 = await provider.getBalance(admin.address);
        console.log("      ⚖️  Admin eth balance before draining: ", ethers.utils.formatEther(admin_balance_2), " eth");
        console.log(`      🛟 Admin drains all eth from contract`);
        await contract.connect(admin).drainAgreement(ZERO_ADDRESS);
        const contract_balance_6 = await provider.getBalance(contract.address);
        expect(contract_balance_6).to.equal(0);
        console.log("      ⚖️  Contract eth balance after draining: ", ethers.utils.formatEther(contract_balance_6), " eth");
        const admin_balance_3 = await provider.getBalance(admin.address);
        console.log("      ⚖️  Admin eth balance after draining: ", ethers.utils.formatEther(admin_balance_3),  " eth");
     

        // test rescue function: ERC20
        console.log(" ");
        console.log(chalk.green("      Testing rescue function with ERC20..."));
        const contract_balance_b4faucet = await mock_1.balanceOf(contract.address);
        console.log("      ⚖️  Contract token balance before faucet: ", ethers.BigNumber.from(contract_balance_b4faucet).toString());
        console.log(`      🚰 Admin hits faucet for mock_1 tokens with contract address`);
        await mock_1.connect(admin).faucet(contract.address);
        const contract_balance_7 = await mock_1.balanceOf(contract.address);
        console.log("      ⚖️  Contract balance for mock_1 tokens after faucet: ", ethers.BigNumber.from(contract_balance_7).toString());
        const admin_balance_b4drain = await mock_1.balanceOf(admin.address);
        console.log("      ⚖️  Admin balance for mock_1 tokens before draining: ", ethers.BigNumber.from(admin_balance_b4drain).toString());
        console.log(`      🛟 Admin drains agreement`);
        await contract.connect(admin).drainAgreement(mock_1.address);
        const contract_balance_8 = await mock_1.balanceOf(contract.address);
        console.log("      ⚖️  Contract balance for mock_1 tokens after draining: ", ethers.BigNumber.from(contract_balance_8).toString());
        expect(contract_balance_8).to.equal(0);
        const admin_balance_4 = await mock_1.balanceOf(admin.address);
        console.log("      ⚖️  Admin balance for mock_1 tokens after draining: ", ethers.BigNumber.from(admin_balance_4).toString());
        expect(admin_balance_4).to.equal(admin_balance_b4drain.add(contract_balance_7));


        //test adding admin functions
        console.log(" ");
        console.log(chalk.green("      Testing admin role granting and revoking..."));
        console.log("      💀 Adding admin as a creator flow with a cap of 0.5 ether but reverts with custom error");
        await expect(contract.addCreatorFlow(admin.address, CAP)).to.be.revertedWithCustomError(
        contract, "InvalidCreatorAddress");
        console.log("      💀 Admin tries to add user_12, an existing creator, as admin but reverts with custom error");
        await expect(contract.connect(admin).modifyAdminRole(user_12.address, "true")).to.be.revertedWithCustomError(
        contract, "InvalidCreatorAddress");
        console.log("      🏟️  Admin adds user_10, not currently a creator, as admin");
        await expect(contract.connect(admin).modifyAdminRole(user_10.address, "true"));
        console.log("      💀 User 10 tries to remove primary admin and fails");
        await expect(contract.connect(user_10).modifyAdminRole(admin.address, "false")).to.be.revertedWithCustomError(
        contract, "AccessDenied");
        console.log("      🫠 User 10 removes user 20 as creator");
        await expect(contract.connect(user_10).removeCreatorFlow(user_20.address))
        .to.emit(contract, "CreatorRemoved").withArgs(user_20.address);
        console.log("      🏟️  User 10 adds user 20 as creator");
        await expect(contract.connect(user_10).addCreatorFlow(user_20.address, CAP));


        //add more tests...

        
        
    } else {
        console.log(chalk.red("      The contract is in ERC20 mode, skipping this test case"));
    }
});
  });

});
