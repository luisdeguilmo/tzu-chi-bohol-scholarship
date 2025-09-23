import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { usePdfActions } from "../../../hooks/usePdfActions";
import {
    interviewApplicationsTableHeaders,
    interviewResultTableHeaders,
} from "../../../constant/tableHeaders";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { useInitialInterview } from "../../../hooks/useInitialInterview";
import { initialInterviewTableButtons } from "../../../constant/tableToolbarButtons";
import ApplicantsTableRow from "./ApplicantsTableRow";
import ResultTableRow from "./ResultTableRow";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { manageApplication } from "../../../services/emailService";

export default function InitialInterview() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Applicants");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [action, setAction] = useState("");

    const { loading, error, applications, fetchApplications } =
        useInitialInterview(activeTab);
    const { fetchApplicantData } = useApplicantData();
    const { profilePics, fetchAllPics } = useProfilePicture(applications);

    useEffect(() => {
        fetchApplications();
    }, [activeTab]);

    const {
        isLoading,
        updateStatusToInterviewPassed,
        updateStatusToInterviewFailed,
    } = manageApplication();

    const handleApprove = async () => {
        const success = await updateStatusToInterviewPassed(selectedApplicant);

        if (success) {
            await fetchApplications();
            setIsFormModalOpen(false);
            // setAction("");
        }
    };

    const handleReject = async () => {
        const success = await updateStatusToInterviewFailed(selectedApplicant);

        if (success) {
            await fetchApplications();
            setIsFormModalOpen(false);
        }
    };

    // Filter data based on search term
    const filteredApplications = applications.filter(
        (applicant) =>
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

    // Sort applications
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

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleOpenApproveConfirmationModal = (applicant) => {
        setIsFormModalOpen(true);
        setSelectedApplicant(applicant);
        setAction("approve");
    };

    const handleOpenRejectConfirmationModal = (applicant) => {
        setIsFormModalOpen(true);
        setSelectedApplicant(applicant);
        setAction("reject");
    };

    const handleRefresh = async () => {
        await fetchApplications();
    };

    console.log(profilePics);

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    items={applications}
                    buttons={initialInterviewTableButtons}
                    label={"Initial Interview"}
                    placeholder={"applications"}
                    tab={activeTab}
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
                />

                <div className="overflow-x-auto rounded-[4px]">
                    <Table
                        tableHeaders={
                            activeTab === "Applicants"
                                ? interviewApplicationsTableHeaders
                                : interviewResultTableHeaders
                        }
                    >
                        {(() => {
                            switch (activeTab) {
                                case "Applicants":
                                    return (
                                        <ApplicantsTableRow
                                            currentItems={currentItems}
                                            profilePics={profilePics}
                                            onApprove={
                                                handleOpenApproveConfirmationModal
                                            }
                                            onReject={
                                                handleOpenRejectConfirmationModal
                                            }
                                            onSuccess={fetchApplications}
                                        />
                                    );

                                case "Result":
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

                {/* Pagination */}
                {sortedApplications.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={sortedApplications.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}

                {/* <FormModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    action={action}
                    label={"Confirmation"}
                    applicant={selectedApplicant}
                    setAction={setAction}
                    onSuccess={fetchApplications}
                /> */}

                <ConfirmationModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    isLoading={isLoading}
                    label={"Confirmation"}
                    message={
                        action === "approve"
                            ? "Are you sure you want to approve this applicant for the Initial Interview? This action cannot be undone."
                            : "Are you sure you want to reject this applicant from the Initial Interview? This action cannot be undone."
                    }
                    onClick={
                        action === "approve" ? handleApprove : handleReject
                    }
                />
            </div>
        </div>
    );
}
