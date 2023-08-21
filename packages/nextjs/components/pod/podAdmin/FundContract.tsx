import React, { useState } from "react";
import { BigNumber } from "ethers";
import { useApproveForFundng } from "~~/hooks/useApproveForFunding";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { EtherInput } from "../../scaffold-eth";
import Modal from "../../Modal";
import { useErc20 } from "~~/hooks/useErc20";

const FundContract: React.FC = () => {
  const [fundingValue, setFundingValue] = useState<number>(0);
  const { isErc20, tokenAddress } = useErc20();

  const { writeAsync: fundContract, isLoading: isFundingContract } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "fundContract",
    args: [BigNumber.from(BigInt(fundingValue * 1000000000000000000).toString())],
    value: isErc20 ? "0" : fundingValue.toString(),
  });

  const { writeAsync: approveForFunding, allowance } = useApproveForFundng({
    tokenAddress: tokenAddress as string,
    amount: fundingValue,
    isTransferLoading: isFundingContract,
  });

  const handleFund = async () => {
    try {
      if (!fundingValue) {
        // Handle error for invalid funding value
        return;
      }

      if (isErc20) {
        if ((allowance as number) < fundingValue) {
          await approveForFunding();
          // Handle approval success
        } else {
          await fundContract();
          // Handle fund contract success
        }
      } else {
        await fundContract();
        // Handle ETH fund contract success
      }
      // Handle success message
    } catch (error) {
      // Handle error message
      console.error(error);
    }
  };

  const triggerElement = (
    <button className="btn rounded-md btn-primary py-3 mt-2 text-xl px-6 w-full">
      Fund
    </button>
  );

  const modalContent = (
    <div>
      <label htmlFor="fundingValue" className="block mt-4">
        Funding amount:
      </label>
      <EtherInput value={fundingValue.toString()} onChange={value => setFundingValue(Number(value))} />
    </div>
  );

  const action = {
    label: isErc20 ? (allowance as number) < fundingValue ? "Approve" : "Fund" : "Fund",
    onClick: handleFund,
  };

  return <Modal trigger={triggerElement} modalTitle={"FundContract"} modalContent={modalContent} action={action} />;
};

export default FundContract;
