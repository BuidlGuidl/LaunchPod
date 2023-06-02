import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { formatEther } from "ethers/lib/utils.js";

export function useCreatorUnlockedAmount(creatorAddress: string) {
  const { data: creatorAmt, isLoading: isLoadingCreatorAmt } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "availableCreatorAmount",
    args: [creatorAddress],
  });

  const unlockedAmount = creatorAmt && formatEther(creatorAmt);

  return { unlockedAmount, isLoadingCreatorAmt };
}
