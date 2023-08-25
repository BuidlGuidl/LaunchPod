import { useEffect, useState } from "react";
import { CreatorsDisplay } from "./podCreator/CreatorsDisplay";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useFetchCreators } from "~~/hooks/useFetchCreators";
import { useCreator } from "~~/hooks/useCreator";
import { useSetCreator } from "~~/hooks/useSetCreator";
import { CreatorData } from "~~/types/podTypes";
import { useAccount } from "wagmi";
import AddCreator from "./podCreator/AddCreator";
import PodContract from "./PodContract";
import AdminsDisplay from "./podAdmin/AdminsDisplay";
import { useFetchAdmins } from "~~/hooks/useFetchAdmins";
import AddAdmin from "./podAdmin/AddAdmin";
import Contributions from "./podCreator/Contributions";
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

const PodActivity = () => {
  const { address, isConnected, isDisconnected } = useAccount();
  const [creatorsData, setCreatorsData] = useState<CreatorData>({});
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const { data: isAdminRole, isLoading: isAdminLoading } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "hasRole",
    args: [ADMIN_ROLE, address],
  });

  const {
    creators
  } = useFetchCreators();
  
  const {
    admins
  } = useFetchAdmins();

  // TODO: remove hooks from the useEffect callback.
  useEffect(() => {
  
    if (!isConnected || !address) {
      return;
    }
  
  if (address && isConnected) {

    if (isAdminRole && !isAdminLoading) {
      setIsAdmin(isAdminRole);
    }


    const { isCreator } = useCreator({ address, creators });

    if (isCreator) {
      setIsCreator(isCreator);
    }

  }

  }, [
    isConnected,
    isDisconnected,
    address,
    isAdminRole
  ]);
  
  
  const { data: allCreatorsData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allCreatorsData",
    args: [creators],
  });

  useEffect(() => {
    if (Array.isArray(allCreatorsData) && creators.length > 0) {
      useSetCreator({allCreatorsData, creators, setCreatorsData});
    }
  }, [allCreatorsData, creators.length > 0]);

  useEffect(() => {
    if (isDisconnected || !address) {
      setIsAdmin(false);
      setIsCreator(false);
    }
  },[address, isDisconnected])

  return (
    <div className="flex lg:flex-row w-full flex-col-reverse">

      <div className="flex flex-col w-full lg:justify-start lg:mx-2 lg:w-[50%]">
        <div className="py-2">
          <h1 className="font-bold font-typo-round lg:text-3xl text-2xl px-4 text-center tracking-wide">
            {"Hacker Streams"}
          </h1>
        </div>

        <div className="w-full pb-3">

          {
            Object.keys(creators).length === 0 && (
              <div className="text-center py-6">No Hacker Streams</div>
          )}
          {
            Object.entries(creatorsData).map(([creatorAddress, creatorData]) => (
              <CreatorsDisplay key={creatorAddress} creatorData={creatorData} creatorAddress={creatorAddress} isAdmin={isAdmin} />
            ))}
        </div>
        {isAdmin &&
          <div className="flex flex-row pr-4 justify-end">
            <AddCreator />
          </div>
        }
        <div className="w-full py-3">
          <Contributions />
        </div>
      </div>

      <div className="lg:mx-auto">
        <PodContract isCreator={isCreator} isAdmin={isAdmin} />
        
        <div className="lg:mx-auto">
          {admins.map((adminAddress) => (
            <AdminsDisplay key={adminAddress} adminAddress={adminAddress} isAdmin={isAdmin} />
          ))}
          {isAdmin &&
            <div className="flex flex-row pr-4 justify-end">
              <AddAdmin />
            </div>
          }
        </div>
      </div>      
    </div>
  );
};

export default PodActivity;