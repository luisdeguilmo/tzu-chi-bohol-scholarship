import React, { useEffect, useState } from "react";
import { useBatches } from "../../../hooks/useBatches";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import ManageApplicants from "./ManageApplicants";
import BatchActions from "./BatchActions";
import UnassignedTableRow from "./UnassignedTableRow";
import { useBatch } from "../../../context/BatchContext";
import { orientationAndAwardingTableButtons } from "../../../constant/tableToolbarButtons";
import CreateBatchModal from "./CreateBatchModal";
import TableToolbar from "../../../components/TableToolbar";
import PageContent from "../../../components/PageContent";
import Table from "../../../components/Table";
import {
    awardingTableHeaders,
    orientationTableHeaders,
    unassignedOrientationTableHeaders,
} from "../../../constant/tableHeaders";
import { useOrientationAndAwarding } from "../../../hooks/useOrientationAndAwarding";
import ChangeStatusModal from "./ChangeStatusModal";
const OrientationTableRow = React.lazy(() => import("./OrientationTableRow"));
const AwardingTableRow = React.lazy(() => import("./AwardingTableRow"));
import { Plus } from "lucide-react";

export default function OrientationAndAwarding() {
    const [isRefresh, setIsRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(
        orientationAndAwardingTableButtons[0].name,
    );
    const { batches, setBatches, deleteBatch, fetchBatches } =
        useBatches("orientation");
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] =
        useState(false);
    const [selectedScholar, setSelectedScholar] = useState("");

    const [scholarId, setScholarId] = useState(null);
    const [sortBy, setSortBy] = useState("newest");
    const [status, setStatus] = useState("all");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
    const [batchName, setBatchName] = useState("");

    const {
        setPageNum,
        selectedApplicants,
        setSelectedApplicants,
        selectedBatch,
        setSelectedBatch,
        selectedBatchInBatches,
        setSelectedBatchInBatches,
    } = useBatch();

    const {
        isLoading,
        applications,
        fetchApplicationsOnApplicantsTab,
        fetchApplicationsOnOrientationTab,
        fetchApplicationsOnAwardingTab,
        updateStatusForOrientation,
        updateStatusForAwarding,
    } = useOrientationAndAwarding(
        selectedBatchInBatches,
        activeTab,
        status,
        sortBy,
    );

    useEffect(() => {
        fetchBatches();

        if (activeTab === "Applicants") {
            fetchApplicationsOnApplicantsTab();
        } else if (activeTab === "Orientation" && status && sortBy) {
            fetchApplicationsOnOrientationTab();
        } else if (activeTab === "Awarding" && status && sortBy) {
            fetchApplicationsOnAwardingTab();
        }

        const currentBatch = () => {
            const data = {};

            if (batches.length === 0) {
                data.batch_name = "Batch 1";
                setBatchName(data.batch_name);
            } else {
                const batchNumbers = batches.map((batch) => {
                    const match = batch.batch_name.match(/Batch (\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                });

                const highestNumber = Math.max(...batchNumbers, 0);
                data.batch_name = `Batch ${highestNumber + 1}`;
                setBatchName(data.batch_name);
            }
        };

        currentBatch();
    }, [
        status,
        sortBy,
        activeTab,
        selectedBatchInBatches,
        selectedApplicants,
        isRefresh,
        isCreateBatchModalOpen,
        isModalOpen,
        batches.length,
    ]);

    const handleChangeTab = async (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setStatus("all");
        setSelectedBatch(batches[0]?.batch_name);
        setSelectedBatchInBatches("all");
        setSelectedApplicants([]);
    };

    // Toggle applicant selection
    const toggleApplicantSelection = (applicationId) => {
        setSelectedApplicants((prev) => {
            if (prev.includes(applicationId)) {
                return prev.filter((id) => id !== applicationId);
            } else {
                return [...prev, applicationId];
            }
        });
    };

    // Select all visible applicants
    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.application_id);
        if (selectedApplicants.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedApplicants([]);
        } else {
            // Otherwise select all visible
            setSelectedApplicants(visibleIds);
        }
    };

    const filteredApplications = applications.filter((applicant) => {
        const term = searchTerm.trim().toLowerCase();

        return (
            applicant.last_name.toLowerCase().includes(term) ||
            applicant.middle_name.toLowerCase().includes(term) ||
            applicant.first_name.toLowerCase().includes(term) ||
            applicant.created_at.includes(term)
        );
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
    } = usePagination(filteredApplications, itemsPerPage);

    const handleBatchChange = async (value) => {
        setSelectedBatchInBatches(value);
        setPageNum(1);
    };

    const handleRefresh = async () => {
        setIsRefresh(true);
        fetchBatches();
        setSelectedBatchInBatches("all");
        setSelectedApplicants([]);
    };

    return (
        <PageContent>
            <TableToolbar
                items={applications}
                label={"Orientation & Awarding Attendance"}
                placeholder={"applications"}
                tab={activeTab}
                buttons={orientationAndAwardingTableButtons}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
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
                sortedItems={filteredApplications}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeTab={handleChangeTab}
                onChangeItemsPerPage={setItemsPerPage}
                onChangeCurrentPage={setCurrentPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                addButton={activeTab === "Orientation"}
                button={{
                    icon: <Plus className="w-4 h-4 text-white" />,
                    label: "Create Batch",
                }}
                onOpen={setIsCreateBatchModalOpen}
            >
                {activeTab !== "Applicants" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[150px] px-3 py-1 accent-green-700 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option
                                className="hover:bg-green-700 accent-green-700"
                                value="all"
                            >
                                All
                            </option>
                            <option
                                className="hover:bg-green-700"
                                value="attended"
                            >
                                Attended
                            </option>
                            <option
                                className="hover:bg-green-700"
                                value="not_attended"
                            >
                                Not Attended
                            </option>
                            <option
                                className="hover:bg-green-700"
                                value="pending"
                            >
                                Pending
                            </option>
                        </select>
                    </div>
                )}

                {activeTab === "Orientation" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Batches:
                        </span>
                        <select
                            value={selectedBatchInBatches}
                            onChange={(e) => handleBatchChange(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All Batches</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.batch_name}>
                                    {batch.batch_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </TableToolbar>

            <div className="overflow-x-auto rounded-[4px]">
                <Table
                    applications={applications}
                    tableHeaders={
                        activeTab === "Applicants"
                            ? unassignedOrientationTableHeaders
                            : activeTab === "Orientation"
                              ? orientationTableHeaders
                              : awardingTableHeaders
                    }
                    hasCheckbox={
                        activeTab === "Applicants" ||
                        activeTab === "Orientation"
                    }
                    currentItems={currentItems}
                    selectedItems={selectedApplicants}
                    selectAllVisible={selectAllVisible}
                >
                    {(() => {
                        switch (activeTab) {
                            case "Applicants":
                                return (
                                    <UnassignedTableRow
                                        loading={isLoading}
                                        currentItems={currentItems}
                                        selectedApplicants={selectedApplicants}
                                        toggleApplicantSelection={
                                            toggleApplicantSelection
                                        }
                                    />
                                );
                            case "Orientation":
                                return (
                                    <OrientationTableRow
                                        loading={isLoading}
                                        tab={activeTab}
                                        currentItems={currentItems}
                                        selectedApplicants={selectedApplicants}
                                        toggleApplicantSelection={
                                            toggleApplicantSelection
                                        }
                                        onRefresh={
                                            fetchApplicationsOnOrientationTab
                                        }
                                        onOpenModal={setIsChangeStatusModalOpen}
                                        onSelectScholarId={setScholarId}
                                        onSelectScholar={setSelectedScholar}
                                    />
                                );
                            default:
                                return (
                                    <AwardingTableRow
                                        loading={isLoading}
                                        currentItems={currentItems}
                                        onOpenModal={setIsChangeStatusModalOpen}
                                        onSelectScholarId={setScholarId}
                                        onSelectScholar={setSelectedScholar}
                                    />
                                );
                        }
                    })()}
                </Table>

                {/* Empty state */}
                {currentItems.length === 0 && !isLoading && (
                    <EmptyState message="No applications found." />
                )}
            </div>
            <div
                className={`flex items-center gap-6 ml-4 ${
                    applications.length > 0 && "mt-4"
                }`}
            >
                {activeTab === "Orientation" && (
                    <BatchActions
                        applications={applications}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        // handleSendSchedule={handleSendSchedule}
                        selectedBatchInBatches={selectedBatchInBatches}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        onSuccess={fetchBatches}
                        selectedBatch={selectedBatch}
                        deleteBatch={deleteBatch}
                        batches={batches}
                        setBatches={setBatches}
                        applicantsEachBatch={applications}
                        onRefresh={handleRefresh}
                    />
                )}

                {filteredApplications.length > 0 &&
                    activeTab !== "Awarding" && (
                        <ManageApplicants
                            tab={activeTab}
                            selectedBatch={selectedBatch}
                            setSelectedBatch={setSelectedBatch}
                            batches={batches}
                            selectedApplicants={selectedApplicants}
                            onRefresh={
                                activeTab === "Applicants"
                                    ? fetchApplicationsOnApplicantsTab
                                    : fetchApplicationsOnOrientationTab
                            }
                        />
                    )}

                {filteredApplications.length > 0 && (
                    <div className="flex justify-between items-center ml-auto">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredApplications.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}
            </div>

            {isCreateBatchModalOpen && (
                <CreateBatchModal
                    batchName={batchName}
                    isOpen={isCreateBatchModalOpen}
                    onClose={setIsCreateBatchModalOpen}
                    onRefresh={fetchBatches}
                />
            )}

            {isChangeStatusModalOpen && (
                <ChangeStatusModal
                    tab={activeTab}
                    scholar={selectedScholar}
                    isOpen={isChangeStatusModalOpen}
                    onClose={setIsChangeStatusModalOpen}
                    label={"Change Status"}
                    scholarId={scholarId}
                    onUpdate={
                        activeTab === "Orientation"
                            ? updateStatusForOrientation
                            : updateStatusForAwarding
                    }
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                />
            )}
        </PageContent>
    );
}
