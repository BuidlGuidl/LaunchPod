import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { erc20ABI } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export function useErc20() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isEns, setIsEns] = useState(false);
  const [isOp, setIsOp] = useState(false);

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
        const name = await readContract({
          address: tokenAddress,
          abi: erc20ABI,
          functionName: "name",
        });
        const symbol = await readContract({
          address: tokenAddress,
          abi: erc20ABI,
          functionName: "name",
        });
        setTokenName(name);
        setTokenSymbol(symbol);
      }
    })();
  }, [tokenAddress]);

  useEffect(() => {
    if (tokenName == "Ethereum Name Service") setIsEns(true);
    if (tokenName == "Optimism") setIsOp(true);
  }, [tokenName]);

  if (isErc20Loading || tokenAddressLoadng) {
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
    tokenSymbol,
    isEns,
    isOp,
  };
}
