import React, { useState } from "react";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { EtherInput } from "../../scaffold-eth";
import Modal from "../../Modal";

const UpdateCreator: React.FC<{ address: string }> = ({ address }) => {
  const [cap, setCap] = useState<string>("");

  const { writeAsync: updateCreator } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "updateCreatorFlowCapCycle",
    args: [address, cap && cap !== undefined ? BigNumber.from(parseEther(cap)) : BigNumber.from(0)],
  });

  const handleUpdate = async () => {
    try {
      await updateCreator();
      // Handle success message 
    } catch (error) {
      // Handle error message
      console.error(error);
    }
  };

  
  const triggerElement = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
  );

  const modalContent = (
    <div>
      <label htmlFor={`cap-${address}`} className="block mt-4">
        New cap:
      </label>
      <EtherInput value={cap.toString()} onChange={value => setCap(value)} placeholder="Enter cap amount" />
    </div>
  );

  const action = {
    label: "Update",
    onClick: handleUpdate,
  };

  return (
    <Modal trigger={triggerElement} modalTitle={"Update"} modalContent={modalContent} action={action} />
  );
};

export default UpdateCreator;

