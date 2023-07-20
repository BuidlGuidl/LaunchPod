import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
<<<<<<< HEAD
=======
import { useAccount } from "wagmi";
>>>>>>> 92ed1f7464130dbc0e61bce3df254ddca0608a2c
import { erc20ABI } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export function useErc20() {
<<<<<<< HEAD
  const [tokenName, setTokenName] = useState("");
  const [isEns, setIsEns] = useState(false);
  const [isOp, setIsOp] = useState(false);
=======
  const { isConnected } = useAccount();

  const [tokenName, setTokenName] = useState("");
>>>>>>> 92ed1f7464130dbc0e61bce3df254ddca0608a2c

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

<<<<<<< HEAD
  useEffect(() => {
    if (tokenName == "Ethereum Name Service") setIsEns(true);
    if (tokenName == "Optimism") setIsOp(true);
  }, [tokenName]);

  if (isErc20Loading || tokenAddressLoadng) {
=======
  if (!isConnected || isErc20Loading || tokenAddressLoadng) {
>>>>>>> 92ed1f7464130dbc0e61bce3df254ddca0608a2c
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
<<<<<<< HEAD
    isEns,
    isOp,
=======
>>>>>>> 92ed1f7464130dbc0e61bce3df254ddca0608a2c
  };
}
