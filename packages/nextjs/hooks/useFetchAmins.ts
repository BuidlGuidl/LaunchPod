import { useEffect, useState } from "react";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export const useFetchAdmins = () => {
  const [admins, setAdmins] = useState<string[]>([]);

  const { data: adminAdded } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AdminAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const { data: adminRemoved } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AdminRemoved",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    console.log("Admins before update:", admins);
    if (Array.isArray(adminAdded) && Array.isArray(adminRemoved)) {
      const addedAdmins = adminAdded.map((admin) => admin.args[0]);
      const removedAdmins = adminRemoved.map((admin) => admin.args[0]);

      console.log("Added admins:", addedAdmins);
      console.log("Removed admins:", removedAdmins);


      const previousAdmins = [...admins];

      const updatedList = [...admins, ...addedAdmins].filter((admin) => !removedAdmins.includes(admin));

      if (JSON.stringify(updatedList) !== JSON.stringify(previousAdmins)) {
        setAdmins(updatedList);
      }
    }
  }, [adminAdded, adminRemoved]);
    
  console.log("Admins after update:", admins);

  return {
    admins,
  };
};
