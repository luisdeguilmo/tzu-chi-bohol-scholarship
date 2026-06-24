import { Eye, PenLine, RotateCcw, UserCheck, UserX } from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useState } from "react";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import ScholarProfileModal from "../../../components/UserProfileModal";

const ScholarAccountsRow = ({
    loading,
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
    onSelectScholar,
}) => {
    return (
        <>
            {loading && (
                <tr>
                    <td colSpan={6} className="p-6">
                        <div className="mt-4 flex flex-col items-center gap-4">
                            <div className="flex items-end gap-1 h-10">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-emerald-500 rounded-full animate-bounce"
                                        style={{
                                            height: "10px",
                                            animationDelay: `${i * 100}ms`,
                                        }}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-slate-500">
                                Loading data...
                            </p>
                        </div>
                    </td>
                </tr>
            )}
            {!loading &&
                currentItems.map((account, index) => (
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
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {account.account_id}
                        </td>
                        <td className="py-2.5 flex justify-start whitespace-nowrap text-sm text-gray-700">
                            <div className="w-[30%]"></div>
                            <div className="w-[max-content] flex items-center text-left gap-2">
                                <img
                                    src={account[1]?.profile}
                                    alt="Profile"
                                    className="w-10 h-10 object-cover rounded-full mx-auto"
                                />
                                <div>
                                    <p className="font-bold text-xs">
                                        {account.last_name +
                                            ", " +
                                            account.first_name}{" "}
                                        {account.middle_name
                                            ? account.middle_name[0] + "."
                                            : ""}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {account.email}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td
                            className={`py-2.5 whitespace-nowrap text-gray-500 `}
                        >
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
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {account.created_at
                                ? formatDateTime(account.created_at)
                                : "--"}
                        </td>
                        <td className="py-2.5 whitespace-nowrap font-medium">
                            <div className="flex justify-center">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        onSelectScholarId(account.account_id);
                                        onSelectScholar([
                                            account[0],
                                            account[1],
                                            account.account_id,
                                        ]);
                                        setModal("view_profile_modal");
                                    }}
                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="View Profile"
                                >
                                    <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors" />
                                </button>

                                <button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        onSelectScholarId(account.account_id);
                                        setModal("set_rendered_hours_modal");
                                    }}
                                    disabled={!account?.is_added_from_admin}
                                    className={`${account?.is_added_from_admin ? "block" : "invisible"} p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200`}
                                    title="View Profile"
                                >
                                    <PenLine className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
        </>
    );
};

export default ScholarAccountsRow;
