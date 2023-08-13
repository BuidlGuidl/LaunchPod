import { useEffect, useState } from "react";
import { AddressInput, EtherInput } from "./scaffold-eth";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { debounce } from "lodash";
import { Balance } from "~~/components/scaffold-eth/Balance";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useApproveForFundng } from "~~/hooks/useApproveForFunding";
import { useErc20 } from "~~/hooks/useErc20";

const Admin = () => {

  const [modalAction, setModalAction] = useState<string>("add");
  // The following two states hold args for addCreatorFlow.
  const [creator, setCreator] = useState<string>("");
  const [cap, setCap] = useState<string>("");
  // The following two states hold args for addBatchCreatorFlow.
  const [batchCreators, setBatchCreators] = useState<string[] | undefined>();
  const [batchCaps, setBatchCaps] = useState<string[] | undefined>();
  // The following state hold args for drainAggreement.

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fundingValue, setFundingValue] = useState<number>(0);
  const { isErc20, tokenAddress } = useErc20();

  const [drainTokenAddr, setDrainTokenAddr] = useState<string>(
    tokenAddress || "0x0000000000000000000000000000000000000000",
  );

  const [addadmin, setaddadmin] = useState<string>("");
  const [removeadmin, setremoveadmin] = useState<string>("");
  const [rescueToken, setRescueToken] = useState<string>(tokenAddress || "0x0000000000000000000000000000000000000000");

  useEffect(() => {
    if (tokenAddress) {
      setDrainTokenAddr(tokenAddress);
    }
  }, [tokenAddress]);

  useEffect(() => {
    if (tokenAddress) {
      setRescueToken(tokenAddress);
    }
  }, [tokenAddress]);

  // hook for rescuing tokens
  const { writeAsync: rescueTokenfunc } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "drainAgreement",
    //args is token address
    args: [rescueToken],
  });

  // hook for rescuing eth
  const { writeAsync: rescueEth } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "drainAgreement",
    //args is zero address
    args: ["0x0000000000000000000000000000000000000000"],
  });

  // hook for adding admin
  const { writeAsync: addAdmin } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "modifyAdminRole",
    //args is address of admin
    args: [addadmin, true],
  });

  // hook for removing admin
  const { writeAsync: removeAdmin } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "modifyAdminRole",
    //args is address of admin
    args: [removeadmin, false],
  });

  // Write hook for adding a creator.
  const {
    writeAsync: addCreator,
    // isLoading: isAddingCreator
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "addCreatorFlow",
    args: [creator, cap && cap !== undefined ? BigNumber.from(parseEther(cap)) : BigNumber.from(0)],
  });

  // Write hook for adding batch creators.
  const {
    writeAsync: addBatch,
    // isLoading: isAddingBatchCreators
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "addBatch",
    args: [
      batchCreators,
      batchCaps?.map(value => (value && value !== undefined ? BigNumber.from(parseEther(value)) : BigNumber.from(0))),
    ],
  });

  // Write hook for adding batch creators.
  const {
    writeAsync: updateCreator,
    // isLoading: isUpdatingCreator
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "updateCreatorFlowCapCycle",
    args: [creator, cap && cap !== undefined ? BigNumber.from(parseEther(cap)) : BigNumber.from(0)],
  });

  // Write hook for removing a creator.
  const {
    writeAsync: removeCreator,
    // isLoading: isRemovingCreator
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "removeCreatorFlow",
    args: [creator],
  });

  // Write hook for funding contract.
  const { writeAsync: fundContract, isLoading: isFundingContract } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "fundContract",
    args: [BigNumber.from(BigInt(fundingValue * 1000000000000000000).toString())],
    value: isErc20 ? "0" : fundingValue.toString(),
  });

  // Write hook for draining agreement.
  const { writeAsync: drainAgreement, isLoading: isDrainingAgreement } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "drainAgreement",
    args: [drainTokenAddr],
  });

  // Hook for approving before funding for erc20 streams
  const { writeAsync: approveForFunding, allowance } = useApproveForFundng({
    tokenAddress: tokenAddress as string,
    amount: fundingValue,
    isTransferLoading: isDrainingAgreement || isFundingContract,
  });

  // use debounce for add,batchAdd and update
  const debouncedAddCreator = debounce(async () => {
    if (!creator || !cap) {
      setErrorMessage("Please enter all the required fields.");
      return;
    }

    await addCreator();

    setSuccessMessage("Creator added successfully.");
    setCreator("");
    setCap("0");
  }, 500);

  const debouncedAddBatch = debounce(async () => {
    if (batchCreators?.length === 0 || batchCreators?.length !== batchCaps?.length) {
      setErrorMessage("Please enter valid batch data.");
      return;
    }

    await addBatch();

    setSuccessMessage("Creators added successfully.");
    setBatchCreators([]);
    setBatchCaps([]);
  }, 500);

  const debouncedUpdateCreator = debounce(async () => {
    if (!creator) {
      setErrorMessage("Please enter at least one creator address.");
      return;
    }

    await updateCreator();

    setSuccessMessage("Creators updated successfully.");
    setCreator("");
  }, 500);

  const handleModalAction = async () => {
    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      if (modalAction === "add") {
        debouncedAddCreator();
      } else if (modalAction === "rescueToken") {
        await rescueTokenfunc();
        setSuccessMessage("Tokens rescued successfully.");
      } else if (modalAction === "rescueEth") {
        await rescueEth();
        setSuccessMessage("Eth rescued successfully.");
      } else if (modalAction === "addadmin") {
        await addAdmin();
        setSuccessMessage("Admin added successfully.");
        setaddadmin("");
      } else if (modalAction === "removeadmin") {
        await removeAdmin();
        setSuccessMessage("Admin removed successfully.");
        setremoveadmin("");
      } else if (modalAction === "batchAdd") {
        debouncedAddBatch();
      } else if (modalAction === "update") {
        debouncedUpdateCreator();
      } else if (modalAction === "fund") {
        if (!fundingValue) {
          setErrorMessage("The amount is not valid.");
          return;
        }

        if (isErc20 && (allowance as number) < fundingValue) {
          try {
            await approveForFunding();

            setSuccessMessage("Approved successfully.");
          } catch (error) {
            setErrorMessage("Failed to approve contract to spend tokens. Please try again.");
            console.error(error);
          }
        } else {
          try {
            await fundContract();

            setSuccessMessage("Contract funded successfully.");
            setFundingValue(0);
          } catch (error) {
            setErrorMessage("Failed to fund contract. Please try again.");
            console.error(error);
          }
        }
      } else if (modalAction === "remove") {
        if (!creator) {
          setErrorMessage("Please enter the creator address.");
          return;
        }

        await removeCreator();

        setSuccessMessage("Creator removed successfully.");
        setCreator("");
      } else if (modalAction === "drain") {
        await drainAgreement();
        setSuccessMessage("Contract drained successfully.");
      }
      // setModalAction("");
    } catch (error) {
      setErrorMessage("Failed to perform the action. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInput = () => {
    setBatchCreators((prev: string[] | undefined) => [...(prev ?? []), ""]);
    setBatchCaps((prev: string[] | undefined) => [...(prev ?? []), ""]);
  };

  const handleInputChange = (index: number, value: number | string | undefined, setState: any) => {
    setState((prevState: any) => {
      const updatedState = [...prevState];
      updatedState[index] = value !== undefined ? value : "";
      return updatedState;
    });
  };

  const handleModalActionSelect = (action: string) => {
    setModalAction(action);
  };

  const reset = () => {
    setCreator("");
    setCap("");
    setBatchCreators([]);
    setBatchCaps([]);
    setLoading(false);
    setSuccessMessage("");
    setErrorMessage("");
    setFundingValue(0);
    setDrainTokenAddr("0x0000000000000000000000000000000000000000");
    setaddadmin("");
    setremoveadmin("");
    setRescueToken("");
  };

  // to avoid linting issues untill loading and transaction states is implemented.
  console.log(loading, successMessage, errorMessage);

  return (
    <div className="flex justify-center items-center">
      <label htmlFor="my-modal" className="btn btn-primary rounded-lg">
        Manage
      </label>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div>
            <div className="flex justify-center items-center">
              {/* Add action selection UI */}
              <div>
                <select
                  name="modalAction"
                  value={modalAction}
                  onChange={e => handleModalActionSelect(e.target.value)}
                  className="select select-accent w-full max-w-xs"
                >
                  <option value="add">Add Creator</option>
                  <option value="batchAdd">Batch Add Creators</option>
                  <option value="update">Update Creator</option>
                  <option value="remove">Remove Creator</option>
                  <option value="fund">Fund Contract</option>
                  <option value="drain">Drain Agreement</option>
                  <option value="addadmin">Add Admin</option>
                  <option value="removeadmin">Remove Admin</option>
                  <option value="rescueToken">Rescue Tokens</option>
                  <option value="rescueEth">Rescue Eth</option>
                </select>
              </div>

              <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
                ✕
              </label>
            </div>
          </div>
          <h3 className="font-bold text-center uppercase py-2 text-lg">
            {modalAction === "add" && "Add Creator"}
            {modalAction === "batchAdd" && "Batch Add Creators"}
            {modalAction === "update" && "Update Creator"}
            {modalAction === "remove" && "Remove Creator"}
            {modalAction === "fund" && "Fund Contract"}
            {modalAction === "drain" && "Drain Agreement"}
            {modalAction === "addadmin" && "Add Admin"}
            {modalAction === "removeadmin" && "Remove Admin"}
            {modalAction === "rescueToken" && "Rescue Tokens"}
            {modalAction === "rescueEth" && "Rescue Eth"}
          </h3>
          {modalAction === "addadmin" && (
            <div>
              <label htmlFor="admin" className="block mt-4">
                Admin Address:
              </label>
              <AddressInput value={addadmin} onChange={value => setaddadmin(value)} />
            </div>
          )}
          {modalAction === "removeadmin" && (
            <div>
              <label htmlFor="admin" className="block mt-4">
                Admin Address:
              </label>
              <AddressInput value={removeadmin} onChange={value => setremoveadmin(value)} />
            </div>
          )}

          {modalAction === "update" && (
            <div>
              <label htmlFor="creator" className="block mt-4">
                Creator Address:
              </label>
              <AddressInput value={creator} onChange={value => setCreator(value)} />
              <label htmlFor="cap" className="block mt-4">
                Cap:
              </label>
              <EtherInput value={cap.toString()} onChange={value => setCap(value)} placeholder="Enter cap amount" />
            </div>
          )}

          {modalAction === "drain" && (
            <div>
              <label htmlFor="token" className="block mt-4">
                {isErc20 && "Token Address:"}
              </label>
              {isErc20 && <AddressInput value={drainTokenAddr} onChange={value => setDrainTokenAddr(value)} />}
            </div>
          )}
          {modalAction === "batchAdd" && (
            <div>
              {batchCreators &&
                batchCreators.map((creator, index) => (
                  <div key={index}>
                    <label htmlFor={`batch-creators-${index}`} className="block mt-4">
                      Creator Address {index + 1}:
                    </label>
                    <AddressInput
                      name={`batch-creators-${index}`}
                      value={creator}
                      onChange={value => handleInputChange(index, value, setBatchCreators)}
                    />

                    <label htmlFor={`batch-caps-${index}`} className="block mt-4">
                      Cap {index + 1}:
                    </label>
                    <EtherInput
                      value={batchCaps ? batchCaps[index].toString() : ""}
                      onChange={value => handleInputChange(index, value, setBatchCaps)}
                      placeholder="Enter stream cap"
                    />
                  </div>
                ))}

              <button className="flex w-full items-center flex-row justify-end" onClick={handleAddInput}>
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
                Add
              </button>
            </div>
          )}
          {modalAction === "fund" && (
            <div>
              <label htmlFor="creator" className="block mt-4">
                Funding amount:
              </label>
              <EtherInput value={fundingValue.toString()} onChange={e => setFundingValue(Number(e))} />
            </div>
          )}
          {modalAction === "rescueToken" && (
            <div>
              <label htmlFor="token" className="block mt-4">
                Token Address:
              </label>
              <AddressInput
                value={
                  rescueToken === "0x0000000000000000000000000000000000000000" ? "" : rescueToken
                }
                onChange={value => setRescueToken(value)}
              />
            </div>
          )}
          {modalAction !== "update" &&
            modalAction !== "batchAdd" &&
            modalAction !== "fund" &&
            modalAction !== "drain" &&
            modalAction !== "addadmin" &&
            modalAction !== "removeadmin" &&
            modalAction !== "rescueEth" &&
            modalAction !== "rescueToken" && (
              <div>
                <label htmlFor="creator" className="block mt-4">
                  Creator Address:
                </label>
                <AddressInput value={creator} onChange={value => setCreator(value)} />
                {modalAction === "add" && (
                  <>
                    <label htmlFor="cap" className="block mt-4">
                      Cap:
                    </label>
                    <EtherInput
                      value={cap.toString()}
                      onChange={value => setCap(value)}
                      placeholder="Enter stream cap"
                    />
                  </>
                )}
              </div>
            )}
          <div className="flex justify-between mt-8">
            {modalAction !== "rescueEth" && (
              <button className="btn rounded-lg" onClick={reset}>
                reset
              </button>
            )}
            {modalAction === "rescueEth" && <button className="invisible"></button>}
            {modalAction && (
              <button className="btn btn-primary rounded-lg" onClick={handleModalAction}>
                {modalAction === "add" && "Add"}
                {modalAction === "batchAdd" && "Add Batch"}
                {modalAction === "update" && "Update"}
                {modalAction === "remove" && "Remove"}
                {modalAction === "fund" && (isErc20 && (allowance as number) < fundingValue ? "Approve" : "Fund")}
                {modalAction === "drain" && "Drain"}
                {modalAction === "addadmin" && "Add Admin"}
                {modalAction === "removeadmin" && "Remove Admin"}
                {modalAction === "rescueToken" && "Rescue Tokens"}
                {modalAction === "rescueEth" && "Rescue Eth"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
