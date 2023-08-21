import { useEffect, useState } from "react";
import { Price } from "../../Price";
import { Address } from "../../scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useCreatorUnlockedAmount } from "~~/hooks/useCreatorUnlockedAmount";
import { getTimeAgo } from "~~/utils/getTimeAgo";
import { CreatorInfo } from "~~/types/podTypes";
import UpdateCreator from "./UpdateCreator";
import RemoveCreator from "./RemoveCreator";

// Component for displaying individual creator information
export const CreatorsDisplay: React.FC<{ creatorData: CreatorInfo; creatorAddress: string }> = ({
  creatorData,
  creatorAddress,
}) => {
  const { unlockedAmount } = useCreatorUnlockedAmount(creatorAddress);
  const cap = Number(creatorData.cap);
  const percentage = cap > 0 ? (Number(unlockedAmount) / cap) * 100 : 0;

  const [withdrawnEvents, setWithdrawnEvents] = useState<any[] | undefined>([]);

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    const events = withdrawn.data?.filter(obj => obj.args[0] === creatorAddress);
    setWithdrawnEvents(events);
  }, [withdrawn.isLoading, creatorAddress, withdrawn.data]);

  // console.log(withdrawnEvents);
  return (
      <div className="flex flex-row place-items-center px-6 lg:py-2 py-4 w-full">
        <div className="md:w-[44%] text-md md:ml-0 py-2">
          <Address address={creatorAddress} />
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[47%] text-sm ">
          <div className="flex flex-row justify-center">
            <div className="flex text-md lg:text-lg">
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
            <progress className="progress progress-primary" value={percentage} max="100"></progress>
          </div>
          <div className="flex flex-row justify-center">
            <div className="md:text-lg text-md flex flex-row items-center">
              <div className=" tracking-tighter px-3">Last:</div>
              <div className=" tracking-tighter ">
                {withdrawnEvents && withdrawnEvents.length > 0
                  ? getTimeAgo(withdrawnEvents[0]?.block.timestamp * 1000)
                  : "First Stream"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Update and Remove buttons */}
        <div className="flex flex-row justify-center ml-2 gap-3 mt-2">
          <button className="">
            <UpdateCreator address={creatorAddress} />
          </button>
          <button className="">
            <RemoveCreator address={creatorAddress} />
          </button>
        </div>
      </div>
  );
};
