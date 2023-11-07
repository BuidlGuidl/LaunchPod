import { useAccount } from "wagmi";
import Contributions from "~~/components/homepage/Contributions";
import StreamData from "~~/components/homepage/StreamData";
import { useIsCreator } from "~~/hooks/useIsCreator";

const Creator: React.FC<undefined> = () => {
  const { isConnected } = useAccount();
  const { isCreator, isLoading: isLoadingCreators } = useIsCreator();

  if (!isConnected) {
    return <div className="text-center m-auto">Connect to continue.</div>;
  }

  if (!isCreator && !isLoadingCreators) {
    return <div className="text-center m-auto">You are not worthy to view this page.</div>;
  }

  return (
    <div className="flex flex-col gap-4 xs:w-4/5 lg:max-w-5xl w-11/12">
      {isLoadingCreators ? (
        <div className="flex flex-col gap-4">
          <div className="flex animate-pulse gap-2">
            <div className="rounded-md bg-slate-300 h-56 w-[40%]"></div>
            <div className="rounded-md bg-slate-300 h-56 w-[60%]"></div>
          </div>
          <div className="flex animate-pulse gap-2">
            <div className="rounded-md bg-slate-300 h-80 w-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <StreamData creatorPage={true} />
          <Contributions creatorPage={true} />
        </div>
      )}
    </div>
  );
};

export default Creator;
