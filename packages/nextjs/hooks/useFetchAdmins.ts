import { useEffect, useState } from "react";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

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

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "AdminAdded",
    listener: logs => {
      setAdmins(prevAdmins => [...prevAdmins, logs]);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "AdminRemoved",
    listener: logs => {
      setAdmins(prevAdmins => prevAdmins.filter(admin => !logs.includes(admin)));
    },
  });

  useEffect(() => {
    if (Array.isArray(adminAdded) && Array.isArray(adminRemoved)) {
      const addedAdmins = adminAdded.map((admin) => admin.args[0]);
      const removedAdmins = adminRemoved.map((admin) => admin.args[0]);

      const updatedAdmins = [...admins, ...addedAdmins].filter(
        (admin, index, self) =>
          !removedAdmins.includes(admin) && self.indexOf(admin) === index
      );

      setAdmins(updatedAdmins);
    }
  }, [adminAdded, adminRemoved]);

    
  return {
    admins
  };
};
