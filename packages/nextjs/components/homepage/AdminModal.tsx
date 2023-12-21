import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Address } from "../scaffold-eth";
import { EtherInput } from "../scaffold-eth";
import { AddressInput } from "../scaffold-eth";
import { debounce } from "lodash";
import { isAddress, parseEther } from "viem";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useApproveForFundng } from "~~/hooks/useApproveForFunding";
import { useErc20 } from "~~/hooks/useErc20";

export const AdminModal = ({
  isOpen,
  setIsOpen,
  creatorAddress,
  action,
  setAction,
  adminToRemove,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  creatorAddress?: string;
  action: string;
  setAction?: Dispatch<
    SetStateAction<
      "addCreator" | "fundContract" | "rescueEth" | "rescueToken" | "addAdmin" | "removeAdmin" | "transferOwnership"
    >
  >;
  adminToRemove?: string;
}) => {
  const [cap, setCap] = useState<string>("");
  // const [creator, setCreator] = useState<string>("");
  // The following two states hold args for addBatchCreatorFlow.
  const [batchCreators, setBatchCreators] = useState<string[] | undefined>([""]);
  const [batchCaps, setBatchCaps] = useState<string[] | undefined>([""]);

  const [fundingValue, setFundingValue] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { isErc20, tokenAddress } = useErc20();
  const [rescueTokenAddr, setRescueTokenAddr] = useState<string>("");

  const [adminAddr, setAdminAddr] = useState<string>("");
  //create newvariable for newprimaryadmin address

  const [newPrimaryAdmin, setNewPrimaryAdmin] = useState<string>("");

  useEffect(() => {
    if (newPrimaryAdmin) setNewPrimaryAdmin(newPrimaryAdmin);
  }, [newPrimaryAdmin]);

  const labelRef = useRef<HTMLLabelElement | null>(null);

  const buttonDisabled =
    action == "addAdmin"
      ? !isAddress(adminAddr)
      : action == "fundContract"
      ? fundingValue <= 0
      : action == "rescueToken"
      ? !isAddress(rescueTokenAddr)
      : action == "addCreator"
      ? batchCreators?.some(creator => !isAddress(creator)) || batchCaps?.some(cap => cap == "" || parseFloat(cap) <= 0)
      : action == "updateCreator"
      ? cap == "" || parseFloat(cap) < 0
      : action == "transferOwnership"
      ? !isAddress(newPrimaryAdmin)
      : false;

  const { writeAsync: removeCreator } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "removeCreatorFlow",
    args: [creatorAddress],
  });

  const {
    writeAsync: updateCreator,
    // isLoading: isUpdatingCreator
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "updateCreatorFlowCapCycle",
    args: [creatorAddress, BigInt(cap && cap !== undefined ? parseEther(cap) : 0)],
  });

  const {
    writeAsync: addCreator,
    // isLoading: isAddingCreator
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "addCreatorFlow",
    args: [
      batchCreators ? batchCreators[0] : "",
      BigInt(
        batchCaps && batchCaps !== undefined && batchCaps[0] !== "" && batchCaps.length == 1 && !isErc20
          ? parseEther(batchCaps[0])
          : batchCaps && batchCaps !== undefined && batchCaps[0] !== "" && batchCaps.length == 1 && isErc20
          ? parseEther(batchCaps[0])
          : 0,
      ),
    ],
  });

  const {
    writeAsync: addBatch,
    // isLoading: isAddingBatchCreators
  } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "addBatch",
    args: [
      batchCreators,
      batchCaps?.map(value =>
        BigInt(
          value && value != undefined && !isErc20
            ? parseEther(value)
            : value && value != undefined && isErc20
            ? parseEther(value)
            : 0,
        ),
      ),
    ],
  });

  const { writeAsync: fundContract, isLoading: isFundingContract } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "fundContract",
    args: [BigInt(fundingValue * 1000000000000000000)],
    value: parseEther(isErc20 ? "0" : fundingValue.toString()),
  });

  const { writeAsync: rescueTokenfunc, isLoading: isRescuingToken } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "drainAgreement",
    //args is token address
    args: [rescueTokenAddr],
  });

  // hook for rescuing eth
  const { writeAsync: rescueEth, isLoading: isRescuingEth } = useScaffoldContractWrite({
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
    args: [adminAddr, true],
  });

  // hook for removing admin
  const { writeAsync: removeAdmin } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "modifyAdminRole",
    //args is address of admin
    args: [adminToRemove, false],
  });

  const { writeAsync: transferOwnership } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "transferPrimaryAdmin",
    args: [newPrimaryAdmin],
  });

  // Hook for approving before funding for erc20 streams
  const { writeAsync: approveForFunding, allowance } = useApproveForFundng({
    tokenAddress: tokenAddress as string,
    amount: fundingValue,
    isTransferLoading: isRescuingEth || isRescuingToken || isFundingContract,
  });

  const debouncedAddCreator = debounce(async () => {
    if (!batchCreators || !batchCaps) {
      setErrorMessage("Please enter all the required fields.");
      return;
    }

    await addCreator();

    setSuccessMessage("Creator added successfully.");
    setBatchCaps([""]);
    setBatchCreators([""]);
  }, 500);

  const debouncedAddBatch = debounce(async () => {
    if (batchCreators?.length === 0 || batchCreators?.length !== batchCaps?.length) {
      setErrorMessage("Please enter valid batch data.");
      return;
    }

    await addBatch();

    setSuccessMessage("Creators added successfully.");
    setBatchCreators([""]);
    setBatchCaps([""]);
  }, 500);

  const debouncedUpdateCreator = debounce(async () => {
    if (!creatorAddress) {
      setErrorMessage("Please enter at least one creator address.");
      return;
    }

    await updateCreator();

    setSuccessMessage("Creators updated successfully.");
  }, 500);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleInputChange = (index: number, value: number | string | undefined, setState: any) => {
    setState((prevState: any) => {
      const updatedState = [...prevState];
      updatedState[index] = value !== undefined ? value : "";
      return updatedState;
    });
  };

  const handleAddInput = () => {
    setBatchCreators((prev: string[] | undefined) => [...(prev ?? []), ""]);
    setBatchCaps((prev: string[] | undefined) => [...(prev ?? []), ""]);
  };

  const handleRemoveInput = (index: number) => {
    setBatchCreators(prevBatchCreators => {
      if (prevBatchCreators) {
        const newBatchCreators = prevBatchCreators.filter((_, i) => i !== index);
        return newBatchCreators;
      }
    });
    setBatchCaps(prevBatchCaps => {
      if (prevBatchCaps) {
        const newBatchCaps = prevBatchCaps.filter((_, i) => i !== index);
        return newBatchCaps;
      }
    });
  };

  const handleModalAction = async () => {
    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      if (action === "addCreator") {
        batchCreators && batchCreators.length > 1 ? debouncedAddBatch() : debouncedAddCreator();
      } else if (action === "rescueToken") {
        await rescueTokenfunc();
        setSuccessMessage("Tokens rescued successfully.");
      } else if (action === "rescueEth") {
        await rescueEth();
        setSuccessMessage("Eth rescued successfully.");
      } else if (action === "addAdmin") {
        await addAdmin();
        setSuccessMessage("Admin added successfully.");
        setAdminAddr("");
      } else if (action === "removeAdmin") {
        await removeAdmin();
        setSuccessMessage("Admin removed successfully.");
      } else if (action === "transferOwnership") {
        await transferOwnership();
        setSuccessMessage("Ownership transferred successfully.");
      } else if (action === "updateCreator") {
        debouncedUpdateCreator();
      } else if (action === "fundContract") {
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
      } else if (action === "removeCreator") {
        if (!creatorAddress) {
          setErrorMessage("Please enter the creator address.");
          return;
        }

        await removeCreator();

        setSuccessMessage("Creator removed successfully.");
      }
    } catch (error) {
      setErrorMessage("Failed to perform the action. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenAddress && tokenAddress !== "0x0000000000000000000000000000000000000000") setRescueTokenAddr(tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    const handleOverlayClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("bg-gray-900")) {
        closePopup();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleOverlayClick);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleOverlayClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (labelRef.current) {
      labelRef.current.focus();
    }
  }, [action]);

  console.log(loading, successMessage, errorMessage);

  return (
    <div className="">
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50  md:text-base text-[0.8rem]">
        <div className=" modal-box">
          <label onClick={closePopup} className="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>
          {isOpen && action == "removeCreator" && (
            <div>
              <label className=" mt-4 mb-2 flex">
                Are you sure you want to remove{" "}
                <span className="mr-1">
                  <Address address={creatorAddress} hideIcons={true} />
                </span>{" "}
                as creator?
              </label>
            </div>
          )}
          {isOpen && action == "updateCreator" && (
            <div>
              <label className=" mt-4 mb-2 flex">
                Update
                <span className="mr-1">
                  <Address address={creatorAddress} hideIcons={true} />
                </span>{" "}
                hacker stream{" "}
              </label>
              <label ref={labelRef}>
                <h1 className="block mt-4 mb-2">Cap:</h1>
                <EtherInput value={cap.toString()} onChange={value => setCap(value)} placeholder="Enter cap amount" />
              </label>
            </div>
          )}
          {isOpen && action == "addCreator" && (
            <div>
              <div>
                {batchCreators &&
                  batchCreators.map((creator, index) => (
                    <div key={index}>
                      <label ref={index == 0 ? labelRef : null}>
                        <h1 className="block mt-4 mb-2 "> Creator Address{index != 0 && " " + (index + 1)}:</h1>
                        {index != 0 && (
                          <div className="flex justify-between">
                            <div className="w-[92%]">
                              <AddressInput
                                name={`batch-creators-${index}`}
                                value={creator}
                                onChange={value => handleInputChange(index, value, setBatchCreators)}
                              />
                            </div>
                            <button
                              className="hover:bg-primary p-1 rounded-md active:scale-90"
                              onClick={() => {
                                handleRemoveInput(index);
                              }}
                            >
                              <TrashIcon className="h-[1.5rem]" />
                            </button>
                          </div>
                        )}
                        {index == 0 && (
                          <AddressInput
                            name={`batch-creators-${index}`}
                            value={creator}
                            onChange={value => handleInputChange(index, value, setBatchCreators)}
                          />
                        )}
                      </label>

                      <label>
                        <h1 className="block mt-4 mb-2">Cap{index != 0 && " " + (index + 1)}:</h1>
                        <EtherInput
                          value={batchCaps ? batchCaps[index]?.toString() : ""}
                          onChange={value => handleInputChange(index, value, setBatchCaps)}
                          placeholder="Enter stream cap"
                        />
                      </label>
                    </div>
                  ))}
                <button className="btn btn-primary  mt-2  rounded-md flex ml-auto" onClick={handleAddInput}>
                  <PlusIcon className="h-[1.3rem]" />
                </button>
              </div>
            </div>
          )}
          {(action === "fundContract" || action === "rescueEth" || action === "rescueToken") && setAction && (
            <ul className="menu menu-horizontal bg-base-100 rounded-box activemenu">
              <li onClick={() => setAction("fundContract")}>
                <a className={action === "fundContract" ? "active" : "bg-base-300"}>FUND</a>
              </li>
              <li onClick={() => setAction("rescueEth")}>
                <a className={action === "rescueEth" ? "active" : "bg-base-300"}>RESCUE ETH</a>
              </li>
              <li onClick={() => setAction("rescueToken")}>
                <a className={action === "rescueToken" ? "active" : "bg-base-300"}>RESCUE TOKEN</a>
              </li>
            </ul>
          )}
          {isOpen && action == "fundContract" && (
            <div>
              <div>
                <label ref={labelRef}>
                  <h1 className="block mt-4 mb-2">Funding amount:</h1>
                  <EtherInput value={fundingValue.toString()} onChange={e => setFundingValue(Number(e))} />
                </label>
              </div>
            </div>
          )}
          {isOpen && action === "rescueToken" && (
            <div>
              <p className="">Transfer token balance from the contract to primary admin</p>
              <label ref={labelRef}>
                <h1 className="block mt-4 mb-2"> Token Address:</h1>
                <AddressInput
                  value={rescueTokenAddr === "0x0000000000000000000000000000000000000000" ? "" : rescueTokenAddr}
                  onChange={value => setRescueTokenAddr(value)}
                />
              </label>
            </div>
          )}
          {isOpen && action === "rescueEth" && (
            <div>
              <p className="">Transfer eth balance from the contract to primary admin</p>
            </div>
          )}
          {isOpen && action === "addAdmin" && (
            <div>
              <label ref={labelRef}>
                <h1 className="block mt-4 mb-2">Admin Address:</h1>
                <AddressInput value={adminAddr} onChange={value => setAdminAddr(value)} />
              </label>
            </div>
          )}
          {isOpen && action === "removeAdmin" && (
            <div>
              <label className=" mt-4 mb-2 flex">
                Are you sure you want to remove{" "}
                <span className="mr-1">
                  <Address address={adminToRemove} hideIcons={true} />
                </span>{" "}
                as admin?
              </label>
            </div>
          )}
          {isOpen && action === "transferOwnership" && (
            <div>
              Address of new owner:
              <AddressInput value={newPrimaryAdmin} onChange={value => setNewPrimaryAdmin(value)} />
            </div>
          )}

          <button
            className="btn btn-primary text-lg font-normal rounded-lg w-full mt-2 ml-auto"
            disabled={buttonDisabled}
            onClick={handleModalAction}
          >
            {action == "removeCreator" && "Remove"}
            {action == "updateCreator" && "update"}
            {action == "addCreator" && (batchCreators && batchCreators.length > 1 ? "Add Batch" : "Add Creator")}
            {action == "fundContract" && (isErc20 && (allowance as number) < fundingValue ? "Approve" : "Fund")}
            {action == "rescueEth" && "Rescue Eth"}
            {action == "rescueToken" && "Rescue Token"}
            {action == "addAdmin" && "Add Admin"}
            {action == "removeAdmin" && "Remove Admin"}
            {action == "transferOwnership" && "Transfer Ownership"}
          </button>
        </div>
      </div>
    </div>
  );
};
