import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { TokenBalance } from "../TokenBalance";
import { Address, Balance } from "../scaffold-eth";
import { useState } from "react";
import { useErc20 } from "~~/hooks/useErc20";
import { WithdrawModal } from "../homepage/WithdrawModal";
import FundContract from "./podAdmin/FundContract";
import Rescue from "./podAdmin/Rescue";
import { ContractProps } from "~~/types/podTypes";



  


const PodContract = ({ home, isAdmin, isCreator }: ContractProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const streamContract = useDeployedContractInfo("YourContract");
  
  const { data: primaryAdmin } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "primaryAdmin",
  });


  const { isErc20, isEns, isOp } = useErc20();

  

  return (
    <>
      <div className="w-auto lg:w-[400px] pb-2">
        <div className="px-4">
          <h1 className="font-bold font-typo-round lg:text-3xl text-2xl upercase md:text-left text-center tracking-wide">
            Contract Balance
          </h1>
        </div>
        <div className="px-4">
          <div className="  py-3 rounded-md px-2 bg-base-300 w-full ">
            <div className="flex justify-center">
              <Address address={streamContract.data?.address} />
            </div>
            <div className="w-full rounded-md py-5 px-2 mb-3 flex justify-center">
              {isErc20 ? (
                <TokenBalance className="text-5xl" address={streamContract.data?.address} isEns={isEns} isOp={isOp} />
                ) : (
                  <Balance className="text-5xl" address={streamContract.data?.address} />
              )}
            </div>
          </div>
          {!home && (
            
            <div className="py-3 px-6 flex flex-row justify-between w-full">
              {isCreator && 
                <div className="mb-2 flex justify-center w-full items-center">
                  <button onClick={() => setModalOpen(true)} className="flex">
                    Withdraw
                  </button>
                </div>
              }
              {isAdmin && 
                <div className="w-full flex flex-row justify-between">
                  <div>
                    <FundContract />                
                  </div>
                  <div>
                    <Rescue />
                  </div>
                </div>
              }
            </div>
          )
          }
          <div className="flex gap-2 bg-base-300 mt-2 flex-col items-center rounded-md w-full px-4 py-2 font-bold justify-center">
            <span className="font-semibold  text-center font-sans">
              Owner
            </span>
            <Address address={primaryAdmin} />
          </div>
        </div>
      </div>
      {modalOpen && <WithdrawModal isOpen={modalOpen} setIsOpen={setModalOpen} />}
    </>
  )
}

export default PodContract;