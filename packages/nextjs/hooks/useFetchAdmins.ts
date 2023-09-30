import { useEffect, useState } from "react";
import { useDeployedContractInfo, useScaffoldEventHistory, useScaffoldEventSubscriber } from "./scaffold-eth";
import { readContract } from "@wagmi/core";

export const useFetchAdmins = () => {
  const [admins, setAdmins] = useState<string[]>([]);

  const [isValidatingAdmins, setIsValidatingAdmins] = useState(false);

  const { data: streamContract } = useDeployedContractInfo("YourContract");

  const {
    data: adminAdded,
    isLoading: isLoadingAdmins,
    error: errorReadingAdmins,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AdminAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const addedAdmins = adminAdded?.map(admin => admin.args[0]);

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "AdminAdded",
    listener: admin => {
      // const currentCreators = creators;
      // currentCreators.push(creator);
      // setCreators(currentCreators);
      setAdmins(prev => [...prev, admin]);
    },
  });

  useEffect(() => {
    if (adminAdded) {
      const addedAdmins = adminAdded.map(admin => admin.args[0]);
      setAdmins(prev => [...prev, ...addedAdmins]);
    }
  }, [adminAdded]);

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "AdminRemoved",
    listener: admin => {
      setAdmins(prev => prev.filter(existingAdmin => admin != existingAdmin));
    },
  });

  useEffect(() => {
    setIsValidatingAdmins(true);
    const validateAdmin = async (admin: string) => {
      if (streamContract) {
        try {
          const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
          const isAdmin = await readContract({
            address: streamContract.address,
            abi: streamContract.abi,
            functionName: "hasRole",
            args: [ADMIN_ROLE, admin],
          });

          return isAdmin;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    };

    const validateAdmins = async () => {
      if (addedAdmins) {
        for (let i = addedAdmins.length - 1; i >= 0; i--) {
          const isValid = await validateAdmin(addedAdmins[i]);
          if (!isValid) {
            addedAdmins.splice(i, 1);
          }
        }

        setAdmins(addedAdmins);
      }
    };

    validateAdmins();
    setIsValidatingAdmins(false);
  }, [addedAdmins, streamContract]);

  return {
    admins,
    isLoadingAdmins: isLoadingAdmins || isValidatingAdmins,
    errorReadingCreators: errorReadingAdmins,
  };
};
