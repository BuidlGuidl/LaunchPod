import React, { useState } from "react";
import { AddressInput } from "../../scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import Modal from "~~/components/Modal";


const AddAdmin: React.FC = () => {
  const [adminAddress, setAdminAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { writeAsync: addAdmin } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "modifyAdminRole",
    args: [adminAddress, true],
  });

  const handleAddAdminSuccess = () => {
    // handle success actions here
  };

  const handleAddAdminError = () => {
    // handle error actions here
  };

  const handleAddAdmin = async () => {
    setLoading(true);

    try {
      await addAdmin();
      handleAddAdminSuccess();
    } catch (error) {
      handleAddAdminError();
    } finally {
      setLoading(false);
    }
  };

  const triggerElement = (
    <div
      className="text-lg w-full mt-6 items-center gap-1 flex flex-row cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Add Admin
    </div>
  );

  const modalContent = (
    <div>
      <label htmlFor="admin" className="block mt-4">
        Admin Address:
      </label>
      <AddressInput value={adminAddress} onChange={value => setAdminAddress(value)} />
    </div>
  );

  const modalAction = {
    label: loading ? "Adding Admin..." : "Add Admin",
    onClick: handleAddAdmin,
    // disabled: loading,
  };

  return (
    <Modal trigger={triggerElement} modalTitle="Add Admin" modalContent={modalContent} action={modalAction} />
  );
};

export default AddAdmin;
