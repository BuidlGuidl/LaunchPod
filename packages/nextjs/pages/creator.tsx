import React, { useEffect, useState } from "react";
import { CreatorData } from ".";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";
import { useAccount } from "wagmi";
import { CreatorInfoDisplay } from "~~/components/CreatorInfoDisplay";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useIsCreator } from "~~/hooks/useIsCreator";
import { useSetCreator } from "~~/hooks/useSetCreator";

const Creator: React.FC<undefined> = () => {
  const { address, isConnected } = useAccount();
  const { isCreator, isLoading: isLoadingCreators } = useIsCreator();

  const [creatorData, setCreatorData] = useState<CreatorData>({});

  // State to hold flow withdrawal args.
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined);
  const [reason, setReason] = useState<string>("");
  const [unlocked, setUnlocked] = useState<BigNumber | undefined>(undefined);

  // Get creator data.
  const { data: allCreatorData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allCreatorsData",
    args: [[address || ""]],
  });

  useSetCreator({ allCreatorsData: allCreatorData, creators: [address || ""], setCreatorsData: setCreatorData });

  // Get creator unlocked amount.
  const { data: creatorAmt } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "availableCreatorAmount",
    args: [address],
  });

  useEffect(() => {
    if (creatorAmt) {
      setUnlocked(creatorAmt);
    }
  }, [creatorAmt]);

  // Flow withdrawal.
  const { writeAsync: withdraw, isLoading: isWithdrawing } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "flowWithdraw",
    args: [amount, reason],
  });

  const handleWithdraw = () => {
    // Check if the amount is not greater than the unlocked amount
    if (amount && unlocked && amount.lte(unlocked)) {
      // handle the withdraw action
      withdraw();
    } else {
      alert("Withdrawal amount cannot be greater than the unlocked amount.");
    }
  };

  const handleAmountChange = (value: string) => {
    const parsedAmount = value !== "" ? parseUnits(value, 18) : undefined;
    setAmount(parsedAmount);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  if (!isConnected) {
    return <div className="text-center m-auto">Connect to continue.</div>;
  }

  if (!isCreator) {
    return <div className="text-center m-auto">You are not worthy to view this page.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-6">
      {isLoadingCreators ? (
        <div className="text-center m-auto">Loading creator information...</div>
      ) : (
        <>
          <div className="flex flex-col p-5 text-center items-center max-w-full">
            <div className="w-full my-20">
              <h1 className="text-center font-bold tracking-widest uppercase">Your Stream</h1>
              {Object.entries(creatorData).map(([creatorAddress, creatorData]) => (
                <CreatorInfoDisplay key={creatorAddress} creatorData={creatorData} creatorAddress={creatorAddress} />
              ))}
            </div>
          </div>
          <label htmlFor="my-modal" className="btn btn-primary rounded-lg">
            Withdraw
          </label>

          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative space-y-4">
              <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
                ✕
              </label>
              <h3 className="text-lg font-bold">Withdraw</h3>
              <div>
                <label htmlFor="reason py-2">Reason:</label>
                <input
                  type="text"
                  id="reason"
                  className="w-full py-2 input"
                  value={reason}
                  onChange={handleReasonChange}
                />
              </div>
              <div>
                <label htmlFor="amount">Amount:</label>
                <EtherInput value={amount?.toString() || ""} onChange={handleAmountChange} />
              </div>
              <div className="modal-action">
                <button onClick={handleWithdraw} className="btn rounded-lg" disabled={isWithdrawing}>
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Creator;
