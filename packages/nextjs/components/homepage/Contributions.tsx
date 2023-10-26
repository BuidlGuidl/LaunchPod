import { useEffect, useState } from "react";
import { Price } from "../Price";
import { Address } from "../scaffold-eth";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

const Contributions = ({ creatorPage }: { creatorPage: boolean }) => {
  const [withdrawnEvents, setWithdrawnEvents] = useState<any[] | undefined>([]);

  const { address } = useAccount();

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),
    blockData: true,
  });

  useEffect(() => {
    const events = creatorPage ? withdrawn.data?.filter(obj => obj.args[0] === address) : withdrawn.data;
    setWithdrawnEvents(events);
  }, [withdrawn.isLoading, address, creatorPage, withdrawn.data]);

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "Withdrawn",
    listener: logs => {
      logs.map(log => {
        const [creator, amount, reason] = log.args;
        const newEvent = { args: [creator, amount, reason], block: { timestamp: Math.floor(Date.now() / 1000) } };
        const currentEvents = withdrawnEvents;
        currentEvents?.push(newEvent);
        setWithdrawnEvents(currentEvents);
      });
    },
  });

  // console.log(withdrawnEvents);

  const getDate = (timestamp: number) => {
    const date = new Date(Number(timestamp) * 1000);
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
          <h1 className="font-bold font-typo-round md:text-xl text-lg  p-4 tracking-wide">
            {creatorPage ? "Your Contributions" : "Contributions"}
          </h1>
          {withdrawnEvents.map((event, index) => (
            <div key={index} className="flex flex-wrap items-center justify-around  border-t py-4 px-6">
              <div className="flex flex-col w-[30%]">
                <Address address={event.args[0]} />
                <div className="flex md:flex-row  flex-col gap-2 mt-1">
                  <div>{getDate(event.block.timestamp)}</div>

                  <div className="font-bold font-sans ">
                    <span className=" hidden md:contents ">&#x2022; </span>
                    <Price value={Number(formatEther(event.args[1]))} />
                  </div>
                </div>
              </div>
              <div className="pl-4 w-[70%] break-words">{event.args[2]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contributions;
