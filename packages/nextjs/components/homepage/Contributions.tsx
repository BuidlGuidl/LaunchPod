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

  return (
    <div>
      {withdrawnEvents && withdrawnEvents?.length > 0 && (
        <div className=" md:text-sm text-[0.6rem] border rounded-xl">
          <h1 className=" font-bold tracking-widest uppercase p-4 text-base">Contributions</h1>
          {withdrawnEvents.map((event, index) => (
            <div key={index} className="flex flex-wrap  justify-around  border-t py-4 px-6">
              <div className="flex flex-col w-[30%]">
                <Address address={event.args[0]} />
                <div>
                  Ξ <Price value={Number(formatEther(event.args[1]))} />
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
