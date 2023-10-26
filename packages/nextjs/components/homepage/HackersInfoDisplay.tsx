import { useEffect, useState } from "react";
import { Price } from "../Price";
import { Address } from "../scaffold-eth";
import { AdminModal } from "./AdminModal";
import { CreatorInfo } from "./StreamData";
import { Tooltip } from "react-tooltip";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useCreatorUnlockedAmount } from "~~/hooks/useCreatorUnlockedAmount";
import { useIsAdmin } from "~~/hooks/useIsAdmin";
import { getTimeAgo } from "~~/utils/getTimeAgo";

// Component for displaying individual creator information
export const HackersInfoDisplay: React.FC<{ creatorData: CreatorInfo; creatorAddress: string }> = ({
  creatorData,
  creatorAddress,
}) => {
  const { unlockedAmount } = useCreatorUnlockedAmount(creatorAddress);
  const cap = Number(creatorData.cap);
  const percentage = cap > 0 ? (Number(unlockedAmount) / cap) * 100 : 0;

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminAction, setAdminAction] = useState<"removeCreator" | "updateCreator">("updateCreator");
  const [withdrawnEvents, setWithdrawnEvents] = useState<any[] | undefined>([]);
  const { isAdmin } = useIsAdmin();

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),
    blockData: true,
  });

  useEffect(() => {
    const events = withdrawn.data?.filter(obj => obj.args[0] === creatorAddress);
    setWithdrawnEvents(events);
  }, [withdrawn.isLoading, creatorAddress, withdrawn.data]);

  return (
    <div className="flex flex-col justify-between md:flex-row place-items-center border-t px-6 py-2 w-full">
      <div className=" md:ml-0 py-2">
        <Address address={creatorAddress} />
      </div>
      <div className="flex flex-col gap-1 text-sm w-2/3 md:w-[50%]">
        <div className="flex flex-row justify-center">
          <div className="flex md:text-base text-[0.8rem] ">
            <span className="px-1">
              <Price value={Number(unlockedAmount)} />
            </span>
            /
            <span className="px-1">
              <Price value={cap} />
            </span>
          </div>
        </div>
        <div className="flex flex-row">
          <progress className="progress progress-primary z-0" value={percentage} max="100"></progress>
        </div>
        <div className="flex flex-row justify-center">
          <div className="md:text-base text-[0.8rem]  flex flex-row items-center gap-1">
            <div className=" tracking-tighter">Last:</div>
            <div className=" tracking-tighter ">
              {withdrawnEvents && withdrawnEvents.length > 0
                ? getTimeAgo(Number(withdrawnEvents[0]?.block.timestamp) * 1000)
                : "Never"}
            </div>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="flex py-1">
          <button
            data-tooltip-id="edit"
            data-tooltip-content="edit"
            className="hover:bg-primary p-1 rounded-md active:scale-90"
            onClick={() => {
              setAdminAction("updateCreator");
              setAdminModalOpen(true);
            }}
          >
            <PencilSquareIcon className="h-[1.3rem]" />
          </button>
          <Tooltip place="bottom" id="edit" />

          <button
            data-tooltip-id="remove"
            data-tooltip-content="remove"
            className="hover:bg-primary p-1 rounded-md active:scale-90"
            onClick={() => {
              setAdminAction("removeCreator");
              setAdminModalOpen(true);
            }}
          >
            <TrashIcon className="h-[1.3rem]" />
          </button>
          <Tooltip place="bottom" id="remove" />
        </div>
      )}
      {adminModalOpen && (
        <AdminModal
          isOpen={adminModalOpen}
          setIsOpen={setAdminModalOpen}
          creatorAddress={creatorAddress}
          action={adminAction}
        />
      )}
    </div>
  );
};
