import { useEffect, useState } from "react";
import { Price } from "./Price";
import { Address } from "./scaffold-eth";
import { formatEther } from "viem";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const ContractEvents = () => {
  const [fundsReceivedEvents, setFundsReceivedEvents] = useState<any[] | undefined>([]);
  const [withdrawEvents, setWithdrawEvents] = useState<any[] | undefined>([]);
  const [addBuilderEvents, setAddBuilderEvents] = useState<any[] | undefined>([]);
  const [updateBuilderEvents, setUpdateBuilderEvents] = useState<any[] | undefined>([]);
  const [agreementDrainedEvents, setAgreementDrainedEvents] = useState<any[] | undefined>([]);

  const fundsReceived = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "FundsReceived",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),
    blockData: true,
  });

  const withdraw = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdraw",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),
    blockData: true,
  });

  const addBuilder = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AddBuilder",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),

    blockData: true,
  });

  const updateBuilder = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "UpdateBuilder",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),

    blockData: true,
  });

  const agreementDrained = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AgreementDrained",
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),

    blockData: true,
  });

  useEffect(() => {
    setFundsReceivedEvents(fundsReceived.data);
  }, [fundsReceived]);

  useEffect(() => {
    setWithdrawEvents(withdraw.data);
  }, [withdraw]);

  useEffect(() => {
    setAddBuilderEvents(addBuilder.data);
  }, [addBuilder]);

  useEffect(() => {
    setUpdateBuilderEvents(updateBuilder.data);
  }, [updateBuilder]);

  useEffect(() => {
    setAgreementDrainedEvents(agreementDrained.data);
  }, [agreementDrained]);

  return (
    <div className="space-y-4 flex flex-col justify-center items-center">
      {fundsReceivedEvents && fundsReceivedEvents.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Funds Received</h3>
          {fundsReceivedEvents.map((event, index) => (
            <div key={index}>
              <div className="flex flex-row items-center">
                <div className="pr-4">
                  Ξ <Price value={Number(formatEther(event.args[1]))} />
                </div>
                <p className="pr-4">from</p>
                <Address address={event.args[0]} />
              </div>
            </div>
          ))}
        </div>
      )}
      {withdrawEvents && withdrawEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Withdraw Event</h3>
          {withdrawEvents.map((event, index) => (
            <div key={index}>
              <div className="flex flex-row items-center">
                <Address address={event.args[0]} />
                <div className="pl-4">
                  Ξ <Price value={Number(formatEther(event.args[1]))} />
                </div>
                <div className="pl-4">{event.args[2]}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {addBuilderEvents && addBuilderEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Creator Added</h3>
          {addBuilderEvents.map((event, index) => (
            <div key={index}>
              <div className="flex flex-row items-center">
                <Address address={event.args[0]} />
                <div className="pl-4">
                  Ξ <Price value={Number(formatEther(event.args[1]))} />
                </div>
                <div className="pl-4">30 days</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {updateBuilderEvents && updateBuilderEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Creator Updated</h3>
          {updateBuilderEvents.map((event, index) => (
            <div key={index}>
              <div className="flex flex-row items-center">
                <Address address={event.args[0]} />
                <div className="pl-4">
                  Ξ <Price value={Number(formatEther(event.args[1]))} />
                </div>
                <div className="pl-4">30 days</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {agreementDrainedEvents && agreementDrainedEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Agreement Drained</h3>
          {agreementDrainedEvents.map((event, index) => (
            <div key={index}>
              <div className="flex flex-row items-center">
                <div className="pl-4">
                  Ξ <Price value={Number(formatEther(event.args[1]))} /> by Admin
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractEvents;
