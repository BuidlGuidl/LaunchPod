import { LockIcon } from "./LockIcon";
import { Price } from "./Price";
import { UnlockIcon } from "./UnlockIcon";
import { Address } from "./scaffold-eth";
import { useCreatorUnlockedAmount } from "~~/hooks/useCreatorUnlockedAmount";
import { CreatorInfo } from "~~/pages";
import { getTimeAgo } from "~~/utils/getTimeAgo";

// Component for displaying individual creator information
export const CreatorInfoDisplay: React.FC<{ creatorData: CreatorInfo; creatorAddress: string }> = ({
  creatorData,
  creatorAddress,
}) => {
  const { unlockedAmount } = useCreatorUnlockedAmount(creatorAddress);
  const cap = Number(creatorData.cap);
  const last = Number(creatorData.last);
  const percentage = cap > 0 ? (Number(unlockedAmount) / cap) * 100 : 0;

  return (
    <div className="flex items-center bg-indigo-100/30 rounded-full px-6 py-2 my-3">
      <div className="flex-auto w-[50%]">
        <Address address={creatorAddress} />
      </div>
      <div className="flex-auto w-[50%]">
        <div className="flex flex-row">
          <div className="flex items-center w-full">
            <div className="pb-2 pr-2">
              <LockIcon />
            </div>
            <div className="flex-grow-2">
              Ξ <Price value={cap} />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="pb-2 pr-2">
              <UnlockIcon />
            </div>
            <div className="flex-grow-1">
              <Price value={Number(unlockedAmount)} />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <progress className="progress progress-primary" value={percentage} max="100"></progress>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="font-semibold tracking-tighter text-sm lg:text-lg px-3">Last:</div>
            <div className="text-sm tracking-tighter lg:text-lg">{getTimeAgo(last * 1000)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
