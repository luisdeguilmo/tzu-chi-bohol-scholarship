import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { staffAccountHeaders } from "../../../constant/tableHeaders";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";
import { formatDateTime } from "../../../utils/formatDateTime";
import FormModal from "./FormModal";
import { Eye, Plus, RotateCcw, UserCheck, UserX } from "lucide-react";
import UserProfileModal from "../../../components/UserProfileModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useUserAccount } from "../../../hooks/useUserAccount";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../../../config";

const StaffAccounts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [staffId, setStaffId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [modal, setModal] = useState(null);
    const [action, setAction] = useState("");
    const [status, setStatus] = useState("all");
    const [accountStatus, setAccountStatus] = useState("");
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const { loading, staffAccounts, fetchStaffAccounts } =
        useStaffAccounts(status);
    const { loading: isLoading, updateStaffAccountStatus } = useUserAccount();

    useEffect(() => {
        fetchStaffAccounts();
    }, [status]);

    // Filter data based on search term
    const filteredStaffAccounts = staffAccounts.filter(
        (staff) =>
            staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedStaffAccounts = [...filteredStaffAccounts].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at) - new Date(a.created_at);
            case "oldest":
                return new Date(a.created_at) - new Date(b.created_at);
            case "name":
                return a.last_name.localeCompare(b.last_name);
            default:
                return 0;
        }
    });

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(sortedStaffAccounts, itemsPerPage);

    const handleOpenConfirmationModal = (
        accountId,
        accountStatus,
        actionType,
    ) => {
        setAction(actionType);
        setAccountStatus(accountStatus);
    };

    const handleAccountStatusChange = async (
        accountId,
        accountStatus,
        action,
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
            const success = await updateStaffAccountStatus(accountId, action);
            if (success) {
                toast.success(
                    `Account ${
                        action === "activate" ? "activated" : "deactivated"
                    } successfully.`,
                );
                setIsModalOpen(false);
                fetchStaffAccounts();
            }
        } catch (error) {
            console.error("Error updating account status:", error);
            toast.error(`Failed to ${action} account. Please try again.`);
        }
    };

    const handleRefresh = () => {
        fetchApplications(activeTab);
        setSelectedItems([]);
    };

    return (
        <div className="lg:p-6">
            {/* <EventForm onSuccess={fetchEvents} /> */}
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={staffAccounts}
                    label={"Staff Accounts"}
                    placeholder={"staff accounts"}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedStaffAccounts}
                    onOpen={setIsFormModalOpen}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeItemsPerPage={setItemsPerPage}
                    onChangeCurrentPage={setCurrentPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={true}
                    button={{
                        icon: <Plus className="w-4 h-4 text-white" />,
                        label: "New Staff Account",
                    }}
                    sortItems={[
                        {
                            label: "Newest First",
                            value: "newest",
                        },
                        {
                            label: "Oldest First",
                            value: "oldest",
                        },
                        {
                            label: "Name (A-Z)",
                            value: "name",
                        },
                    ]}
                >
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="deactivated">Deactivated</option>
                        </select>
                    </div>
                </TableToolbar>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={staffAccountHeaders}>
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
                            currentItems.map((staff) => (
                                <tr
                                    key={staff.account_id}
                                    className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-2.5 whitespace-nowrap text-gray-700">
                                        {staff.account_id}
                                    </td>
                                    <td className="py-2.5 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                        <div className="w-[30%]"></div>
                                        <div className="w-[max-content] flex items-center text-left gap-2">
                                            {staff[0]?.profile ? (
                                                <img
                                                    src={staff[0].profile}
                                                    alt="Profile"
                                                    className="w-10 h-10 object-cover rounded-full mx-auto"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 mr-1 rounded-full text-white text-sm bg-black flex justify-center items-center">
                                                    {staff?.first_name[0]}{" "}
                                                    {staff?.last_name[0]}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-bold text-xs">
                                                    {staff.last_name +
                                                        ", " +
                                                        staff.first_name}{" "}
                                                    {staff.middle_name
                                                        ? staff.middle_name[0] +
                                                          "."
                                                        : ""}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {staff.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className={`py-2.5 whitespace-nowrap text-gray-500 `}
                                    >
                                        <span
                                            className={`px-2 py-1 rounded-full ${
                                                staff.status === "active"
                                                    ? "text-green-800 bg-green-100"
                                                    : "text-red-800 bg-red-100"
                                            }`}
                                        >
                                            {staff.status === "active"
                                                ? "Active"
                                                : "Deactivated"}
                                        </span>
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap text-gray-500">
                                        {formatDateTime(staff.created_at)}
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap font-medium">
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setStaffId(
                                                        staff.account_id,
                                                    );
                                                    setSelectedStaff([
                                                        staff,
                                                        staff[0],
                                                        staff.account_id,
                                                    ]);
                                                    setModal(
                                                        "view_profile_modal",
                                                    );
                                                }}
                                                // className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && !loading && (
                        <EmptyState message="No staff account found." />
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    {/* Pagination */}
                    {staffAccounts.length > 0 && (
                        <div className="flex justify-end gap-4 items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={goToPreviousPage}
                                onNext={goToNextPage}
                                indexOfFirstItem={indexOfFirstItem}
                                indexOfLastItem={indexOfLastItem}
                                totalItems={filteredStaffAccounts.length}
                                itemLabel={"events"}
                            />
                        </div>
                    )}
                </div>
            </div>

            {modal === "view_profile_modal" && (
                <UserProfileModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    info={selectedStaff}
                    data={{
                        action: action,
                        onChangeAccountStatus: handleAccountStatusChange,
                        onOpenConfirmationModal: handleOpenConfirmationModal,
                        message1:
                            "Are you sure you want to activate this account?",
                        message2:
                            "Are you sure you want to deactivate this account?",
                        message3:
                            "Are you sure you want to reset the password for this account?",
                    }}
                />
            )}

            {isFormModalOpen && (
                <FormModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    onSuccess={fetchStaffAccounts}
                />
            )}
        </div>
    );
};

export default StaffAccounts;
