import { useState } from "react";
import { HackersInfoDisplay } from "../HackersInfoDisplay";
import { TokenBalance } from "../TokenBalance";
import { WithdrawModal } from "./WithdrawModal";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useErc20 } from "~~/hooks/useErc20";
import { useFetchCreators } from "~~/hooks/useFetchCreators";
import { useIsCreator } from "~~/hooks/useIsCreator";
import { useSetCreator } from "~~/hooks/useSetCreator";

export type CreatorInfo = {
  cap: string;
  last: string;
};
export type CreatorData = {
  [address: string]: CreatorInfo;
};

const StreamData = ({ creatorPage }: { creatorPage: boolean }) => {
  const [creatorsData, setCreatorsData] = useState<CreatorData>({});
  const { address } = useAccount();

  const { isCreator } = useIsCreator();

  const streamContract = useDeployedContractInfo("YourContract");

  const {
    creators,
    isLoadingCreators,
    // errorReadingCreators,
  } = useFetchCreators();

  // Get all creator data.
  const { data: allCreatorsData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allCreatorsData",
    args: [creatorPage ? [address || ""] : creators],
  });

  useSetCreator({ allCreatorsData, creators: creatorPage ? [address || ""] : creators, setCreatorsData });

  const { isErc20, isEns, isOp } = useErc20();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex lg:flex-wrap md:flex-row flex-col border rounded-xl">
      <div className="container  lg:w-2/3  pt-4">
        <div className="flex flex-col ">
          <div className="py-2 ">
            <h1 className=" font-bold font-typo-round md:text-xl text-lg  px-4 md:text-left text-center tracking-wide">
              {creatorPage ? "Your Stream" : "Hacker Streams"}
            </h1>
          </div>
          <div>
            {isLoadingCreators &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse flex justify-between px-6 py-4">
                  <div className="rounded-md bg-slate-300 h-6 w-[5%]"></div>
                  <div className="flex items-center space-y-6 w-[27%]">
                    <div className="h-2 w-full bg-slate-300 rounded"></div>
                  </div>
                  <div className="flex items-center space-y-6 w-[55%]">
                    <div className="h-2 w-full bg-slate-300 rounded"></div>
                  </div>
                </div>
              ))}
            {!isLoadingCreators && Object.keys(creators).length === 0 && (
              <div className="text-center py-6">No Hacker Streams</div>
            )}
            {!isLoadingCreators &&
              Object.entries(creatorsData).map(([creatorAddress, creatorData]) => (
                <HackersInfoDisplay key={creatorAddress} creatorData={creatorData} creatorAddress={creatorAddress} />
              ))}
          </div>
          {!isLoadingCreators && creatorPage && (
            <div className=" px-4 mt-4">
              <button onClick={() => setModalOpen(true)} className="btn rounded-md btn-primary py-3 px-6 w-full ">
                Withdraw
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="lg:w-1/3 pt-4 md:border-l pb-2">
        <div className="py-2 border-b px-4">
          <h1 className=" font-bold font-typo-round md:text-xl text-lg  upercase md:text-left text-center tracking-wide">
            Contract Balance
          </h1>
        </div>
        <div className="px-4 pt-4">
          {isCreator && !creatorPage && (
            <div className="mb-2">
              <button onClick={() => setModalOpen(true)} className="btn rounded-md btn-primary py-3  px-6 w-full">
                Withdraw
              </button>
            </div>
          )}
          <div className="  py-3 rounded-md px-2 bg-base-300 w-full ">
            <div className="w-full bg-primary rounded-md py-2 px-2 mb-3 flex justify-center">
              {isErc20 ? (
                <TokenBalance className="text-3xl" address={streamContract.data?.address} isEns={isEns} isOp={isOp} />
              ) : (
                <Balance className="text-3xl" address={streamContract.data?.address} />
              )}
            </div>
            <div className="flex justify-center">
              <Address address={streamContract.data?.address} />
            </div>
          </div>
          <div className="flex gap-2 bg-base-300 mt-2 rounded-md w-full px-4 py-2 font-bold justify-center">
            <span className="font-bold font-sans">Owner: </span> <Address address={streamContract.data?.address} />
          </div>
        </div>
      </div>
      {modalOpen && <WithdrawModal isOpen={modalOpen} setIsOpen={setModalOpen} />}
    </div>
  );
};

export default StreamData;
