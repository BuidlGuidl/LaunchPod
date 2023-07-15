//Before running this test file, make sure contract constructor arguments are set to deployer in 00_deploy_your_contract in the packages\hardhat\deploy directory
//Also, make sure to verify that the CYCLE variable is set to 30 days in YourContract.sol in packages\hardhat\contracts directory

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { YourContract } from "../../typechain-types";
import { Address } from "hardhat-deploy/types";

const CYCLE = 30 * 24 * 60 * 60;


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CAP = ethers.utils.parseEther("0.5");
const CAP_UPDATE = ethers.utils.parseEther("0.6");

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
        console.log("      Contract balance before funding: ", ethers.utils.formatEther(oldBalance));

        const amount = ethers.utils.parseEther("10");
        console.log("      Funding contract with: ", ethers.utils.formatEther(amount));
        await expect(contract.connect(admin).fundContract(0, { value: amount }))
        .to.emit(contract, "FundsReceived")
        .withArgs(admin.address, amount);

        const newBalance = await provider.getBalance(contract.address);
        console.log("      Contract balance after funding: ", ethers.utils.formatEther(newBalance));

        expect(newBalance).to.equal(oldBalance.add(amount));


        await addCreatorFlows();
        console.log("      25 Creator flows added with a cap of 0.5 ether");



        console.log("      Adding user 26 as a creator flow and expecting to fail with custom error message");
        await expect(contract.addCreatorFlow(user_26.address, CAP)).to.be.revertedWithCustomError(
          contract,
          "MaxCreatorsReached",
        )
        //available amount of user 10
        const user_10_availableAmount = await contract.availableCreatorAmount(user_10.address);
        console.log("      User 10 available amount: ", ethers.utils.formatEther(user_10_availableAmount));

        //user 10 withdraws his available amount via flowWithdraw function that takes amount and reason as parameters
        await expect(contract.connect(user_10).flowWithdraw(user_10_availableAmount, "testing")).to.emit(contract, "Withdrawn").withArgs(user_10.address, user_10_availableAmount, "testing");
        console.log("      User 10 withdraws his available amount of: ", ethers.utils.formatEther(user_10_availableAmount));

        //user 10 available amount after withdrawal
        const user_10_availableAmount_after = await contract.availableCreatorAmount(user_10.address);
        console.log("      User 10 available amount after withdrawal: ", ethers.utils.formatEther(user_10_availableAmount_after));


        //simulate the passage of time of 15 days
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);
        console.log("      Simulating the passage of time of 15 days");

        //check availableamount of user_10
        const user_10_availableAmountcheck = await contract.availableCreatorAmount(user_10.address);
        console.log("      User 10 available amount: ", ethers.utils.formatEther(user_10_availableAmountcheck));

        //user 10 withdraws his available amount via flowWithdraw function that takes amount and reason as parameters
        await expect(contract.connect(user_10).flowWithdraw(user_10_availableAmountcheck, "testing"))
        .to.emit(contract, "Withdrawn") 
        .withArgs(user_10.address, user_10_availableAmountcheck, "testing");
        console.log("      User 10 withdraws his available amount of: ", ethers.utils.formatEther(user_10_availableAmountcheck));

        //check availableamount of user_10
        const user_10_availableAmount_after2 = await contract.availableCreatorAmount(user_10.address);
        console.log("      User 10 available amount after withdrawal: ", ethers.utils.formatEther(user_10_availableAmount_after2));

        //check contract balance
        const contract_balance = await provider.getBalance(contract.address);
        console.log("      Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance));

        //simulate the passage of time of 15 days
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);
        console.log("      Simulating the passage of time of 15 days");

        //check availableamount of user_10
        const user_10_availableAmount_2 = await contract.availableCreatorAmount(user_10.address);
        console.log("      User 10 available amount: ", ethers.utils.formatEther(user_10_availableAmount_2));

        //remove user 10 from creator flows
        console.log("      Removing user 10 from creator flows");
        await expect(contract.removeCreatorFlow(user_10.address))
        .to.emit(contract, "CreatorRemoved").withArgs(user_10.address);

        //user 10 tries to withdraw his available amount via flowWithdraw function that takes amount and reason as parameters
        console.log("      User 10 tries, but fails, to withdraw his available amount of: ", ethers.utils.formatEther(user_10_availableAmount_2));
        await expect(contract.connect(user_10).flowWithdraw(user_10_availableAmount_2, "testing"))
        .to.be.revertedWithCustomError(
          contract,
          "NoActiveFlowForCreator",
        )

        //check that contract balance has not changed
        const contract_balance_2 = await provider.getBalance(contract.address);
        console.log("      Contract balance after failed withdrawal remains the same: ", ethers.utils.formatEther(contract_balance_2));

        //check availableamount of user_11
        const user_11_availableAmount = await contract.availableCreatorAmount(user_11.address);
        console.log("      User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount));

        //update cap of user 11 to 1 ether
        console.log("      Updating cap of user 11 to 1 ether");
        await expect(contract.connect(admin).updateCreatorFlowCapCycle(user_11.address, ethers.utils.parseEther("1")))

        //check availableamount of user_11
        const user_11_availableAmount_2 = await contract.availableCreatorAmount(user_11.address);
        console.log("      User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount_2));

        //simulate the passage of time of 15 days
        console.log("      Simulating the passage of time of 15 days");
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);

        //check availableamount of user_11
        const user_11_availableAmount_3 = await contract.availableCreatorAmount(user_11.address);
        console.log("      User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount_3));

        //check availableamount of user_12
        const user_12_availableAmount = await contract.availableCreatorAmount(user_12.address);
        console.log("      User 12 available amount: ", ethers.utils.formatEther(user_12_availableAmount));

        //admin triggers emergency mode and the contract is paused
        console.log(`      Admin triggers emergency mode and the contract is paused`);
        await contract.connect(admin).emergencyMode(true);
        expect(await contract.stopped()).to.be.true;

        //user 12 tries to withdraw his available amount via flowWithdraw function that takes amount and reason as parameters but fails because of emergency mode
        console.log("      User 12 tries, but fails due to emergency mode, to withdraw his available amount of: ", ethers.utils.formatEther(user_12_availableAmount));
        await expect(contract.connect(user_12).flowWithdraw(user_12_availableAmount, "testing")).to.be.revertedWithCustomError(
          contract,
          "ContractIsStopped",
        );



        //simulate the passage of time of 15 days
        console.log("      Simulating the passage of time of 15 days");
        await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);


     //admin triggers emergency mode and the contract is unpaused
        console.log(`      Admin turns off emergency mode and the contract is unpaused`);
        await contract.connect(admin).emergencyMode(false);
        expect(await contract.stopped()).to.be.false;

        //check user 12 available amount
        const user_12_availableAmount_2 = await contract.availableCreatorAmount(user_12.address);
        console.log("      User 12 available amount: ", ethers.utils.formatEther(user_12_availableAmount_2));


        //user 12 tries to withdraw his available amount via flowWithdraw function that takes amount and reason as parameters
        await expect(contract.connect(user_12).flowWithdraw(user_12_availableAmount_2 , "testing"))
        .to.emit(contract, "Withdrawn") 
        .withArgs(user_12.address, user_12_availableAmount_2 , "testing");
        console.log("      User 12 withdraws his available amount of: ", ethers.utils.formatEther(user_12_availableAmount_2));

        //check contract balance
        const contract_balance_4 = await provider.getBalance(contract.address);
        console.log("      Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance_4));

        //check availableamount of user_12
        const user_12_availableAmount_3 = await contract.availableCreatorAmount(user_12.address);
        console.log("      User 12 available amount after withdrawal: ", ethers.utils.formatEther(user_12_availableAmount_3));

        //recheck user 11 available amount
        const user_11_availableAmount_4 = await contract.availableCreatorAmount(user_11.address);
        console.log("      User 11 available amount: ", ethers.utils.formatEther(user_11_availableAmount_4));

        //user 11 tries to withdraw his available amount via flowWithdraw function that takes amount and reason as parameters
        await expect(contract.connect(user_11).flowWithdraw(user_11_availableAmount_4, "testing"))
        .to.emit(contract, "Withdrawn")
        .withArgs(user_11.address, user_11_availableAmount_4, "testing");
        console.log("      User 11 withdraws his available amount of: ", ethers.utils.formatEther(user_11_availableAmount_4));

        //user 11 available amount should be 0
        const user_11_availableAmount_5 = await contract.availableCreatorAmount(user_11.address);
        console.log("      User 11 available amount after withdraw: ", ethers.utils.formatEther(user_11_availableAmount_5));



        //check contract balance
        const contract_balance_5 = await provider.getBalance(contract.address);
        console.log("      Contract balance after withdrawal: ", ethers.utils.formatEther(contract_balance_5));

        //check admin balance before draining
        const admin_balance_2 = await provider.getBalance(admin.address);
        console.log("      Admin balance before draining: ", ethers.utils.formatEther(admin_balance_2));
        
        
        //drain all tokens from contract
        console.log(`      Admin drains all tokens from contract`);
        await contract.connect(admin).drainAgreement(ZERO_ADDRESS);
        //show balance of tokens in contract
        const contract_balance_6 = await provider.getBalance(contract.address);
        console.log("      Contract balance after draining: ", ethers.utils.formatEther(contract_balance_6));

        //check admin balance after draining
        const admin_balance_3 = await provider.getBalance(admin.address);
        console.log("      Admin balance after draining: ", ethers.utils.formatEther(admin_balance_3));

        //test rescue functions        
               
        // contract balance of mock_1  tokens before faucet
        const contract_balance_b4faucet = await mock_1.balanceOf(contract.address);
        console.log("      Contract balance before faucet: ", ethers.BigNumber.from(contract_balance_b4faucet).toString());

        //admin hits faucet
        console.log(`      Admin hits faucet for mock_1 tokens with contract address`);
        await mock_1.connect(admin).faucet(contract.address);
        //show balance of tokens in contract
        const contract_balance_7 = await mock_1.balanceOf(contract.address);
        console.log("      Contract balance for mock_1 tokens after faucet: ", ethers.BigNumber.from(contract_balance_7).toString());
        //admin balances before draining
        const admin_balance_b4drain = await mock_1.balanceOf(admin.address);
        console.log("      Admin balance for mock_1 tokens before draining: ", ethers.BigNumber.from(admin_balance_b4drain).toString());
        //admin drains agreement
        console.log(`      Admin drains agreement`);
        await contract.connect(admin).drainAgreement(mock_1.address);
        //show balance of tokens in contract
        const contract_balance_8 = await mock_1.balanceOf(contract.address);
        console.log("      Contract balance for mock_1 tokens after draining: ", ethers.BigNumber.from(contract_balance_8).toString());
        //show balance of tokens in admin
        const admin_balance_4 = await mock_1.balanceOf(admin.address);
        console.log("      Admin balance for mock_1 tokens after draining: ", ethers.BigNumber.from(admin_balance_4).toString());





        





    









        
        
    } else {
        console.log(chalk.red("      The contract is in ERC20 mode, skipping this test case"));
    }
});
  });

});
