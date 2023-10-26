import { useEffect, useState } from "react";
import { formatEther } from "ethers/lib/utils.js";
import { CreatorData } from "~~/pages";
import { isEqual } from "~~/utils/isEqual";

type Props = {
  allCreatorsData: any;
  creators: string[];
  setCreatorsData: any;
};

export function useSetCreator({ allCreatorsData, creators, setCreatorsData }: Props) {
  const [creatorData, setCreatorData] = useState<CreatorData>({});
  if (Array.isArray(allCreatorsData) && creators.length > 0) {
    const renewedData: CreatorData = {};
    allCreatorsData.forEach((creatorData: any, index: number) => {
      const creatorAddress = creators[index];

      const { last, cap } = creatorData;
      // Convert cap to ether
      const capValue = parseFloat(formatEther(cap));

      // Associate the creator address with the calculated data
      renewedData[creatorAddress] = {
        cap: capValue.toString(),
        last: last.toString(),
      };
    });
    if (!isEqual(creatorData, renewedData)) {
      setCreatorData(renewedData);
    }
  }

  useEffect(() => {
    setCreatorsData(creatorData);
  }, [setCreatorsData, creatorData]);
}
