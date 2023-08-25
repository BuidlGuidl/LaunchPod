import { useEffect, useState } from "react";
import { Price } from "../../Price";
import { Address } from "../../scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useCreatorUnlockedAmount } from "~~/hooks/useCreatorUnlockedAmount";
import { getTimeAgo } from "~~/utils/getTimeAgo";
import { CreatorInfo } from "~~/types/podTypes";
import UpdateCreator from "./UpdateCreator";
import RemoveCreator from "./RemoveCreator";
import { Spinner } from "~~/components/Spinner";

// Component for displaying individual creator information
export const CreatorsDisplay: React.FC<{ creatorData: CreatorInfo; creatorAddress: string; isAdmin: boolean }> = ({
  creatorData,
  creatorAddress,
  isAdmin
}) => {
  const { unlockedAmount, isLoadingUnlockedAmount } = useCreatorUnlockedAmount(creatorAddress);
  const cap = Number(creatorData.cap);
  const unlocked = unlockedAmount && Number(unlockedAmount);
  const percentage = cap > 0 && typeof unlocked === 'number'
  ? (unlocked / cap) * 100
  : 0;

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
        <div className="md:w-[44%] md:text-md -ml-3 md:ml-auto text-sm py-2">
          <Address address={creatorAddress} />
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[47%] text-sm xs:text-xs">
          <div className="flex flex-row justify-center">
            <div className="flex sm:text-xs lg:text-lg">
              {!isLoadingUnlockedAmount && typeof unlocked !== 'undefined' ? (
                <div className="flex flex-row">
                  <span className="px-1 whitespace-nowrap">
                    {typeof unlocked === 'number' && <Price value={unlocked} />}
                  </span>
                  <span className="px-1 whitespace-nowrap">/</span>
                    <span className="px-1 whitespace-nowrap">
                      <Price value={cap} />
                    </span>
                  </div>
                ) : (
                  <Spinner />
                )}
            </div>
          </div>
          <div className="flex flex-row">
            {!isLoadingUnlockedAmount && typeof unlocked !== 'undefined' && (
              <progress className="progress progress-primary" value={percentage} max="100"></progress>
            )}
        </div>
        
          <div className="flex flex-row justify-center">
            {!isLoadingUnlockedAmount && typeof unlocked !== 'undefined' && (
              <div className="md:text-lg text-md flex flex-row items-center">
                <div className=" tracking-tighter px-3">Last:</div>
                <div className=" tracking-tighter ">
                  {withdrawnEvents && withdrawnEvents.length > 0
                    ? getTimeAgo(withdrawnEvents[0]?.block.timestamp * 1000)
                    : "First Stream"}
                </div>
              </div>
            )}
          </div>
          
        </div>
        
      {isAdmin && 
        <div className="flex flex-row pl-2 items-center gap-3 mt-2">
          <>
            <UpdateCreator address={creatorAddress} />
          </>
          <>
            <RemoveCreator address={creatorAddress} />
          </>
        </div>
      }
      </div>
  );
};
