import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { YourContract } from "../../typechain-types";
import { Address } from "hardhat-deploy/types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
describe("YourContract by ValentineCodes", () => {
  let admin: SignerWithAddress;
  let valentine: SignerWithAddress;
  let pipoca: SignerWithAddress;

  let contract: YourContract;

  beforeEach(async () => {
    const signers: SignerWithAddress[] = await ethers.getSigners();

    admin = signers[0];
    valentine = signers[1];
    pipoca = signers[2];

    await deployments.fixture("YourContract");

    contract = await ethers.getContract("YourContract", admin);
  });

  const hasAdminRole = async (account: Address) => {
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    return await contract.hasRole(DEFAULT_ADMIN_ROLE, account);
  };

  const addCreatorFlows = async () => {
    await contract.addCreatorFlow(valentine.address, 100);
    await contract.addCreatorFlow(pipoca.address, 50);
  };

  describe("constructor", () => {
    it("sets default admin role", async () => {
      expect(await hasAdminRole(admin.address)).to.be.true;
    });
  });

  describe("modifyAdminRole", () => {
    it("grants admin role to specified account", async () => {
      await contract.modifyAdminRole(valentine.address, true);
      expect(await hasAdminRole(valentine.address)).to.be.true;
      expect(await hasAdminRole(admin.address)).to.be.true;
    });
    it("revokes admin role", async () => {
      await contract.modifyAdminRole(valentine.address, false);
      expect(await hasAdminRole(valentine.address)).to.be.false;
    });
  });

  describe("fundContract", () => {
    it("funds contract and emits an event", async () => {
      const provider = ethers.provider;

      const oldBalance = await provider.getBalance(contract.address);

      const amount = ethers.utils.parseEther("10");
      await expect(contract.fundContract({ value: amount }))
        .to.emit(contract, "FundsReceived")
        .withArgs(admin.address, amount);

      const newBalance = await provider.getBalance(contract.address);

      expect(newBalance).to.equal(oldBalance.add(amount));
    });
    it("reverts if amount is ZERO", async () => {
      await expect(contract.fundContract({ value: 0 })).to.be.revertedWithCustomError(contract, "NoValueSent");
    });
  });

  describe("emergencyMode", () => {
    it("toggles emergency mode", async () => {
      await contract.emergencyMode(true);
      expect(await contract.stopped()).to.be.true;
    });
    it("reverts if caller is not admin", async () => {
      await expect(contract.connect(valentine).emergencyMode(false)).to.be.revertedWithCustomError(
        contract,
        "AccessDenied",
      );
    });
  });

  describe("addCreatorFlow", () => {
    it("adds creator flow and emits an event", async () => {
      await expect(contract.addCreatorFlow(valentine.address, 100))
        .to.emit(contract, "CreatorAdded")
        .withArgs(valentine.address, 100, 30 * (60 * 60 * 24));

      const creator = await contract.flowingCreators(valentine.address);
      expect(creator[0]).to.equal(100);
      expect(await contract.activeCreators(0)).to.equal(valentine.address);
    });
    it("reverts if max creator has been reached", async () => {
      await addCreatorFlows();
      await expect(contract.addCreatorFlow(admin.address, 100)).to.be.revertedWithCustomError(
        contract,
        "MaxCreatorsReached",
      );
    });
    it("reverts if creator is zero address", async () => {
      await expect(contract.addCreatorFlow(ZERO_ADDRESS, 100)).to.be.revertedWithCustomError(
        contract,
        "InvalidCreatorAddress",
      );
    });
    it("reverts if cap is zero", async () => {
      await expect(contract.addCreatorFlow(valentine.address, 0)).to.be.revertedWithCustomError(
        contract,
        "CapCannotBeZero",
      );
    });
    it("reverts if creator already exists", async () => {
      await contract.addCreatorFlow(valentine.address, 100);
      await expect(contract.addCreatorFlow(valentine.address, 100)).to.be.revertedWithCustomError(
        contract,
        "CreatorAlreadyExists",
      );
    });
  });

  describe("allCreatorsData", () => {
    it("retrieves creators data", async () => {
      await addCreatorFlows();
      const creator1 = await contract.activeCreators(0);
      const creator2 = await contract.activeCreators(1);
      const creators = await contract.allCreatorsData([creator1, creator2]);

      expect(creators[0].cap).to.equal(100);
      expect(creators[1].cap).to.equal(50);
    });
  });
});
