import { useEffect, useState } from "react";
import { TokenBalance } from "../TokenBalance";
import { AdminModal } from "./AdminModal";
import { HackersInfoDisplay } from "./HackersInfoDisplay";
import { WithdrawModal } from "./WithdrawModal";
import { Tooltip } from "react-tooltip";
import { useAccount } from "wagmi";
import { PlusIcon } from "@heroicons/react/24/outline";
import { WalletIcon } from "@heroicons/react/24/outline";
import { KeyIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useErc20 } from "~~/hooks/useErc20";
import { useFetchAdmins } from "~~/hooks/useFetchAdmins";
import { useFetchCreators } from "~~/hooks/useFetchCreators";
import { useIsAdmin } from "~~/hooks/useIsAdmin";
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
  const [adminToRemove, setAdminToRemove] = useState("");
  const [uniqueAdmins, setUniqueAdmins] = useState<string[]>([]);
  const [isSettingCreatorsData, setIsSettingCreatorsData] = useState(true);
  const { address } = useAccount();

  const { isCreator } = useIsCreator();

  const { isAdmin } = useIsAdmin();

  const streamContract = useDeployedContractInfo("YourContract");

  const { data: primaryAdmin } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "primaryAdmin",
  });

  const isPrimaryAdmin = address?.toLowerCase() === primaryAdmin?.toLowerCase();

  const {
    creators,
    isLoadingCreators,
    // errorReadingCreators,
  } = useFetchCreators();

  const { admins, isLoadingAdmins } = useFetchAdmins();

  // Get all creator data.
  const { data: allCreatorsData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allCreatorsData",
    args: [creatorPage ? [address || ""] : creators],
  });

  useSetCreator({
    allCreatorsData,
    creators: creatorPage ? [address || ""] : creators,
    setCreatorsData,
    setIsSettingCreatorsData,
  });

  const { isErc20, isEns, isOp } = useErc20();
  const [modalOpen, setModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminAction, setAdminAction] = useState<
    "addCreator" | "fundContract" | "rescueEth" | "rescueToken" | "addAdmin" | "removeAdmin" | "transferOwnership"
  >("addCreator");

  useEffect(() => {
    const filteredAdmins = admins.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    setUniqueAdmins(filteredAdmins);
  }, [admins]);

  useEffect(() => {
    setAdminModalOpen(false);
  }, [creatorsData, uniqueAdmins]);

  return (
    <div className="flex lg:flex-wrap md:flex-row flex-col border rounded-xl">
      <div className="container md:w-[62%]  py-2">
        <div className="flex flex-col ">
          <div className="py-2 flex justify-between">
            <h1
              className={`font-bold font-typo-round md:text-xl text-lg  px-4 md:text-left text-center tracking-wide ${
                !isAdmin ? "w-full" : ""
              }`}
            >
              {creatorPage ? "Your Stream" : "Hacker Streams"}
            </h1>
            {isAdmin && (
              <div>
                <button
                  data-tooltip-id="add creator"
                  data-tooltip-content="add creator"
                  className="hover:bg-primary p-2 rounded-md active:scale-90 border mx-6"
                  onClick={() => {
                    setAdminAction("addCreator");
                    setAdminModalOpen(true);
                  }}
                >
                  <PlusIcon className="h-[1.1rem]" />
                </button>
                <Tooltip place="bottom" id="add creator" />
              </div>
            )}
          </div>

          <div>
            {isSettingCreatorsData &&
              Array.from({ length: creatorPage ? 1 : 3 }).map((_, index) => (
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
            {!isLoadingCreators &&
              !isSettingCreatorsData &&
              creators.length === 0 &&
              Object.keys(creatorsData).length === 0 && <div className="text-center py-6">No Hacker Streams</div>}
            {!isLoadingCreators &&
              Object.entries(creatorsData).map(([creatorAddress, creatorData]) => (
                <HackersInfoDisplay key={creatorAddress} creatorData={creatorData} creatorAddress={creatorAddress} />
              ))}
          </div>
          {!isLoadingCreators && creatorPage && (
            <div className=" px-4 mt-4">
              <button
                onClick={() => {
                  setModalOpen(true);
                }}
                className="btn rounded-md btn-primary py-3 px-6 w-full "
              >
                Withdraw
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="md:w-[38%] py-2 md:border-l pb-2">
        <div className="py-2 border-b px-4">
          <h1
            className={`font-bold font-typo-round md:text-xl text-lg  upercase  tracking-wide ${
              !isAdmin ? "text-center md:text-left" : ""
            }`}
          >
            Contract Data
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
                <TokenBalance className="text-2xl" address={streamContract.data?.address} isEns={isEns} isOp={isOp} />
              ) : (
                <Balance className="text-2xl" address={streamContract.data?.address} />
              )}
              {isAdmin && (
                <div>
                  <button
                    data-tooltip-content="fund/sweep"
                    data-tooltip-id="fund/sweep"
                    className="hover:bg-base-300 p-2 rounded-md active:scale-90 \ "
                    onClick={() => {
                      setAdminAction("fundContract");
                      setAdminModalOpen(true);
                    }}
                  >
                    <WalletIcon className="h-[1.1rem]" />
                  </button>
                  <Tooltip place="bottom" id="fund/sweep" />
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Address address={streamContract.data?.address} />
            </div>
          </div>
          <div className="flex gap-2 bg-base-300 mt-2 rounded-md w-full px-4 py-2 font-bold justify-center">
            <span className="font-bold font-sans">Owner: </span> <Address address={primaryAdmin} />
            {isPrimaryAdmin && (
              <div>
                <button
                  data-tooltip-id="transfer-ownership"
                  data-tooltip-content="transfer ownership"
                  className="hover:bg-primary p-2 rounded-md active:scale-90"
                  onClick={() => {
                    setAdminAction("transferOwnership");
                    setAdminModalOpen(true);
                  }}
                >
                  <KeyIcon className="h-[1.1rem]" />
                </button>
                <Tooltip place="bottom" id="transfer-ownership" />
              </div>
            )}
          </div>
        </div>
        {isAdmin && (
          <div>
            <div className="py-2 mt-6  px-4 flex justify-between ">
              <h1 className=" font-bold font-typo-round md:text-xl text-lg  upercase md:text-left text-center tracking-wide">
                Admins
              </h1>
              <div>
                <button
                  data-tooltip-id="add admin"
                  data-tooltip-content="add admin"
                  className="hover:bg-primary p-2 rounded-md active:scale-90 border "
                  onClick={() => {
                    setAdminAction("addAdmin");
                    setAdminModalOpen(true);
                  }}
                >
                  <PlusIcon className="h-[1.1rem]" />
                </button>
                <Tooltip place="bottom" id="add admin" />
              </div>
            </div>
            <div className="px-4">
              <div>
                {uniqueAdmins.map((admin, index) => (
                  <div key={index} className="py-2 flex justify-between">
                    <Address address={admin} />
                    <button
                      data-tooltip-id="remove"
                      data-tooltip-content="remove"
                      className="hover:bg-primary p-1 rounded-md active:scale-90"
                      onClick={() => {
                        setAdminAction("removeAdmin");
                        setAdminToRemove(admin);
                        setAdminModalOpen(true);
                      }}
                    >
                      <TrashIcon className="h-[1.3rem]" />
                    </button>
                    <Tooltip place="bottom" id="remove" />
                  </div>
                ))}
                {isLoadingAdmins &&
                  Array.from({ length: creatorPage ? 1 : 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex justify-between py-4">
                      <div className="rounded-md bg-slate-300 h-6 w-[10%]"></div>
                      <div className="flex items-center space-y-6 w-[70%]">
                        <div className="h-2 w-full bg-slate-300 rounded"></div>
                      </div>
                      <div className="rounded-md bg-slate-300 h-6 w-[10%]"></div>
                    </div>
                  ))}
                {!isLoadingAdmins && (admins.length === 0 || !admins) && (
                  <div className="text-center py-6">No Admins</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {modalOpen && <WithdrawModal isOpen={modalOpen} setIsOpen={setModalOpen} />}
      {adminModalOpen && (
        <AdminModal
          isOpen={adminModalOpen}
          setIsOpen={setAdminModalOpen}
          action={adminAction}
          setAction={setAdminAction}
          adminToRemove={adminToRemove}
        />
      )}
    </div>
  );
};

export default StreamData;
