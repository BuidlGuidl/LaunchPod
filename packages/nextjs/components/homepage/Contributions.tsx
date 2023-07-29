import { useEffect, useState } from "react";
import { Price } from "../Price";
import { Address } from "../scaffold-eth";
import { formatEther } from "ethers/lib/utils.js";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Contributions = () => {
  const [withdrawnEvents, setWithdrawnEvents] = useState<any[] | undefined>([]);

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    setWithdrawnEvents(withdrawn.data);
  }, [withdrawn]);

  console.log(withdrawnEvents);

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
        <div className=" md:text-sm text-[0.7rem] border rounded-xl">
          <h1 className="font-bold font-typo-round md:text-xl text-lg  p-4 tracking-wide">Contributions</h1>
          {withdrawnEvents.map((event, index) => (
            <div key={index} className="flex flex-wrap items-center justify-around  border-t py-4 px-6">
              <div className="flex flex-col w-[30%]">
                <Address address={event.args[0]} />
                <div className="flex gap-2 mt-1">
                  <div>{getDate(event.block.timestamp)}</div>
                  <span>&#x2022;</span>
                  <div className="font-bold font-sans">
                    Ξ <Price value={Number(formatEther(event.args[1]))} />
                  </div>
                </div>
              </div>
              <div className="pl-4 w-[70%] ">{event.args[2]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contributions;
