import React, { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useScholarAccounts } from "../../../hooks/useScholarAccounts";
import {
    pendingScholarHeaders,
    scholarAccountHeaders,
} from "../../../constant/tableHeaders";
import PendingScholarsRow from "./PendingScholarsRow";
import ScholarAccountsRow from "./ScholarAccountsRow";
import { scholarAccountButtons } from "../../../constant/tableToolbarButtons";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { useUserAccount } from "../../../hooks/useUserAccount";
import { Check, Plus } from "lucide-react";
import ScholarProfileModal from "../../../components/UserProfileModal";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { toast } from "react-toastify";
import AddScholarModal from "./AddScholarModal";
import InitialRenderedHours from "./InitialRenderedHoursModal";

const ScholarAccounts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedScholars, setSelectedScholars] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("newest");
    const [status, setStatus] = useState("all");
    const [activeTab, setActiveTab] = useState("pending");
    const [headers, setHeaders] = useState(pendingScholarHeaders);
    const [scholarId, setScholarId] = useState(null);
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [accountStatus, setAccountStatus] = useState("");
    const [action, setAction] = useState("");
    const [deactivationReason, setDeactivationReason] = useState("");

    const { loading, scholars, createScholarAccount, fetchScholars } =
        useScholarAccounts(activeTab, sortBy, status);

    const { loading: isLoading, updateScholarAccountStatus } =
        useScholarAccounts();

    useEffect(() => {
        fetchScholars(activeTab);
    }, [activeTab, sortBy, status]);

    // Toggle scholar selection
    const toggleScholarSelection = (scholarId) => {
        setSelectedScholars((prev) => {
            if (prev.includes(scholarId)) {
                return prev.filter((id) => id !== scholarId);
            } else {
                return [...prev, scholarId];
            }
        });
    };

    // Select all visible scholars
    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.application_id);
        if (selectedScholars.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedScholars([]);
        } else {
            // Otherwise select all visible
            setSelectedScholars(visibleIds);
        }
    };

    // Filter data based on search term
    const filteredScholars = scholars.filter(
        (scholar) =>
            scholar.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            scholar.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedScholars = [...filteredScholars].sort((a, b) => {
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
    } = usePagination(filteredScholars, itemsPerPage);

    const handleChangeTab = async (tab) => {
        setActiveTab(tab);
        if (tab === "pending") setHeaders(pendingScholarHeaders);
        else if (tab === "created") setHeaders(scholarAccountHeaders);
    };

    const handleRefresh = () => {
        fetchScholars(activeTab);
    };

    const handleOpenConfirmationModal = (
        accountId,
        accountStatus,
        actionType,
    ) => {
        setAction(actionType);
        setAccountStatus(accountStatus);
        setScholarId(accountId);
        // setIsModalOpen(true);
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

        if (
            action === "deactivate" &&
            (accountStatus === "graduated" || accountStatus === "terminated")
        ) {
            toast.error("Account is already deactivated.");
            return;
        }

        try {
            const success = await updateScholarAccountStatus(
                accountId,
                action,
                deactivationReason,
            );
            if (success) {
                toast.success(
                    `Account ${
                        action === "activate" ? "activated" : "deactivated"
                    } successfully.`,
                );
                setIsModalOpen(false);
                fetchScholars(activeTab);
            }
        } catch (error) {
            console.error("Error updating account status:", error);
            toast.error(`Failed to ${action} account. Please try again.`);
        }
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={scholars}
                    label={"Scholars Accounts"}
                    placeholder={"scholars"}
                    tab={activeTab}
                    buttons={scholarAccountButtons}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedScholars}
                    onRefresh={handleRefresh}
                    onOpen={setIsFormModalOpen}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
                    onChangeCurrentPage={setCurrentPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={activeTab === "pending"}
                    button={
                        activeTab === "pending" && {
                            icon: <Plus className="w-4 h-4 text-white" />,
                            label: "Add Existing Scholar",
                        }
                    }
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
                    {activeTab === "created" && (
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
                                <option value="not_renewed">Not Renewed</option>
                                <option value="active">Active</option>
                                <option value="terminated">Terminated</option>
                                <option value="graduated">Graduated</option>
                            </select>
                        </div>
                    )}
                </TableToolbar>

                <div className="overflow-x-auto rounded-[4px]">
                    <Table
                        tableHeaders={headers}
                        applications={scholars}
                        currentItems={currentItems}
                        selectedItems={selectedScholars}
                        selectAllVisible={selectAllVisible}
                        hasCheckbox={activeTab === "pending"}
                    >
                        {activeTab === "pending" ? (
                            <PendingScholarsRow
                                loading={loading}
                                currentItems={currentItems}
                                selectedScholars={selectedScholars}
                                toggleScholarSelection={toggleScholarSelection}
                                onCreateAccount={createScholarAccount}
                            />
                        ) : (
                            <ScholarAccountsRow
                                loading={loading}
                                currentItems={currentItems}
                                selectedAccounts={selectedScholars}
                                toggleAccountSelection={toggleScholarSelection}
                                isLoading={isLoading}
                                onUpdateAccountStatus={
                                    updateScholarAccountStatus
                                }
                                onRefresh={() => fetchScholars(activeTab)}
                                onSelectScholarId={setScholarId}
                                setIsModalOpen={setIsModalOpen}
                                setModal={setModal}
                                onOpenConfirmationModal={
                                    handleOpenConfirmationModal
                                }
                                onSelectScholar={setSelectedScholar}
                            />
                        )}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && !loading && (
                        <EmptyState
                            message={
                                activeTab === "pending"
                                    ? "No pending scholar found."
                                    : "No scholar found."
                            }
                        />
                    )}
                </div>

                {/* Pagination */}
                {filteredScholars.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        {activeTab === "pending" && (
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() =>
                                        createScholarAccount(
                                            selectedScholars,
                                            setSelectedScholars,
                                        )
                                    }
                                    disabled={
                                        selectedScholars.length === 0 || loading
                                    }
                                    className={`flex items-center gap-1 px-3 py-2.5 rounded-md text-xs whitespace-nowrap ${
                                        selectedScholars.length === 0 || loading
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    <Check className="w-4 h-4" />
                                    {loading
                                        ? "Processing..."
                                        : "Approve Selected Accounts"}
                                </button>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredScholars.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}
            </div>

            {modal === "view_profile_modal" && (
                <ScholarProfileModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    isScholar={true}
                    info={selectedScholar}
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
                        deactivationReason: deactivationReason,
                        setDeactivationReason: setDeactivationReason,
                    }}
                />
            )}

            {modal === "change_status" && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
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
                            scholarId,
                            accountStatus,
                            action,
                        )
                    }
                    isScholarAccount={true}
                    deactivationReason={deactivationReason}
                    setDeactivationReason={setDeactivationReason}
                />
            )}

            {modal === "set_rendered_hours_modal" && (
                <InitialRenderedHours
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
                    id={scholarId}
                    onRefresh={() => fetchScholars(activeTab)}
                />
            )}

            {isFormModalOpen && (
                <AddScholarModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    label={"Add Existing Scholar"}
                />
            )}
        </div>
    );
};

export default ScholarAccounts;
