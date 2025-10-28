import { RotateCcw, UserCheck, UserX } from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const ScholarAccountsRow = ({
    currentItems,
    selectedAccounts,
    toggleAccountSelection,
    profilePics,
    isLoading,
    onUpdateAccountStatus,
}) => {
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [accountStatus, setAccountStatus] = useState("");
    const [action, setAction] = useState("");

    const handleOpenConfirmationModal = (
        accountId,
        accountStatus,
        actionType
    ) => {
        setAction(actionType);
        setAccountStatus(accountStatus);
        setSelectedScholar(accountId);
        setIsConfirmationModalOpen(true);
    };

    const handleAccountStatusChange = async (
        accountId,
        accountStatus,
        action
    ) => {
        if (action === "activate" && accountStatus === "active") {
            toast.error("Account is already active.");
            return;
        }

        if (action === "deactivate" && accountStatus === "deactivated") {
            toast.error("Account is already deactivated.");
            return;
        }

        try {
            const success = await onUpdateAccountStatus(accountId, action);
            if (success) {
                toast.success(
                    `Account ${
                        action === "activate" ? "activated" : "deactivated"
                    } successfully.`
                );
                setIsConfirmationModalOpen(false);
            }
        } catch (error) {
            console.error("Error updating account status:", error);
            toast.error(`Failed to ${action} account. Please try again.`);
        }
    };

    return (
        <>
            {currentItems.map((account, index) => (
                <tr
                    key={index}
                    className={`transition-colors text-center border-b border-gray-200 hover:bg-gray-50 ${
                        selectedAccounts.includes(account.account_id)
                            ? "bg-green-50"
                            : ""
                    } text-xs`}
                >
                    <td className="pl-3 py-2 text-left whitespace-nowrap text-gray-500">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={selectedAccounts.includes(
                                account.account_id
                            )}
                            onChange={() =>
                                toggleAccountSelection(account.account_id)
                            }
                        />
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {account.account_id}
                    </td>
                    <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex items-center text-left gap-2">
                            <img
                                src={profilePics[account.account_id]}
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold text-xs">
                                    {account.first_name +
                                        " " +
                                        account.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {account.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className={`py-2 whitespace-nowrap text-gray-500 `}>
                        <span
                            className={`px-2 py-1 rounded-full ${
                                account.status === "active"
                                    ? "text-green-800 bg-green-100"
                                    : account.status === "deactivated"
                                      ? "text-red-800 bg-red-100"
                                      : "text-yellow-800 bg-yellow-100"
                            }`}
                        >
                            {account.status === "active"
                                ? "Active"
                                : account.status === "deactivated"
                                  ? "Deactivated"
                                  : "Not Renewed"}
                        </span>
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {account.created_at
                            ? formatDateTime(account.created_at)
                            : "--"}
                    </td>
                    <td className="py-2 whitespace-nowrap font-medium">
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setIsChangePasswordModalOpen(true);
                                    setSelectedScholar(account.account_id);
                                }
                                }
                                title="Change Password"
                            >
                                <RotateCcw className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                            </button>
                            <button
                                onClick={() =>
                                    handleOpenConfirmationModal(
                                        account.account_id,
                                        account.status,
                                        "activate"
                                    )
                                }
                                title="Activate Account"
                            >
                                <UserCheck className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                            </button>
                            <button
                                onClick={() =>
                                    handleOpenConfirmationModal(
                                        account.account_id,
                                        account.status,
                                        "deactivate"
                                    )
                                }
                                title="Deactivate Account"
                            >
                                <UserX className="w-4 h-4 text-red-600 hover:text-red-800 transition-colors" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}

            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                isLoading={isLoading}
                label={"Confirmation"}
                message={
                    action === "activate"
                        ? "Are you sure you want to activate this account?"
                        : "Are you sure you want to deactivate this account?"
                }
                onClick={() =>
                    handleAccountStatusChange(
                        selectedScholar,
                        accountStatus,
                        action
                    )
                }
            />

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={setIsChangePasswordModalOpen}
                userId={selectedScholar}
            />
        </>
    );
};

export default ScholarAccountsRow;
