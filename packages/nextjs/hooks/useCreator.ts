import { useGlobalState } from "~~/services/store/store";
import { useFetchCreators } from "./useFetchCreators";

export function useCreator({ address }: {address: string}) {

  // const { isLoadingCreators } = useFetchCreators();


  // return {
  //   isCreator: address && creators && creators.find((creator: string) => address === creator) !== undefined,
  //   isLoading: isLoadingCreators,
  // };
}
