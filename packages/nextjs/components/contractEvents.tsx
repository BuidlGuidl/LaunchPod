import { useEffect, useState } from "react";
import { Price } from "./Price";
import { Address } from "./scaffold-eth";
import { formatEther } from "ethers/lib/utils.js";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const ContractEvents = () => {
  const [fundsReceivedEvents, setFundsReceivedEvents] = useState<any[] | undefined>([]);
  const [withdrawnEvents, setWithdrawnEvents] = useState<any[] | undefined>([]);
  const [creatorAddedEvents, setCreatorAddedEvents] = useState<any[] | undefined>([]);
  const [creatorUpdatedEvents, setCreatorUpdatedEvents] = useState<any[] | undefined>([]);
  const [creatorRemovedEvents, setCreatorRemovedEvents] = useState<any[] | undefined>([]);
  const [agreementDrainedEvents, setAgreementDrainedEvents] = useState<any[] | undefined>([]);

  const fundsReceived = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "FundsReceived",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const withdrawn = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdrawn",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const creatorAdded = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorAdded",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const creatorUpdated = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorUpdated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const creatorRemoved = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "CreatorRemoved",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const agreementDrained = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AgreementDrained",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  useEffect(() => {
    setFundsReceivedEvents(fundsReceived.data);
  }, [fundsReceived]);

  useEffect(() => {
    setWithdrawnEvents(withdrawn.data);
  }, [withdrawn]);

  useEffect(() => {
    setCreatorAddedEvents(creatorAdded.data);
  }, [creatorAdded]);

  useEffect(() => {
    setCreatorUpdatedEvents(creatorUpdated.data);
  }, [creatorUpdated]);

  useEffect(() => {
    setCreatorRemovedEvents(creatorRemoved.data);
  }, [creatorRemoved]);

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
      {withdrawnEvents && withdrawnEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Withdraw Event</h3>
          {withdrawnEvents.map((event, index) => (
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
      {creatorAddedEvents && creatorAddedEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Creator Added</h3>
          {creatorAddedEvents.map((event, index) => (
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
      {creatorUpdatedEvents && creatorUpdatedEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Creator Updated</h3>
          {creatorUpdatedEvents.map((event, index) => (
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
      {creatorRemovedEvents && creatorRemovedEvents?.length > 0 && (
        <div className="p-4 w-full space-x-4 space-y-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-bold">Creator Removed</h3>
          {creatorRemovedEvents.map((event, index) => (
            <div key={index}>
              <div className="flex flex-row items-center">
                <Address address={event.args[0]} />
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
                <Address address={event.args[0]} />
                <div className="pl-4">
                  Ξ <Price value={Number(formatEther(event.args[1]))} />
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
