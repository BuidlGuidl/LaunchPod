import React, { useState } from "react";
import { AddressInput } from "../../scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useErc20 } from "~~/hooks/useErc20";
import Modal from "~~/components/Modal";


const Rescue: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<"rescueEth" | "rescueToken">("rescueEth");
  const [rescueToken, setRescueToken] = useState<string>("");
  const { tokenAddress } = useErc20();

  const { writeAsync: rescueEth } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "drainAgreement",
    args: ["0x0000000000000000000000000000000000000000"],
  });

  const { writeAsync: rescueTokenfunc } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "drainAgreement",
    args: [rescueToken],
  });

  
  const handleRescue = async () => {
    try {
      if (selectedAction === "rescueEth") {
        await rescueEth();
      } else if (selectedAction === "rescueToken") {
        tokenAddress && setRescueToken(tokenAddress);
        await rescueTokenfunc();
      }
    } catch (error) {
      // Handle error
    }
  };

  const triggerElement = (
    <div onClick={() => setSelectedAction("rescueEth")}>
      Rescue
    </div>
  );

  const modalContent = (
    <div>
      <div className="flex justify-center items-center">
        <select
          name="selectedAction"
          value={selectedAction}
          onChange={e => setSelectedAction(e.target.value as "rescueEth" | "rescueToken")}
          className="select select-accent font-sans w-full max-w-xs"
        >
          <option value="rescueEth">Rescue Eth</option>
          <option value="rescueToken">Rescue Tokens</option>
        </select>
      </div>
      {selectedAction === "rescueToken" && (
        <div>
          <label htmlFor="token" className="block mt-4">
            Token Address:
          </label>
          <AddressInput value={rescueToken} onChange={setRescueToken} />
        </div>
      )}
      <div className="flex justify-between mt-8">
        <button className="btn btn-primary rounded-lg" onClick={handleRescue}>
          {selectedAction === "rescueEth" ? "Rescue Eth" : "Rescue Tokens"}
        </button>
      </div>
    </div>
  );

  return (
    <Modal trigger={triggerElement} modalTitle="Rescue" modalContent={modalContent} />
  );
};

export default Rescue;
