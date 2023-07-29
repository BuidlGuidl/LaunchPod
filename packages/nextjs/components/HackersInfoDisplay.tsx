import { Price } from "./Price";
import { CreatorInfo } from "./homepage/StreamData";
import { Address } from "./scaffold-eth";
import { useCreatorUnlockedAmount } from "~~/hooks/useCreatorUnlockedAmount";
import { getTimeAgo } from "~~/utils/getTimeAgo";

// Component for displaying individual creator information
export const HackersInfoDisplay: React.FC<{ creatorData: CreatorInfo; creatorAddress: string }> = ({
  creatorData,
  creatorAddress,
}) => {
  const { unlockedAmount } = useCreatorUnlockedAmount(creatorAddress);
  const cap = Number(creatorData.cap);
  const last = Number(creatorData.last);
  const percentage = cap > 0 ? (Number(unlockedAmount) / cap) * 100 : 0;

  return (
    <div className="flex flex-col md:flex-row place-items-center border-t px-6 py-2 w-full">
      <div className="w-fit md:w-[50%]  md:ml-0 py-2">
        <Address address={creatorAddress} />
      </div>
      <div className="flex flex-col gap-1 w-full md:w-[50%] text-sm ">
        <div className="flex flex-row justify-center">
          <div className="flex md:text-sm text-[0.7rem] font-semibold">
            Ξ
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
          <div className="md:text-sm text-[0.7rem] font-semibold flex flex-row items-center">
            <div className=" tracking-tighter px-3">Last:</div>
            <div className=" tracking-tighter ">{getTimeAgo(last * 1000)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
