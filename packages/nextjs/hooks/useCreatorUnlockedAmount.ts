import { formatEther } from "viem";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export function useCreatorUnlockedAmount(creatorAddress: string) {
  const { data: creatorAmt, isLoading: isLoadingCreatorAmt } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "availableCreatorAmount",
    args: [creatorAddress],
  });

  const unlockedAmount = creatorAmt && formatEther(creatorAmt);

  return { unlockedAmount, isLoadingCreatorAmt };
}
