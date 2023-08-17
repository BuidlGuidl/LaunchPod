import React, { useEffect, useState } from "react";
import { Price } from "./Price";
import { Address } from "./scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useCreatorUnlockedAmount } from "~~/hooks/useCreatorUnlockedAmount";
import { getTimeAgo } from "~~/utils/getTimeAgo";

interface CreatorInfo {
  cap: string;
  last: string;
}

interface HackersInfoDisplayProps {
  creatorData: CreatorInfo;
  creatorAddress: string;
}

export const HackersInfoDisplay: React.FC<HackersInfoDisplayProps> = ({ creatorData, creatorAddress }) => {
  const [timeDifference, setTimeDifference] = useState<string>("");

  const { unlockedAmount } = useCreatorUnlockedAmount(creatorAddress);
  const cap = Number(creatorData.cap);
  const percentage = cap > 0 ? (Number(unlockedAmount) / cap) * 100 : 0;

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    const lastEvent = withdrawn.data
      ?.filter(event => event.args[0] === creatorAddress)
      .sort((a, b) => b.block.timestamp - a.block.timestamp)[0]; // Sorting by timestamp

    if (lastEvent) {
      const timestamp = lastEvent.block.timestamp * 1000;
      setTimeDifference(getTimeAgo(timestamp));
    }
  }, [creatorAddress, withdrawn.data]);

  return (
    <div className="flex flex-col md:flex-row place-items-center border-t px-6 py-2 w-full">
      <div className="w-fit md:w-[50%] md:ml-0 py-2">
        <Address address={creatorAddress} />
      </div>
      <div className="flex flex-col gap-1 w-full md:w-[50%] text-sm">
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
            <div className="tracking-tighter px-3">Last Withdrawn:</div>
            <div className="tracking-tighter">{timeDifference}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
