import { useEffect, useMemo, useState } from "react";
import { useBatches } from "../../../hooks/useBatches";
import { useExamination } from "../../../hooks/useExamination";
import { usePagination } from "../../../hooks/usePagination";
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
import { manageApplication } from "../../../services/emailService";
import SendEmailButton from "./SendEmailButtton";
import PassingScoreModal from "./PassingScoreModal";
import { useApplicationFiles } from "../../../hooks/useApplicationFiles";
import FileUploadFormModal from "../../../components/FileUploadFormModal";
import EmailMessageFormModal from "../../../components/EmailMessageFormModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useSettings } from "../../../hooks/useSettings";
import { DownloadIcon, Eye, Pencil, Plus } from "lucide-react";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { TableButtonAction } from "../../../components/TableButtonAction";
import { UnassignedList } from "./UnassignedList";
import { BatchesList } from "./BatchesList";
import { ResultList } from "./ResultList";

export default function Examination() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(examinationTableButtons[0].name);
    const { batches, setBatches, deleteBatch, fetchBatches } = useBatches(
        "entrance_examination",
    );

    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isDocumentFormModalOpen, setIsDocumentFormModalOpen] =
        useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [sortBy, setSortBy] = useState("newest");
    const [status, setStatus] = useState("all");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
    const [isPassingScoreModalOpen, setIsPassingScoreModalOpen] =
        useState(false);
    const [batchName, setBatchName] = useState("");
    const [tableHeaders, setTableHeaders] = useState([]);

    const size = useWindowSize();
    const isMobile = size.width < 768;

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
        applications,
        fetchApplicationsOnApplicantsTab,
        fetchApplicationsOnBatchesTab,
        fetchApplicationsOnResultTab,
    } = useExamination(selectedBatchInBatches, activeTab, status, sortBy);

    const { isLoading, sendExaminationResult } = manageApplication();

    const { passingScore, createPassingScore } = useSettings();

    const passedApplicants = applications.filter(
        (application) => application.score >= passingScore,
    );

    const failedApplicants = applications.filter(
        (application) => application.score < passingScore,
    );

    useEffect(() => {
        fetchBatches();

        if (activeTab === "Applicants") {
            fetchApplicationsOnApplicantsTab();
        } else if (activeTab === "Batches") {
            fetchApplicationsOnBatchesTab();
        } else if (activeTab === "Result" && status && sortBy) {
            fetchApplicationsOnResultTab();
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

    const { loading, applicationFiles, fetchApplicationFiles, reUploadFiles } =
        useApplicationFiles("entrance_examination", selectedId);

    useEffect(() => {
        fetchApplicationFiles("entrance_examination", selectedId);
    }, [selectedId]);

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

    const handleApplicantsChange = (e) => {
        const newValue = e.target.value;
        setSelectedApplicants(newValue);
        setCurrentPage(1);
    };

    const handleSendEmail = async () => {
        const success = await sendExaminationResult(applications);

        if (success) {
            setIsConfirmationModalOpen(false);
        }
    };

    const handleOpenFileFormModal = (applicationId) => {
        fetchApplicationFiles("entrance_examination", applicationId);
        setIsDocumentFormModalOpen(true);
        setSelectedId(applicationId);
    };

    const handleRefresh = async () => {
        setIsRefresh(true);
        fetchBatches();
        setSelectedBatchInBatches("all");
        setSelectedApplicants([]);
    };

    useMemo(() => {
        setTableHeaders(
            activeTab === "Applicants"
                ? unassignedTableHeaders
                : activeTab === "Batches"
                  ? batchesTableHeaders
                  : resultTableHeaders,
        );
    }, [activeTab]);

    return (
        <PageContent>
            <TableToolbar
                items={applications}
                label={"Entrance Examination"}
                placeholder={"applications"}
                tab={activeTab}
                buttons={examinationTableButtons}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
                sortedItems={filteredApplications}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeTab={handleChangeTab}
                onChangeItemsPerPage={setItemsPerPage}
                onChangeCurrentPage={setCurrentPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                passingScore={passingScore}
                addButton={activeTab === "Batches"}
                button={{
                    icon: <Plus className="w-4 h-4 text-white" />,
                    label: "Create Batch",
                }}
                onOpen={setIsCreateBatchModalOpen}
            >
                {activeTab === "Result" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                )}

                {activeTab !== "Applicants" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Batches:
                        </span>
                        <select
                            value={selectedBatchInBatches}
                            onChange={(e) => handleBatchChange(e.target.value)}
                            className="w-full px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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

            {/* {applications.length > 0 && (
                <label className="mb-2 flex items-center gap-2 text-xs tracking-wider text-gray-700">
                    <input
                        type="checkbox"
                        className={`h-3.5 w-3.5 accent-green-600 focus:ring-green-500 border-gray-300 rounded`}
                        checked={
                            currentItems?.length > 0 &&
                            selectedApplicants?.length === currentItems?.length
                        }
                        onChange={selectAllVisible}
                    />
                    Select All
                </label>
            )} */}

            <div
                className={`${isMobile && "flex flex-col gap-2"} overflow-x-auto rounded-[4px]`}
            >
                {isMobile ? (
                    currentItems.map((item, index) => (
                        <>
                            {(() => {
                                switch (activeTab) {
                                    case "Applicants":
                                        return (
                                            <UnassignedList
                                                index={index}
                                                item={item}
                                                tableHeaders={tableHeaders}
                                                selectedApplicants={
                                                    selectedApplicants
                                                }
                                                toggleApplicantSelection={
                                                    toggleApplicantSelection
                                                }
                                            />
                                        );
                                    case "Batches":
                                        return (
                                            <BatchesList
                                                tab={activeTab}
                                                index={index}
                                                item={item}
                                                tableHeaders={tableHeaders}
                                                selectedApplicants={
                                                    selectedApplicants
                                                }
                                                toggleApplicantSelection={
                                                    toggleApplicantSelection
                                                }
                                                onRefresh={
                                                    fetchApplicationsOnBatchesTab
                                                }
                                            />
                                        );
                                    default:
                                        return (
                                            <ResultList
                                                index={index}
                                                item={item}
                                                tableHeaders={tableHeaders}
                                                currentItems={currentItems}
                                                onOpenModal={
                                                    handleOpenFileFormModal
                                                }
                                            />
                                        );
                                }
                            })()}
                        </>
                    ))
                ) : (
                    <Table
                        applications={applications}
                        tableHeaders={
                            activeTab === "Applicants"
                                ? unassignedTableHeaders
                                : activeTab === "Batches"
                                  ? batchesTableHeaders
                                  : resultTableHeaders
                        }
                        hasCheckbox={
                            activeTab === "Applicants" ||
                            activeTab === "Batches"
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
                                            selectedApplicants={
                                                selectedApplicants
                                            }
                                            toggleApplicantSelection={
                                                toggleApplicantSelection
                                            }
                                        />
                                    );
                                case "Batches":
                                    return (
                                        <BatchesTableRow
                                            tab={activeTab}
                                            currentItems={currentItems}
                                            selectedApplicants={
                                                selectedApplicants
                                            }
                                            toggleApplicantSelection={
                                                toggleApplicantSelection
                                            }
                                            onRefresh={
                                                fetchApplicationsOnBatchesTab
                                            }
                                        />
                                    );
                                default:
                                    return (
                                        <ResultTableRow
                                            currentItems={currentItems}
                                            onOpenModal={
                                                handleOpenFileFormModal
                                            }
                                        />
                                    );
                            }
                        })()}
                    </Table>
                )}

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState message="No applications found." />
                )}
            </div>

            <div
                className={`md:flex items-center gap-6 ml-4 ${
                    applications.length > 0 && "mt-4"
                }`}
            >
                {activeTab === "Batches" && (
                    <BatchActions
                        applications={applications}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
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

                {activeTab === "Result" && (
                    <div className="flex items-center gap-2">
                        <SendEmailButton
                            onClick={() => setIsConfirmationModalOpen(true)}
                            isLoading={isLoading}
                            onSendSchedule={handleSendEmail}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    {activeTab === "Batches" &&
                        selectedBatchInBatches === "all" && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMessageModalOpen(true)}
                                    title={"Set Message"}
                                    className="p-2 bg-green-600 text-xs rounded-lg hover:bg-green-700 transition-colors flex items-center text-white"
                                >
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Set Message
                                </button>
                                <button
                                    onClick={() =>
                                        setIsPassingScoreModalOpen(true)
                                    }
                                    title={"Set Message"}
                                    className="p-2 bg-blue-600 text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center text-white"
                                >
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Set Passing Score
                                </button>
                            </div>
                        )}

                    <div className="block md:hidden">
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
                </div>

                {filteredApplications.length > 0 && activeTab !== "Result" && (
                    <ManageApplicants
                        tab={activeTab}
                        selectedBatch={selectedBatch}
                        setSelectedBatch={setSelectedBatch}
                        batches={batches}
                        selectedApplicants={selectedApplicants}
                        onRefresh={
                            activeTab === "Applicants"
                                ? fetchApplicationsOnApplicantsTab
                                : fetchApplicationsOnBatchesTab
                        }
                    />
                )}

                {filteredApplications.length > 0 && (
                    <div className="hidden md:flex justify-between items-center ml-auto">
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

            <ConfirmationModal
                label={"Send Results Notifications"}
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                message={
                    passedApplicants.length > 0 && failedApplicants.length > 0
                        ? `You’re about to email ${passedApplicants.length} passed and ${failedApplicants.length} failed applicants.`
                        : `You’re about to email ${passedApplicants.length} passed applicants.`
                }
                onClick={handleSendEmail}
                buttonLabel={"Confirm"}
                isLoading={isLoading}
            />

            <CreateBatchModal
                batchName={batchName}
                isOpen={isCreateBatchModalOpen}
                onClose={setIsCreateBatchModalOpen}
                onRefresh={fetchBatches}
            />

            <PassingScoreModal
                passingScore={passingScore}
                onSetPassingScore={createPassingScore}
                isOpen={isPassingScoreModalOpen}
                onClose={setIsPassingScoreModalOpen}
                onRefresh={fetchApplicationsOnResultTab}
            />

            <EmailMessageFormModal
                stage={"entrance_examination"}
                isOpen={isMessageModalOpen}
                onClose={setIsMessageModalOpen}
                onRefresh={fetchApplicationsOnBatchesTab}
                firstLabel={"Examination Passed Message"}
                secondLabel={"Examination Failed Message"}
            />

            <FileUploadFormModal
                label={"Entrance Examination Files"}
                type={"entrance_examination"}
                isOpen={isDocumentFormModalOpen}
                setIsOpen={setIsDocumentFormModalOpen}
                onSuccess={fetchApplicationsOnResultTab}
                selectedId={selectedId}
                applicationFiles={applicationFiles}
                onReUploadFiles={reUploadFiles}
                isLoading={loading}
                onRefresh={fetchApplicationsOnResultTab}
            />
        </PageContent>
    );
}
