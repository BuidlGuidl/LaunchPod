import Image from "next/image";
import { useErc20 } from "~~/hooks/useErc20";
import { useTokenBalance } from "~~/hooks/useTokenBalance";

type TTokenBalanceProps = {
  address?: string;
  className?: string;
  isEns?: boolean;
  isOp?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const TokenBalance = ({ address, className = "", isEns, isOp }: TTokenBalanceProps) => {
  const { balance, price, isTokenBalance } = useTokenBalance({ address, isEns, isOp });
  const { tokenSymbol } = useErc20();

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

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      // onClick={onToggleBalance}
    >
      <div className="w-full flex items-center ">
        {isTokenBalance ? (
          <>
            <span> {balance?.toFixed(2)}</span>
            {isEns && <Image className=" ml-1" src="/assets/ensLogo.png" alt="ens logo" width={25} height={25} />}
            {isOp && <Image className=" ml-1" src="/assets/opLogo.png" alt="op logo" width={25} height={25} />}
            {/* {isEns && <span className="text-base ml-1">ENS</span>}
            {isOp && <span className=" ml-1">OP</span>} */}
            {!isEns && !isOp && <div className="text-base  ml-1">{tokenSymbol}</div>}
          </>
        ) : (
          <>
            <span className="text-xs font-bold mr-1">$</span>
            <span>{(balance * price).toFixed(2)}</span>
          </>
        )}
      </div>
    </button>
  );
};
