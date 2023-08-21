import React, { useState } from "react";
import { AddressInput } from "./scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const RemoveAdmin: React.FC = () => {
  const [removeAdminAddress, setRemoveAdminAddress] = useState<string>("");
  
  const { writeAsync: removeAdmin } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "modifyAdminRole",
    args: [removeAdminAddress, false],
  });

  const handleRemoveAdmin = async () => {
    try {
      await removeAdmin();
      // Handle success message
    } catch (error) {
      // Handle error message
      console.error(error);
    }
  };

  return (
    <div>
      <label htmlFor="remove-admin-modal" className="btn">
        Remove Admin
      </label>
      <input type="checkbox" id="remove-admin-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Remove Admin</h3>
          <label htmlFor="removeAdminAddress" className="block mt-4">
            Admin Address:
          </label>
          <AddressInput value={removeAdminAddress} onChange={value => setRemoveAdminAddress(value)} />
          <div className="modal-action">
            <label htmlFor="remove-admin-modal" className="btn">
              Close
            </label>
            <button onClick={handleRemoveAdmin} className="btn btn-primary ml-2">
              Remove Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RemoveAdmin;