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
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useUserAccount } from "../../../hooks/useUserAccount";
import { toast } from "react-toastify";
import { useProfilePicture } from "../../../hooks/useProfilePicture";

const StaffAccounts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [staffId, setStaffId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [action, setAction] = useState("");
    const [accountStatus, setAccountStatus] = useState("");
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const { staffAccounts, fetchStaffAccounts } = useStaffAccounts();
    const { profilePics, fetchAllPics } = useProfilePicture(
        staffAccounts,
        "user-profile-picture",
    );
    const { loading: isLoading, updateScholarAccountStatus } = useUserAccount();

    useEffect(() => {
        fetchStaffAccounts();
        fetchAllPics();
    }, []);

    // Filter data based on search term
    const filteredStaffAccounts = staffAccounts.filter(
        (staff) =>
            staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedStaffAccounts = [...filteredStaffAccounts].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date) - new Date(a.date);
            case "oldest":
                return new Date(a.date) - new Date(b.date);
            case "name":
                return a.first_name.localeCompare(b.first_name);
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
        setSelectedStaff(accountId);
        setIsConfirmationModalOpen(true);
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
            const success = await updateScholarAccountStatus(accountId, action);
            if (success) {
                toast.success(
                    `Account ${
                        action === "activate" ? "activated" : "deactivated"
                    } successfully.`,
                );
                setIsConfirmationModalOpen(false);
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
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={true}
                    button={{
                        icon: <Plus className="w-4 h-4 text-white" />,
                        label: "New Staff Account",
                    }}
                />

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={staffAccountHeaders}>
                        {currentItems.map((staff) => (
                            <tr
                                key={staff.account_id}
                                className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="py-2 whitespace-nowrap text-gray-700">
                                    {staff.account_id}
                                </td>
                                <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[30%]"></div>
                                    <div className="w-[max-content] flex items-center text-left gap-2">
                                        {profilePics[staff.account_id] ? (
                                            <img
                                                src={
                                                    profilePics[
                                                        staff.account_id
                                                    ]
                                                }
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 mr-1 rounded-full text-white text-sm bg-black flex justify-center items-center">
                                                {staff.first_name[0]}{" "}
                                                {staff.last_name[0]}
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-bold text-xs">
                                                {staff.first_name +
                                                    " " +
                                                    staff.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {staff.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    className={`py-2 whitespace-nowrap text-gray-500 `}
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
                                <td className="py-2 whitespace-nowrap text-gray-500">
                                    {formatDateTime(staff.created_at)}
                                </td>
                                <td className="py-2 whitespace-nowrap font-medium">
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                setStaffId(staff.account_id);
                                            }}
                                            // className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="View Profile"
                                        >
                                            <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsChangePasswordModalOpen(
                                                    true,
                                                );
                                                setSelectedStaff(
                                                    staff.account_id,
                                                );
                                            }}
                                            title="Change Password"
                                        >
                                            <RotateCcw className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOpenConfirmationModal(
                                                    staff.account_id,
                                                    staff.status,
                                                    "activate",
                                                )
                                            }
                                            title="Activate Account"
                                        >
                                            <UserCheck className="w-4 h-4 text-green-600 hover:text-green-800 transition-colors" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOpenConfirmationModal(
                                                    staff.account_id,
                                                    staff.status,
                                                    "deactivate",
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
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No events found." />
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

            <UserProfileModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                isStaff={true}
                userId={staffId}
            />

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={setIsChangePasswordModalOpen}
                userId={selectedStaff}
            />

            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                isLoading={isLoading}
                label={"Confirmation"}
                action={action}
                message={
                    action === "activate"
                        ? "Are you sure you want to activate this account?"
                        : "Are you sure you want to deactivate this account?"
                }
                onClick={() =>
                    handleAccountStatusChange(
                        selectedStaff,
                        accountStatus,
                        action,
                    )
                }
                // deactivationReason={deactivationReason}
                // setDeactivationReason={setDeactivationReason}
            />

            <FormModal
                isOpen={isFormModalOpen}
                onClose={setIsFormModalOpen}
                onSuccess={fetchStaffAccounts}
            />
        </div>
    );
};

export default StaffAccounts;
