import { useFetchCreators } from "./useFetchCreators";
import { useAccount } from "wagmi";

export function useIsCreator() {
  const { address, isConnected } = useAccount();
  const { creators, isLoadingCreators } = useFetchCreators();

  if (!isConnected || isLoadingCreators) {
    return {
      isCreator: false,
      isLoading: true,
    };
  }

  return {
    isCreator: !address || !creators || creators.find(creator => address === creator) !== undefined,
    isLoading: false,
  };
}
