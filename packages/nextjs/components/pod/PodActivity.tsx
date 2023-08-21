import { useEffect, useState } from "react";
import { CreatorsDisplay } from "./podCreator/CreatorsDisplay";
import { TokenBalance } from "../TokenBalance";
import { WithdrawModal } from "../homepage/WithdrawModal";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useErc20 } from "~~/hooks/useErc20";
import { useFetchCreators } from "~~/hooks/useFetchCreators";
import { useCreator } from "~~/hooks/useCreator";
import { useSetCreator } from "~~/hooks/useSetCreator";
import { useIsAdmin } from "~~/hooks/useIsAdmin";
import { Spinner } from "../Spinner";
import { CreatorData } from "~~/types/podTypes";
import { useAccount } from "wagmi";
import AddCreator from "./podCreator/AddCreator";
import PodContract from "./PodContract";
import AdminsDisplay from "./podAdmin/AdminsDisplay";
import { useFetchAdmins } from "~~/hooks/useFetchAmins";
import AddAdmin from "./podAdmin/AddAdmin";


const PodActivity = () => {
  // const { address, isConnected } = useAccount();
  
  const {
    creators
  } = useFetchCreators();

  
  const { admins } = useFetchAdmins();

  const [creatorsData, setCreatorsData] = useState<CreatorData>({});
  const [connectedCreator, setConnectedCreator] = useState<Boolean>();
  // const { address } = useAccount();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { isAdmin } = useIsAdmin();
  
  const streamContract = useDeployedContractInfo("YourContract");
  
  const { data: primaryAdmin } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "primaryAdmin",
  });

  // if (isConnected) {
  //   const { isCreator } = useCreator(address);
  //   isCreator && setConnectedCreator(true);
  // }
  // console.log("Its checking connected address", connectedCreator);



  // Get all creator data.
  const { data: allCreatorsData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allCreatorsData",
    args: [creators],
  });

  
  // Use effect to handle setting the creators data. 
  useEffect(() => {
    if (Array.isArray(allCreatorsData) && creators.length > 0) {
      useSetCreator({allCreatorsData, creators, setCreatorsData});
    }
  }, [allCreatorsData, creators.length > 0]);


  // const { isErc20, isEns, isOp } = useErc20();

  return (
    <div className="flex lg:flex-row w-full flex-col-reverse">

      <div className="flex flex-col w-full lg:justify-start lg:mx-2 lg:w-[50%]">
        <div className="py-2">
          <h1 className="font-bold font-typo-round lg:text-3xl text-2xl px-4 text-center tracking-wide">
            {"Hacker Streams"}
          </h1>
        </div>

        <div>

          {
            Object.keys(creators).length === 0 && (
              <div className="text-center py-6">No Hacker Streams</div>
          )}
          {
            Object.entries(creatorsData).map(([creatorAddress, creatorData]) => (
              <CreatorsDisplay key={creatorAddress} creatorData={creatorData} creatorAddress={creatorAddress} />
            ))}
        </div>

        <div className="flex flex-row pr-4 justify-end">
          <AddCreator />
        </div>
      </div>

      <div className="lg:mx-auto">
        <PodContract />
      <div className="lg:mx-auto">
        {/* Loop through the admins */}
        {admins.map((adminAddress) => (
          <AdminsDisplay key={adminAddress} adminAddress={adminAddress} />
        ))}
        <div className="w-full flex flex-row justify-end">
          <AddAdmin />
        </div>
      </div>

      </div>


      
    </div>
  );
};

export default PodActivity;

{/* {(
  <div className=" px-4 mt-4">
    <button onClick={() => setModalOpen(true)} className="btn rounded-md btn-primary py-3 px-6 w-full ">
      Withdraw
    </button>
  </div>
)} */}