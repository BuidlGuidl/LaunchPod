import { useState } from "react";
import Image from "next/image";
import { useErc20 } from "~~/hooks/useErc20";
import { useTokenBalance } from "~~/hooks/useTokenBalance";
import { useGlobalState } from "~~/services/store/store";

type TTokenBalanceProps = {
  address?: string;
  className?: string;
  isEns?: boolean;
  isOp?: boolean;
  isGt?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const TokenBalance: React.FC<TTokenBalanceProps> = ({ address, className = "", isEns, isOp, isGt }) => {
  //eslint-disable-next-line
  const { balance, isTokenBalance } = useTokenBalance({ address, isEns, isOp, isGt });
  //eslint-disable-next-line
  const { tokenSymbol } = useErc20();
  const nativePrice = useGlobalState(state => state.nativeCurrencyPrice);
  const [dollarMode, setDollarMode] = useState(false);

  console.log("balance:", balance);
  console.log("nativePrice:", nativePrice);
  console.log("dollarMode:", dollarMode);

  if (!address || balance === null) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  const displayBalance = dollarMode ? `$ ${(balance * nativePrice).toFixed(2)}` : `${balance?.toFixed(2)}`;

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal text-sm items-center hover:bg-transparent ${className}`}
      onClick={() => {
        console.log("Toggling balance display");
        setDollarMode(prevMode => !prevMode);
      }}
    >
      <div className="w-full flex items-center">
        <span className="font-bold text-lg flex items-center">
          {!dollarMode && (
            <Image
              src="/the-graph-svg.png"
              alt="GRT Token"
              width={30}
              height={30}
              className="ml-1"
              style={{ marginLeft: "20px" }}
            />
          )}
          {displayBalance}{" "}
        </span>
        {isEns && <Image className="ml-1" src="/assets/ensLogo.png" alt="ens logo" width={25} height={25} />}
        {isOp && <Image className="ml-1" src="/assets/opLogo.png" alt="op logo" width={25} height={25} />}
      </div>
    </button>
  );
};
