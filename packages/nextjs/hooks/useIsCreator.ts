import { useScaffoldContractRead } from "./scaffold-eth";
import { useAccount } from "wagmi";

export function useIsCreator() {
  const { address, isConnected } = useAccount();

  const { data: creatorIndex } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "creatorIndex",
    args: [address],
  });

  const { data: creator } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "activeCreators",
    args: [creatorIndex],
  });

  console.log(creatorIndex?.toString());

  if (!isConnected) {
    return {
      isCreator: false,
      isLoading: true,
    };
  }

  return {
    isCreator: !address || creator == address,
    isLoading: false,
  };
}
