import { useEffect, useState } from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export const useFetchCreators = () => {
  const [creators, setCreators] = useState<string[]>([]);

  // Read the creatorAdded events to get added creators.
  const {
    data: creatorAdded,
    isLoading: isLoadingCreators,
    error: errorReadingCreators,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    if (creatorAdded) {
      const addedCreators = creatorAdded.map(creator => creator.args[0]);
      setCreators(prev => [...prev, ...addedCreators]);
    }
  }, [creatorAdded]);

  const {
    data: creatorRemoved,
    isLoading: isLoadingRemovedCreators,
    error: errorReadingRemovedCreators,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorRemoved",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    if (creatorRemoved && creatorRemoved.length !== 0) {
      console.log(creatorRemoved);
      const removedCreators = creatorRemoved.map(creator => creator.args[0]);
      setCreators(prev => prev.filter(creator => !removedCreators.includes(creator)));
    }
  }, [creatorRemoved, creators]);

  // Read the creatorUpdated events to get updated creators.
  const {
    data: creatorUpdated,
    isLoading: isLoadingUpdatedCreators,
    error: errorReadingUpdatedCreators,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorUpdated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    if (creatorUpdated && creatorUpdated.length !== 0) {
      creatorUpdated.forEach(creator => {
        const updatedCreator = creator.args[0];
        setCreators(prev => {
          const updatedCreators = [...prev];
          const index = updatedCreators.indexOf(updatedCreator);
          if (index !== -1) {
            updatedCreators[index] = updatedCreator;
          }
          return updatedCreators;
        });
      });
    }
  }, [creatorUpdated, creators]);

  return {
    creators,
    isLoadingCreators: isLoadingCreators || isLoadingRemovedCreators || isLoadingUpdatedCreators,
    errorReadingCreators: errorReadingCreators || errorReadingRemovedCreators || errorReadingUpdatedCreators,
  };
};
