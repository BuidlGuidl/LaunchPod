import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import { erc20ABI } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export function useErc20() {
  const { isConnected } = useAccount();

  const [tokenName, setTokenName] = useState("");

  const { data: isErc20, isLoading: isErc20Loading } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "isERC20",
  });

  const { data: tokenAddress, isLoading: tokenAddressLoadng } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "tokenAddress",
  });

  useEffect(() => {
    (async () => {
      if (tokenAddress && tokenAddress != "0x0000000000000000000000000000000000000000") {
        const data = await readContract({
          address: tokenAddress,
          abi: erc20ABI,
          functionName: "name",
        });
        setTokenName(data);
      }
    })();
  }, [tokenAddress]);

  if (!isConnected || isErc20Loading || tokenAddressLoadng) {
    return {
      isErc20: false,
      isLoading: true,
    };
  }

  return {
    isErc20: isErc20,
    isLoading: false,
    tokenAddress: tokenAddress,
    tokenName: tokenName,
  };
}
