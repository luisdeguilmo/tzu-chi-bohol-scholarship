import { Eye, RotateCcw, UserCheck, UserX } from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useState } from "react";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import ScholarProfileModal from "../../../components/UserProfileModal";

const ScholarAccountsRow = ({
    currentItems,
    selectedAccounts,
    toggleAccountSelection,
    isLoading,
    onUpdateAccountStatus,
    onRefresh,
    onSelectScholarId,
    setIsModalOpen,
    setModal,
    onOpenConfirmationModal,
}) => {
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
                    {/* <td className="pl-3 py-2 text-left whitespace-nowrap text-gray-500">
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
                    </td> */}
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {account.account_id}
                    </td>
                    <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex items-center text-left gap-2">
                            <img
                                src={account[0].profile}
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
                                    : account.status === "graduated"
                                      ? "text-blue-800 bg-blue-100"
                                      : account.status === "terminated"
                                        ? "text-red-800 bg-red-100"
                                        : "text-yellow-800 bg-yellow-100"
                            }`}
                        >
                            {account.status === "active"
                                ? "Active"
                                : account.status === "graduated"
                                  ? "Graduated"
                                  : account.status === "terminated"
                                    ? "Terminated"
                                    : "Not Renewed"}
                        </span>
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {account.created_at
                            ? formatDateTime(account.created_at)
                            : "--"}
                    </td>
                    <td className="py-2 whitespace-nowrap font-medium">
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    onSelectScholarId(account.account_id);
                                    setModal("view_profile_modal");
                                }}
                                // className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View Profile"
                            >
                                <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors" />
                            </button>
                            <button
                                onClick={() => {
                                    // setIsChangePasswordModalOpen(true);
                                    // setSelectedScholar(account.account_id);
                                    setIsModalOpen(true);
                                    onSelectScholarId(account.account_id);
                                    setModal("change_password_modal");
                                }}
                                title="Change Password"
                            >
                                <RotateCcw className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                            </button>
                            <button
                                onClick={() => {
                                    onOpenConfirmationModal(
                                        account.account_id,
                                        account.status,
                                        "activate",
                                    );
                                    setModal("change_status");
                                }}
                                title="Activate Account"
                            >
                                <UserCheck className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                            </button>
                            <button
                                onClick={() => {
                                    onOpenConfirmationModal(
                                        account.account_id,
                                        account.status,
                                        "deactivate",
                                    );
                                    setModal("change_status");
                                }}
                                title="Deactivate Account"
                            >
                                <UserX className="w-4 h-4 text-red-600 hover:text-red-800 transition-colors" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default ScholarAccountsRow;
