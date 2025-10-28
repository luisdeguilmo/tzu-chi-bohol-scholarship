import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
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

const ScholarAccounts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedScholars, setSelectedScholars] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("newest");
    const [activeTab, setActiveTab] = useState("pending");
    const [headers, setHeaders] = useState(pendingScholarHeaders);

    const {
        loading,
        scholars,
        createScholarAccount,
        updateScholarAccountStatus,
        fetchScholars,
    } = useScholarAccounts(activeTab);

    const { profilePics, fetchAllPics } = useProfilePicture(scholars);

    console.log(scholars);
    console.log(activeTab);

    useEffect(() => {
        fetchScholars(activeTab);
        fetchAllPics();
    }, [activeTab]);

    console.log(scholars);

    // Toggle scholar selection
    const toggleScholarSelection = (scholarId) => {
        setSelectedScholars((prev) => {
            if (prev.includes(scholarId)) {
                return prev.filter((id) => id !== scholarId);
            } else {
                return [...prev, scholarId];
            }
        });
        console.log("Selected Scholars:", selectedScholars);
    };

    // Select all visible scholars
    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.id);
        if (selectedScholars.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedScholars([]);
        } else {
            // Otherwise select all visible
            setSelectedScholars(visibleIds);
        }
    };

    // Filter data based on search term
    const filteredScholars = scholars.filter((scholar) =>
        scholar.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedScholars = [...filteredScholars].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at) - new Date(a.created_at);
            case "oldest":
                return new Date(a.created_at) - new Date(b.created_at);
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
    } = usePagination(filteredScholars, itemsPerPage);

    const handleChangeTab = async (tab) => {
        await fetchScholars(tab);
        setActiveTab(tab);
        if (tab === "pending") setHeaders(pendingScholarHeaders);
        else if (tab === "created") setHeaders(scholarAccountHeaders);
    };

    const handleRefresh = () => {
        fetchScholars(activeTab);
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={scholars}
                    label={"Scholars Accounts"}
                    placeholder={"applications"}
                    tab={activeTab}
                    buttons={scholarAccountButtons}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedScholars}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                />

                <div className="overflow-x-auto rounded-[4px]">
                    <Table
                        tableHeaders={headers}
                        applications={scholars}
                        currentItems={currentItems}
                        selectedItems={selectedScholars}
                        selectAllVisible={selectAllVisible}
                        hasCheckbox={true}
                    >
                        {activeTab === "pending" ? (
                            <PendingScholarsRow
                                currentItems={currentItems}
                                selectedScholars={selectedScholars}
                                toggleScholarSelection={toggleScholarSelection}
                                profilePics={profilePics}
                                onCreateAccount={createScholarAccount}
                            />
                        ) : (
                            <ScholarAccountsRow
                                currentItems={currentItems}
                                selectedAccounts={selectedScholars}
                                toggleAccountSelection={toggleScholarSelection}
                                profilePics={profilePics}
                                isLoading={loading}
                                onUpdateAccountStatus={
                                    updateScholarAccountStatus
                                }
                            />
                        )}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No pending scholars found." />
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
                                            setSelectedScholars
                                        )
                                    }
                                    disabled={
                                        selectedScholars.length === 0 || loading
                                    }
                                    className={`px-4 py-3 rounded-md text-xs whitespace-nowrap ${
                                        selectedScholars.length === 0 || loading
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Create Selected Accounts"}
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
        </div>
    );
};

export default ScholarAccounts;
