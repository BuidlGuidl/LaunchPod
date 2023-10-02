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
      <div className="w-full flex items-center justify-center">
        {isTokenBalance ? (
          <>
            <span>{balance?.toFixed(4)}</span>
            {isEns && <span className="text-xs font-bold ml-1">ENS</span>}
            {isOp && <span className="text-xs font-bold ml-1">OP</span>}
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
