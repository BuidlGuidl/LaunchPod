import { useEffect, useState } from "react";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export const useFetchCreators = () => {
  const [creators, setCreators] = useState<string[]>([]);

  const { data: creatorAdded } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const { data: creatorRemoved } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorRemoved",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "CreatorAdded",
    listener: (address: string, value) => {
      console.log(address, value);
      setCreators(prevCreators => [...prevCreators, address]);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "CreatorRemoved",
    listener: logs => {
      setCreators(prevCreators => prevCreators.filter(creator => !logs.includes(creator)));
    },
  });


  useEffect(() => {
    if (Array.isArray(creatorAdded) && Array.isArray(creatorRemoved)) {
      const addedCreators = creatorAdded.map((creator) => creator.args[0]);
      const removedCreators = creatorRemoved.map((creator) => creator.args[0]);

      const previousCreators = [...creators];

      const updatedList = [...creators, ...addedCreators].filter((creator) => !removedCreators.includes(creator));

      
      // Check if the updatedList is different from the previousCreators
      if (JSON.stringify(updatedList) !== JSON.stringify(previousCreators)) {
        setCreators(updatedList);
      }
    }
  }, [creatorAdded, creatorRemoved]);

  return {
    creators,
  };
};
