import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { EtherInput } from "../scaffold-eth";
import { parseEther } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const WithdrawModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("0");
  const characterLimit = 400;

  const labelRef = useRef<HTMLLabelElement | null>(null);

  const { writeAsync: withdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "flowWithdraw",
    args: [amount ? parseEther(amount) : parseEther("0"), reason],
  });

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleReasonChange = (value: string) => {
    const inputText = value;

    if (inputText.length <= characterLimit) {
      setReason(inputText);
    } else return;
  };

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
  }, []);

  return (
    <div className="">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 md:text-sm text-[0.7rem]">
          <div className=" modal-box">
            <label onClick={closePopup} className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </label>
            <label ref={labelRef}>
              <h1 className="block mt-4 mb-2">Amount: </h1>
              <EtherInput
                value={amount.toString()}
                onChange={value => {
                  setAmount(value);
                }}
                placeholder="Enter withdraw amount"
              />
            </label>

            <label>
              <h1 className="block mt-2 mb-2">Reason:</h1>
              <textarea
                className="textarea textarea-bordered  focus:bg-transparent focus:text-gray-500 h-[2.2rem] min-h-[6.2rem] px-4  w-full font-medium placeholder:text-accent/50 text-gray-500 rounded-lg"
                placeholder={`Enter Reason (limit: ${characterLimit} characters)`}
                value={reason}
                onChange={e => handleReasonChange(e.target.value)}
              ></textarea>
            </label>

            <p className="font-sans italic font-normal -mt-1">Remaining characters: {characterLimit - reason.length}</p>
            <button className="btn btn-primary rounded-lg w-full mt-2 ml-auto" onClick={() => withdraw()}>
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
