import { useEffect, useState } from "react";
import { Price } from "../../Price";
import { Address } from "../../scaffold-eth";
import { formatEther } from "ethers/lib/utils.js";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Contributions = () => {
  const [withdrawnEvents, setWithdrawnEvents] = useState<any[] | undefined>([]);

  const { address } = useAccount();

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    const events = withdrawn.data;
    setWithdrawnEvents(events);
  }, [withdrawn.isLoading, address, withdrawn.data]);

  const getDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  return (
    <div>
      {withdrawnEvents && withdrawnEvents?.length > 0 && (
        <div className=" md:text-sm text-md">
          <h1 className="font-bold font-typo-round md:text-xl text-lg  p-4 tracking-wide">
            {"Contributions"}
          </h1>
          {withdrawnEvents.map((event, index) => (
            <div key={index} className="flex flex-wrap items-center justify-around py-4 px-6">
              <div className="flex flex-col text-sm w-[30%]">
                <Address address={event.args[0]} />
                <div className="flex md:flex-row  flex-col gap-2 mt-1">
                  <div>{getDate(event.block.timestamp)}</div>

                  <div className="font-bold font-sans ">
                    <span className=" hidden md:contents ">&#x2022; </span>
                    <Price value={Number(formatEther(event.args[1]))} />
                  </div>
                </div>
              </div>
              <div className="pl-4 text-sm lg:text-lg w-[50%] ">{event.args[2]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contributions;
