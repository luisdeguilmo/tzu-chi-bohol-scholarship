import { useEffect, useState } from "react";
import { useBatches } from "../../../hooks/useBatches";
import { useExamination } from "../../../hooks/useExamination";
import { usePagination } from "../../../hooks/usePagination";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import ManageApplicants from "./ManageApplicants";
import BatchActions from "./BatchActions";
import UnassignedTableRow from "./UnassignedTableRow";
import BatchesTableRow from "./BatchesTableRow";
import ResultTableRow from "./ResultTableRow";
import { useBatch } from "../../../context/BatchContext";
import { examinationTableButtons } from "../../../constant/tableToolbarButtons";
import CreateBatchModal from "./CreateBatchModal";
import TableToolbar from "../../../components/TableToolbar";
import PageContent from "../../../components/PageContent";
import Table from "../../../components/Table";
import {
    batchesTableHeaders,
    resultTableHeaders,
    unassignedTableHeaders,
} from "../../../constant/tableHeaders";

export default function Examination() {
    const [isRefresh, setIsRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(examinationTableButtons[0].name);
    const { batches, setBatches, deleteBatch, fetchBatches } = useBatches();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
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

    const { applications, fetchApplications } = useExamination(
        selectedBatchInBatches,
        activeTab
    );
    const { profilePics, fetchAllPics } = useProfilePicture(applications);

    useEffect(() => {
        fetchBatches();
        fetchApplications();
        fetchAllPics();

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

        if (activeTab === "Result" && "aed".includes(term)) {
            return applicant.score >= 50 || applicant.score < 50;
        }

        if (activeTab === "Result" && "passed".includes(term)) {
            return applicant.score >= 50;
        }

        if (activeTab === "Result" && "failed".includes(term)) {
            return applicant.score < 50;
        }

        return (
            applicant.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.middle_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.created_at.includes(searchTerm)
        );
    });

    const sortedApplications = [...filteredApplications].sort((a, b) => {
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
    } = usePagination(sortedApplications, itemsPerPage);

    const handleSendSchedule = () => {
        applications.forEach((applicant) => {
            sendExaminationSchedule(
                applicant.application_id,
                applicant,
                batches,
                selectedBatchInBatches,
                setError
            );
        });
    };

    const handleBatchChange = async (value) => {
        setSelectedBatchInBatches(value);
        setPageNum(1);
    };

    const handleApplicantsChange = (e) => {
        const newValue = e.target.value;
        setSelectedApplicants(newValue);
        setCurrentPage(1);
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
                label={"Examination"}
                placeholder={"applications"}
                tab={activeTab}
                buttons={examinationTableButtons}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
                sortedItems={sortedApplications}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeTab={handleChangeTab}
                onChangeItemsPerPage={setItemsPerPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
            >
                {activeTab !== "Applicants" && (
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
                    tableHeaders={
                        activeTab === "Applicants"
                            ? unassignedTableHeaders
                            : activeTab === "Batches"
                            ? batchesTableHeaders
                            : resultTableHeaders
                    }
                    hasCheckbox={
                        activeTab === "Applicants" || activeTab === "Batches"
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
                            case "Batches":
                                return (
                                    <BatchesTableRow
                                        tab={activeTab}
                                        currentItems={currentItems}
                                        selectedApplicants={selectedApplicants}
                                        toggleApplicantSelection={
                                            toggleApplicantSelection
                                        }
                                        profilePics={profilePics}
                                        onRefresh={fetchApplications}
                                    />
                                );
                            default:
                                return (
                                    <ResultTableRow
                                        currentItems={currentItems}
                                        profilePics={profilePics}
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

            <div className="flex items-center gap-6 ml-4 mt-4">
                {activeTab === "Batches" && (
                    <BatchActions
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        handleSendSchedule={handleSendSchedule}
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

                {filteredApplications.length > 0 && activeTab !== "Result" && (
                    <ManageApplicants
                        tab={activeTab}
                        selectedBatch={selectedBatch}
                        setSelectedBatch={setSelectedBatch}
                        batches={batches}
                        selectedApplicants={selectedApplicants}
                        onRefresh={fetchApplications}
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
        </PageContent>
    );
}

// {
//     activeTab === "Result" && (
//         <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-600">Status:</span>
//             <select
//                 value={selectedApplicants}
//                 onChange={handleApplicantsChange}
//                 className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
//             >
//                 <option value="all">All</option>
//                 <option value="passed">Passed</option>
//                 <option value="failed">Failed</option>
//                 <option value="pending">Pending</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg
//                     className="fill-current h-4 w-4"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                 >
//                     <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                 </svg>
//             </div>
//         </div>
//     );
// }

// {
//     activeTab !== "Applicants" && (
//         <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-600">Batches:</span>
//             <select
//                 value={selectedBatchInBatches}
//                 onChange={(e) => handleBatchChange(e.target.value)}
//                 className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
//             >
//                 <option value="all">All Batches</option>
//                 {batches.map((batch) => (
//                     <option key={batch.id} value={batch.batch_name}>
//                         {batch.batch_name}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// }
