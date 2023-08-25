import { formatEther } from "ethers/lib/utils.js";
import { CreatorData } from "~~/types/podTypes";

type Props = {
  allCreatorsData: any;
  creators: string[];
  setCreatorsData: any;
};


export function useSetCreator({ allCreatorsData, creators, setCreatorsData }: Props) {
  const newData: CreatorData = {};

  allCreatorsData.forEach((creatorData: any, index: number) => {
    const creatorAddress = creators[index];

    const { last, cap } = creatorData;
    // Convert cap to ether
    const capValue = parseFloat(formatEther(cap));

    // Associate the creator address with the calculated data
    newData[creatorAddress] = {
      cap: capValue.toString(),
      last: last.toString(),
    };
  });

  setCreatorsData(newData);
}
