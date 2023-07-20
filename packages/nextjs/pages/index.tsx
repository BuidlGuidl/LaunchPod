// import { useAccount } from "wagmi";
import { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { CreatorInfoDisplay } from "~~/components/CreatorInfoDisplay";
import { TokenBalance } from "~~/components/TokenBalance";
import ContractEvents from "~~/components/contractEvents";
// import { useAccountBalance } from "~~/hooks/scaffold-eth";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useErc20 } from "~~/hooks/useErc20";
import { useFetchCreators } from "~~/hooks/useFetchCreators";
import { useSetCreator } from "~~/hooks/useSetCreator";

export type CreatorInfo = {
  cap: string;
  last: string;
};
export type CreatorData = {
  [address: string]: CreatorInfo;
};

const Home: NextPage = () => {
  // All creator data.
  const [creatorsData, setCreatorsData] = useState<CreatorData>({});

  const streamContract = useDeployedContractInfo("YourContract");

  const {
    creators,
    // isLoadingCreators,
    // errorReadingCreators,
  } = useFetchCreators();

  // Get all creator data.
  const { data: allCreatorsData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allCreatorsData",
    args: [creators],
  });

  useSetCreator({ allCreatorsData, creators, setCreatorsData });

  const { isErc20, isEns, isOp } = useErc20();

  return (
    <>
      <Head>
        <title>LaunchPod&#8482;</title>
        <meta name="description" content="LaunchPod&#8482;: Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="flex flex-col">
        <div className="lg:max-w-[60%] sm:max-w-[60%] m-auto w-[80%] mb-1 text-center">
          <p className="w-full pt-20 text-4xl font-black">
            LaunchPod&#8482;: infinite possibilities, unlimited potential
          </p>
          <p className="text-xl">Get inducted. Build Awesome Things. Showcase it.</p>
          <p className="text-xl -mt-4">Claim your UBI. Pay it forward.</p>
          <p className="text-xl">Peace ✌️</p>
          <p className="text-sm">A reality, brought to you by 🏰 BuidlGuidl!</p>
        </div>
        <div className="mt-10">
          <div className="w-full items-center space-y-2 flex flex-col justify-center">
            <Address address={streamContract.data?.address} />
            <div className="rounded-full bg-primary py-2 px-6 flex flex-col">
              <p className="text-center text-md font-extrabold -mt-1">slushfund</p>
              {isErc20 ? (
                <TokenBalance className="text-3xl" address={streamContract.data?.address} isEns={isEns} isOp={isOp} />
              ) : (
                <Balance className="text-3xl" address={streamContract.data?.address} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-col pt-10">
        <div className="container xs:w-[80%] mx-auto md:w-full">
          <div className="flex flex-col p-5 text-center items-center justify-center">
            <h1 className="text-center font-bold tracking-widest uppercase">Streaming Creators</h1>
            {Object.entries(creatorsData).map(([creatorAddress, creatorData]) => (
              <CreatorInfoDisplay key={creatorAddress} creatorData={creatorData} creatorAddress={creatorAddress} />
            ))}
          </div>
          <div className="w-full pt-40">
            <ContractEvents />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
