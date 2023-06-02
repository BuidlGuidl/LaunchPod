import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { YourContract } from "../../typechain-types";
import { Address } from "hardhat-deploy/types";

const CYCLE = 30 * 24 * 60 * 60;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CAP = ethers.utils.parseEther("0.5")
const CAP_UPDATE = ethers.utils.parseEther("0.6")

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

    await deployments.fixture("YourContract");

    contract = await ethers.getContract("YourContract", admin);
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

  describe("Deployment", () => {
    it("Should set the correct admin upon deployment", async () => {
      expect(await hasAdminRole(admin.address)).to.be.true;
    });
  });

  describe("Admin role modification", () => {
    it("Should correctly grant admin role", async () => {
      await contract.modifyAdminRole(user_2.address, true);
      expect(await hasAdminRole(user_2.address)).to.be.true;
      expect(await hasAdminRole(admin.address)).to.be.true;
    });
    it("Should correctly revoke admin role", async () => {
      await contract.modifyAdminRole(user_2.address, false);
      expect(await hasAdminRole(user_2.address)).to.be.false;
    });
  });

  describe("Emergency mode", () => {
    it("Should correctly enable emergency mode", async () => {
      await contract.emergencyMode(true);
      expect(await contract.stopped()).to.be.true;
    });

    it("Should correctly disable emergency mode", async () => {
      await contract.emergencyMode(false);
      expect(await contract.stopped()).to.be.false;
    });
    it("Should revert if caller is not admin", async () => {
      await expect(contract.connect(user_2).emergencyMode(false)).to.be.revertedWithCustomError(
        contract,
        "AccessDenied",
      );
    });
  });

  describe("Fund contract", () => {
    it("Should correctly receive funds and emits an event", async () => {
      const provider = ethers.provider;

      const oldBalance = await provider.getBalance(contract.address);

      const amount = CAP.mul(26);
      await expect(contract.fundContract({ value: amount }))
        .to.emit(contract, "FundsReceived")
        .withArgs(admin.address, amount);

      const newBalance = await provider.getBalance(contract.address);

      expect(newBalance).to.equal(oldBalance.add(amount));
    });
    it("Should correctly revert if amount is ZERO", async () => {
      await expect(contract.fundContract({ value: 0 })).to.be.revertedWithCustomError(contract, "NoValueSent");
    });
  });



  describe("Add creator flow", () => {
    it("Should add creator flow and emit corresponding event", async () => {
      await expect(contract.addCreatorFlow(user_2.address, CAP))
        .to.emit(contract, "CreatorAdded")
        .withArgs(user_2.address, CAP, 30 * (60 * 60 * 24));

      const creator = await contract.flowingCreators(user_2.address);
      expect(creator[0]).to.equal(CAP);
      expect(await contract.activeCreators(0)).to.equal(user_2.address);
    });

    it("Should correctly revert if max creator has been reached", async () => {
      await addCreatorFlows();

      await expect(contract.addCreatorFlow(user_26.address, CAP)).to.be.revertedWithCustomError(
        contract,
        "MaxCreatorsReached",
      );
    });
    it("Should correctly revert if creator is zero address", async () => {
      await expect(contract.addCreatorFlow(ZERO_ADDRESS, CAP)).to.be.revertedWithCustomError(
        contract,
        "InvalidCreatorAddress",
      );
    });
    it("Should correctly revert if cap is zero", async () => {
      await expect(contract.addCreatorFlow(user_2.address, 0)).to.be.revertedWithCustomError(
        contract,
        "CapCannotBeZero",
      );
    });
    it("Should revert if creator already exists", async () => {
      await contract.addCreatorFlow(user_2.address, CAP);
      await expect(contract.addCreatorFlow(user_2.address, CAP)).to.be.revertedWithCustomError(
        contract,
        "CreatorAlreadyExists",
      );
    });
  });

  describe("Add batch of creators", function () {
  it("Should correctly add a batch of creators", async function () {
    await contract.connect(admin).addBatch([user_1.address, user_2.address], [CAP, CAP]);

    let creatorInfo1 = await contract.flowingCreators(user_1.address);
    expect(creatorInfo1.cap).to.equal(CAP);

    let creatorInfo2 = await contract.flowingCreators(user_2.address);
    expect(creatorInfo2.cap).to.equal(CAP);
  });
});

describe("all Creator Data", () => {
    it("Should correctly retrieve creator data", async () => {
      await addCreatorFlows();
      const creator1 = await contract.activeCreators(0);
      const creator2 = await contract.activeCreators(1);
      const creators = await contract.allCreatorsData([creator1, creator2]);

      expect(creators[0].cap).to.equal(CAP);
      expect(creators[1].cap).to.equal(CAP);
    });
  });


describe("Remove Creator", () => {
    beforeEach(addCreatorFlows);

    it("Should remove a creator's flow successfully", async () => {
      await contract.removeCreatorFlow(user_2.address);
      const creator = await contract.flowingCreators(user_2.address);
      expect(creator[0]).to.equal(0);
    });

    it("Should emit an event when a creator's flow is removed", async () => {
      await expect(contract.removeCreatorFlow(user_2.address))
        .to.emit(contract, "CreatorRemoved")
        .withArgs(user_2.address);
    });
  });

describe("Update creator Cap", () => {
    beforeEach(addCreatorFlows);

    it("Should correctly update a creator's flow cap", async () => {
      await contract.updateCreatorFlowCapCycle(user_2.address, CAP_UPDATE);
      const creator = await contract.flowingCreators(user_2.address);
      expect(creator[0]).to.equal(CAP_UPDATE);
    });

    it("Should emit an event when a creator's flow cap is updated", async () => {
      await expect(contract.updateCreatorFlowCapCycle(user_2.address, CAP_UPDATE))
        .to.emit(contract, "CreatorUpdated")
        .withArgs(user_2.address, CAP_UPDATE, 2592000);
    });


    it("Should revert when a new cap is zero", async () => {
      await expect(contract.updateCreatorFlowCapCycle(user_2.address, 0)).to.be.revertedWithCustomError(contract,"CapCannotBeZero");
    });
});


 describe("Flow withdraw", function () {
  it("Should correctly allow a creator to withdraw", async function () {
    await contract.connect(admin).addCreatorFlow(user_2.address, 100);
    await contract.connect(admin).fundContract({ value: 1000 });

    // Fast forward 15 days
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 3600]);
    await ethers.provider.send("evm_mine");

    const initialBalance = await ethers.provider.getBalance(user_2.address);
    const tx = await contract.connect(user_2).flowWithdraw(40, "Withdraw");
    const txReceipt = await tx.wait();
    const gasUsed = txReceipt.gasUsed.mul(tx.gasPrice);

    const creatorInfo = await contract.flowingCreators(user_2.address);

    const finalBalance = await ethers.provider.getBalance(user_2.address);
    expect(finalBalance.add(gasUsed).sub(initialBalance)).to.equal(40);
  });

  it("Should correctly emit event when a creator withdraws", async () => {
    await contract.connect(admin).addCreatorFlow(user_2.address, CAP);
    await contract.connect(admin).fundContract({ value: CAP });

    // Fast forward 15 days
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 3600]);
    await ethers.provider.send("evm_mine");

    await expect(contract.connect(user_2).flowWithdraw(CAP.div(2), "Withdraw")).to.emit(contract, "Withdrawn").withArgs(user_2.address, CAP.div(2), "Withdraw");
  });
});

describe("Drain agreement", function () {
  it("Should correctly drain remaining funds to the primary admin", async function () {
    await contract.connect(admin).fundContract({ value: CAP });

    const initialAdminBalance = await ethers.provider.getBalance(admin.address);
    const tx = await contract.connect(admin).drainAgreement();
    const txReceipt = await tx.wait();
    const gasUsed = txReceipt.gasUsed.mul(tx.gasPrice);

    expect(await ethers.provider.getBalance(contract.address)).to.equal(0);

    const finalAdminBalance = await ethers.provider.getBalance(admin.address);
    expect(finalAdminBalance.add(gasUsed).sub(initialAdminBalance)).to.equal(CAP);
  });

    it("Should correctly emit event when agreement is drained", async () => {
        await contract.connect(admin).fundContract({ value: CAP });

        await expect(contract.connect(admin).drainAgreement()).to.emit(contract, "AgreementDrained").withArgs(admin.address, CAP);
    });
});



  describe("Multi-cycle rollover test", function () {
    it("Should rollover remaining amount correctly over multiple cycles", async function () {
      // Variables for the test scenario
      const creator = user_2;
      const cap = ethers.utils.parseEther("1"); // 1 ETH cap
      const midCycleTimestamp = CYCLE / 2;
      const withdrawAmount = cap.div(2); // withdraw 0.5 ETH
      const lastSecondInCycle = CYCLE - 1;

      await contract.addCreatorFlow(creator.address, cap);
      
      // Fund the contract with 10 ETH
      await contract.connect(admin).fundContract({ value: ethers.utils.parseEther("10") });


      // Advance time to the middle of the cycle
      await ethers.provider.send("evm_increaseTime", [midCycleTimestamp]);
      await ethers.provider.send("evm_mine");

      // Withdraw 0.5 ETH (half of the cap) at the middle of the cycle
      await contract.connect(creator).flowWithdraw(withdrawAmount, "Test withdraw");

      // Move to the last second of the first cycle
      await ethers.provider.send("evm_increaseTime", [midCycleTimestamp - 1]);
      await ethers.provider.send("evm_mine");

      // Check available amount at the last second of the first cycle
      const availableAmountEndFirstCycle = await contract.callStatic.availableCreatorAmount(creator.address);
      expect(availableAmountEndFirstCycle).to.be.closeTo(withdrawAmount, 385802469135); // Close to 0.5 ETH within 1_000_000 wei range

      // Move to the first second of the next cycle
      await ethers.provider.send("evm_mine");

      // Check available amount at the beginning of the next cycle
      const availableAmountStartSecondCycle = await contract.callStatic.availableCreatorAmount(creator.address);
      expect(availableAmountStartSecondCycle).to.be.closeTo(withdrawAmount,771604938271); // Close to 0.5 ETH

      // Move to the last second of the next cycle
      await ethers.provider.send("evm_increaseTime", [lastSecondInCycle]);
      await ethers.provider.send("evm_mine");

      // Check available amount at the last second of the next cycle
      const availableAmountEndNextCycle = await contract.callStatic.availableCreatorAmount(creator.address);
      expect(availableAmountEndNextCycle).to.be.closeTo(cap,771604938271); // Close to 1 ETH
    });
  });






  //more rests



});
