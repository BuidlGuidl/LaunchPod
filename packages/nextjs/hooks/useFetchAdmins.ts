import { useEffect, useState } from "react";
import { useScaffoldEventHistory } from "./scaffold-eth";

export const useFetchAdmins = () => {
  const [admins, setAdmins] = useState<string[]>([]);

  // Read the adminAdded events to get added admins.
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

  useEffect(() => {
    if (adminAdded) {
      const addedAdmins = adminAdded.map(admin => admin.args[0]);
      setAdmins(prev => [...prev, ...addedAdmins]);
    }
  }, [adminAdded]);

  const {
    data: adminRemoved,
    isLoading: isLoadingRemovedAdmins,
    error: errorReadingRemovedAdmins,
  } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AdminRemoved",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    if (adminRemoved && adminRemoved.length !== 0) {
      console.log(adminRemoved);
      const removedAdmins = adminRemoved.map(admin => admin.args[0]);
      setAdmins(prev => prev.filter(admin => !removedAdmins.includes(admin)));
    }
  }, [adminRemoved, admins]);

  return {
    admins,
    isLoadingAdmins: isLoadingAdmins || isLoadingRemovedAdmins,
    errorReadingCreators: errorReadingAdmins || errorReadingRemovedAdmins,
  };
};
