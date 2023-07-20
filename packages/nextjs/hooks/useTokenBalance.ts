import { useCallback, useEffect, useState } from "react";
import { useErc20 } from "./useErc20";
import { useTokenPrice } from "./useTokenPrice";
import { readContract } from "@wagmi/core";
import { formatEther } from "ethers/lib/utils.js";
import { erc20ABI } from "wagmi";

type TTokenBalanceHookProps = {
  address?: string;
  isEns?: boolean;
  isOp?: boolean;
};

export const useTokenBalance = ({ address, isEns, isOp }: TTokenBalanceHookProps) => {
  const [isTokenBalance, setIsTokenBalance] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const { ensPrice, opPrice } = useTokenPrice();
  const price = isEns ? ensPrice : isOp ? opPrice : 0;

  const { tokenAddress } = useErc20();

  useEffect(() => {
    (async () => {
      if (tokenAddress && tokenAddress != "0x0000000000000000000000000000000000000000" && address) {
        const data = await readContract({
          address: tokenAddress,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(parseFloat(formatEther(data)));
      }
    })();
  }, [tokenAddress, address]);

  const onToggleBalance = useCallback(() => {
    if (price > 0) {
      setIsTokenBalance(!isTokenBalance);
    }
  }, [isTokenBalance, price]);

  return { balance, price, onToggleBalance, isTokenBalance };
};
