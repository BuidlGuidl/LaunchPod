import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useIsAdmin() {
  const { address, isConnected } = useAccount();
  const { data: isAdmin, isLoading: isAdminLoadingCheck } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "hasRole",
    args: [ADMIN_ROLE, address],
  });

  if (!isConnected || isAdminLoadingCheck) {
    return {
      isAdmin: false,
      isLoading: true,
    };
  }

  return {
    isAdmin: isAdmin,
    isLoading: false,
  };
}
