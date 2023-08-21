import React, { useState } from "react";
import { AddressInput, EtherInput } from "../../scaffold-eth";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { debounce } from "lodash";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useErc20 } from "~~/hooks/useErc20";
import Modal from "~~/components/Modal";

type AddCreatorProps = {
//   onClose: () => void;
};

const AddCreator: React.FC<AddCreatorProps> = ({ }) => {
  const [selectedAction, setSelectedAction] = useState<"add" | "batchAdd">("add");
  const [creator, setCreator] = useState<string>("");
  const [cap, setCap] = useState<string>("");
  const [batchCreators, setBatchCreators] = useState<string[]>([]);
  const [batchCaps, setBatchCaps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isErc20 } = useErc20();

  const { writeAsync: addCreator } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "addCreatorFlow",
    args: [creator, cap && cap !== undefined ? BigNumber.from(parseEther(cap)) : BigNumber.from(0)],
  });

  const { writeAsync: addBatch } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "addBatch",
    args: [
      batchCreators,
      batchCaps.map(value =>
        value && value !== undefined ? BigNumber.from(parseEther(value)) : BigNumber.from(0)
      ),
    ],
  });

  const handleAddSuccess = () => {
    // handle success actions here
  };

  const handleAddError = () => {
    // handle error actions here
  };

  const handleAdd = debounce(async () => {
    setLoading(true);

    try {
      if (batchCreators.length > 0) {
        await addBatch();
      } else {
        await addCreator();
      }
      handleAddSuccess();
    } catch (error) {
      handleAddError();
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleBatchAdd = debounce(() => {
    setBatchCreators(prevBatchCreators => [...prevBatchCreators, ""]);
    setBatchCaps(prevBatchCaps => [...prevBatchCaps, ""]);
  }, 500);

  
  const reset = () => {
    setBatchCreators([]);
    setBatchCaps([]);
    setSelectedAction("add");
  };

    
  const triggerElement = (
    <div
        className="text-lg w-full mt-6 items-center gap-1 flex flex-row cursor-pointer"
        onClick={() => setSelectedAction("add")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Creator
    </div>
  );
  
  const modalContent = (
    <div>
      {selectedAction === "add" && (
        <>
          <label htmlFor="creator" className="block mt-4">
            Creator Address:
          </label>
          <AddressInput value={creator} onChange={value => setCreator(value)} />
          <label htmlFor="cap" className="block mt-4">
            Cap:
          </label>
          <EtherInput value={cap.toString()} onChange={value => setCap(value)} placeholder="Enter stream cap" />
        </>
      )}
  
      {selectedAction === "batchAdd" && (
        <>
          {batchCreators.map((_, index) => (
            <div key={index}>
              <label htmlFor={`batch-creators-${index}`} className="block mt-4">
                Batch Creator Address {index + 1}:
              </label>
              <AddressInput
                name={`batch-creators-${index}`}
                value={batchCreators[index]}
                onChange={value => {
                  const updatedCreators = [...batchCreators];
                  updatedCreators[index] = value;
                  setBatchCreators(updatedCreators);
                }}
              />
  
              <label htmlFor={`batch-caps-${index}`} className="block mt-4">
                Batch Cap {index + 1}:
              </label>
              <EtherInput
                value={batchCaps[index]}
                onChange={value => {
                  const updatedCaps = [...batchCaps];
                  updatedCaps[index] = value;
                  setBatchCaps(updatedCaps);
                }}
                placeholder="Enter stream cap"
              />
            </div>
          ))}
        </>
      )}
      
      {selectedAction === "batchAdd" && 
        <div className="mt-4">
          <button
            className="btn"
            onClick={reset}
          >
            Back
          </button>
        </div>
      }
  
      <button className="flex w-full items-center py-5 flex-row justify-end" onClick={() => {
        setSelectedAction("batchAdd");
        handleBatchAdd()
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Batch
      </button>
    </div>
  );
    
  
  const modalAction = {
    label: loading ? (selectedAction === "batchAdd" ? "Adding Batch..." : "Adding...") : (selectedAction === "batchAdd" ? "Add Batch" : "Add Creator"),
    onClick: selectedAction === "batchAdd" ? handleBatchAdd : handleAdd,
    // disabled: loading,
  };
  

  return (
    <Modal trigger={triggerElement} modalTitle="AddCreator" modalContent={modalContent} action={modalAction} />
  );
};

export default AddCreator;
