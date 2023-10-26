import { useAccount } from "wagmi";
import Admin from "~~/components/Admin";


const AdminPage = () => {
    const { address, isConnected } = useAccount();

    if (!isConnected) {
        return (
            <div className="text-center m-auto">Connect to continue.</div>
        )
    }

    // Implement admin gate.
    if (!address) {
        return (
            <div className="text-center m-auto">You are not worthy to view this page.</div>
        )
    }

  return (
    <div className="w-full p-10">
        <h1 className="uppercase text-center">admin</h1>
        <div className="pt-5">
            <Admin />
        </div>
    </div>
  )
}

export default AdminPage;