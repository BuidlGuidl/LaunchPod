import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useDeployedContractInfo, useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export const useFetchCreators = () => {
  const [creators, setCreators] = useState<string[]>([]);
  const [isValidatingCreators, setIsValidatingCreators] = useState(true);

  // Read the builderAdded events to get added creators.
  const {
    data: builderAdded,
    isLoading: isLoadingCreators,
    error: errorReadingCreators,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AddBuilder",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),
    blockData: true,
  });

  const addedCreators = builderAdded?.map(creator => creator?.args[0]);

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "AddBuilder",
    listener: logs => {
      logs.map(log => {
        const creator = log.args[0];
        setCreators(prev => [...prev, creator] as string[]);
      });
    },
  });

  // useScaffoldEventSubscriber({
  //   contractName: "YourContract",
  //   eventName: "CreatorRemoved",
  //   listener: logs => {
  //     logs.map(log => {
  //       const creator = log.args[0];
  //       setCreators(prev => prev.filter(existingCreator => creator != existingCreator));
  //     });
  //   },
  // });

  const { data: streamContract } = useDeployedContractInfo("YourContract");

  useEffect(() => {
    const validateCreator = async (creator: string) => {
      let fetchedCreator;
      if (streamContract) {
        try {
          const creatorIndex = await readContract({
            address: streamContract.address,
            abi: streamContract.abi,
            functionName: "creatorIndex",
            args: [creator],
          });

          fetchedCreator = await readContract({
            address: streamContract.address,
            abi: streamContract.abi,
            functionName: "activeCreators",
            args: [creatorIndex],
          });
        } catch (error) {
          return false;
        }
      }
      if (fetchedCreator === creator) {
        return true;
      } else {
        return false;
      }
    };
    const validateCreators = async () => {
      const validCreators: string[] = [];
      if (addedCreators) {
        for (let i = addedCreators.length - 1; i >= 0; i--) {
          const isValid = await validateCreator(addedCreators[i]);
          if (isValid) {
            validCreators.push(addedCreators[i]);
          }
        }
      }
      setCreators(validCreators);
    };

    setIsValidatingCreators(true);
    validateCreators();
    setIsValidatingCreators(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingCreators, streamContract]);

  return {
    creators,
    isLoadingCreators: isLoadingCreators || isValidatingCreators,
    errorReadingCreators: errorReadingCreators,
  };
};
