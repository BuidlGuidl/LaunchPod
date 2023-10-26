import { useCallback, useEffect, useState } from "react";
import { useScaffoldEventSubscriber } from "./scaffold-eth";
import { useErc20 } from "./useErc20";
import { useTokenPrice } from "./useTokenPrice";
import { readContract } from "@wagmi/core";
import { formatEther } from "viem";
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
  const [updateBalance, setUpdataBalance] = useState(false);

  const { tokenAddress } = useErc20();

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "ERC20FundsReceived",
    listener: () => {
      setUpdataBalance(true);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "YourContract",
    eventName: "AgreementDrained",
    listener: () => {
      setUpdataBalance(true);
    },
  });

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
      if (updateBalance) setUpdataBalance(false);
    })();
  }, [tokenAddress, address, updateBalance]);

  const onToggleBalance = useCallback(() => {
    if (price > 0) {
      setIsTokenBalance(!isTokenBalance);
    }
  }, [isTokenBalance, price]);

  return { balance, price, onToggleBalance, isTokenBalance };
};
