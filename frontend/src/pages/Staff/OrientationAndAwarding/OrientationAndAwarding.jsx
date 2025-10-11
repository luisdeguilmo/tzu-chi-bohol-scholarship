import { useEffect, useState } from "react";
import { useBatches } from "../../../hooks/useBatches";
import { usePagination } from "../../../hooks/usePagination";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
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
    unassignedTableHeaders,
} from "../../../constant/tableHeaders";
import { manageApplication } from "../../../services/emailService";
import SendEmailButton from "./SendEmailButtton";
import { useOrientationAndAwarding } from "../../../hooks/useOrientationAndAwarding";
import OrientationTableRow from "./OrientationTableRow";
import ChangeStatusModal from "./ChangeStatusModal";
import AwardingTableRow from "./AwardingTableRow";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function OrientationAndAwarding() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(
        orientationAndAwardingTableButtons[0].name
    );
    const { batches, setBatches, deleteBatch, fetchBatches } =
        useBatches("orientation");
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] =
        useState(false);

    const [scholarId, setScholarId] = useState(null);
    const [sortBy, setSortBy] = useState("newest");
    const [status, setStatus] = useState("all");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
    const [batchName, setBatchName] = useState("");

    const {
        pageNum,
        setPageNum,
        selectedApplicants,
        setSelectedApplicants,
        selectedBatch,
        setSelectedBatch,
        selectedBatchInBatches,
        setSelectedBatchInBatches,
    } = useBatch();

    const {
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
        sortBy
    );

    const { profilePics, fetchAllPics } = useProfilePicture(applications);
    const { isLoading, sendExaminationPassed, sendExaminationFailed } =
        manageApplication();

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
        setSelectedBatch(batches[0].batch_name);
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

    const handleApplicantsChange = (e) => {
        const newValue = e.target.value;
        setSelectedApplicants(newValue);
        setCurrentPage(1);
    };

    // const handleSendEmail = async () => {
    //     let success = null;

    //     if (status === "passed") {
    //         success = sendExaminationPassed(applications);
    //     } else if (status === "failed") {
    //         success = sendExaminationFailed(applications);
    //     }

    //     if (success) {
    //         setIsEmailSent(true);
    //     }
    // };

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
                sortedItems={filteredApplications}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeTab={handleChangeTab}
                onChangeItemsPerPage={setItemsPerPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                addCreateBatchButton={activeTab === "Orientation"}
                onOpen={setIsCreateBatchModalOpen}
            >
                {activeTab !== "Applicants" && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            Filtered by status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-1 accent-green-700 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                )}

                {activeTab === "Orientation" && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Batches:</span>
                        <select
                            value={selectedBatchInBatches}
                            onChange={(e) => handleBatchChange(e.target.value)}
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
                            ? unassignedTableHeaders
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
                                        currentItems={currentItems}
                                        selectedApplicants={selectedApplicants}
                                        toggleApplicantSelection={
                                            toggleApplicantSelection
                                        }
                                        profilePics={profilePics}
                                    />
                                );
                            case "Orientation":
                                return (
                                    <OrientationTableRow
                                        tab={activeTab}
                                        currentItems={currentItems}
                                        selectedApplicants={selectedApplicants}
                                        toggleApplicantSelection={
                                            toggleApplicantSelection
                                        }
                                        profilePics={profilePics}
                                        onRefresh={
                                            fetchApplicationsOnOrientationTab
                                        }
                                        onOpenModal={setIsChangeStatusModalOpen}
                                        onSelectScholarId={setScholarId}
                                    />
                                );
                            default:
                                return (
                                    <AwardingTableRow
                                        currentItems={currentItems}
                                        profilePics={profilePics}
                                        onOpenModal={setIsChangeStatusModalOpen}
                                        onSelectScholarId={setScholarId}
                                    />
                                );
                        }
                    })()}
                </Table>

                {/* Empty state */}
                {currentItems.length === 0 && (
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

            <CreateBatchModal
                batchName={batchName}
                isOpen={isCreateBatchModalOpen}
                onClose={setIsCreateBatchModalOpen}
                onRefresh={fetchBatches}
            />

            <ChangeStatusModal
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
            />
        </PageContent>
    );
}
