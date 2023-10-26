import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();

  const { deploy, get } = hre.deployments;

  const ERC20Mock1 = await get("ERC20Mock1");
  const ERC20Mock1Address = ERC20Mock1.address;
  const arrayofcreators = ["0x61097BA76cD906d2ba4FD106E757f7Eb455fc295", "0x498cBe94d0f1730D0D745752340044AB03086011"];
  const caps = [10 * 10 ** 18, 10 * 10 ** 18];

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments

    args: ["0x7d0FdcDCb8876365E131091C9E10AA9AA8E863C3", ZERO_ADDRESS, [], []],

    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  // const yourContract = await hre.ethers.getContract("YourContract", deployer);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
