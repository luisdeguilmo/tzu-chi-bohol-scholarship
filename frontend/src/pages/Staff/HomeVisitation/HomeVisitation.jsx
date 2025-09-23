import { useEffect, useState } from "react";
import { manageApplication } from "../../../services/emailService";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { usePdfActions } from "../../../hooks/usePdfActions";
import {
    homeVisitationResultTableHeaders,
    homeVisitationTableHeaders,
} from "../../../constant/tableHeaders";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import FormModal from "../Application/FormModal";
import { useHomeVisitation } from "../../../hooks/useHomeVisitation";
import { homeVisitationTableButtons } from "../../../constant/tableToolbarButtons";
import ApplicantsTableRow from "./ApplicantsTableRow";
import ResultTableRow from "./ResultTableRow";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function HomeVisitation() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Applicants");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [action, setAction] = useState("");
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const { loading, error, applications, fetchApplications } =
        useHomeVisitation(activeTab);
    const { fetchApplicantData } = useApplicantData();
    const { profilePics, fetchAllPics } = useProfilePicture(applications);
    const { viewPdf, downloadPdf } = usePdfActions(fetchApplicantData);

    useEffect(() => {
        fetchApplications();
    }, [activeTab]);

    const {
        isLoading,
        updateStatusToHomeVisitationPassed,
        updateStatusToHomeVisitationFailed,
    } = manageApplication();

    const handleApprove = async () => {
        const success = await updateStatusToHomeVisitationPassed(
            selectedApplicant
        );

        if (success) {
            await fetchApplications();
            setIsFormModalOpen(false);
        }
    };

    const handleReject = async () => {
        const success = await updateStatusToHomeVisitationFailed(
            selectedApplicant
        );

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

    const handleOpenApproveModal = (applicant) => {
        setIsFormModalOpen(true);
        setSelectedApplicant(applicant);
        setAction("approve");
    };

    const handleOpenRejectModal = (applicant) => {
        setIsFormModalOpen(true);
        setSelectedApplicant(applicant);
        setAction("reject");
    };

    const handleRefresh = () => {
        // setIsRefresh(true);
    };

    console.log(profilePics);

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    items={applications}
                    label={"Home Visitation"}
                    buttons={homeVisitationTableButtons}
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
                                ? homeVisitationTableHeaders
                                : homeVisitationResultTableHeaders
                        }
                    >
                        {(() => {
                            switch (activeTab) {
                                case "Applicants":
                                    return (
                                        <ApplicantsTableRow
                                            currentItems={currentItems}
                                            profilePics={profilePics}
                                            onApprove={handleOpenApproveModal}
                                            onReject={handleOpenRejectModal}
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
                            ? "Are you sure you want to approve this applicant for Home Visitation? This action cannot be undone."
                            : "Are you sure you want to reject this applicant from the Home Visitation? This action cannot be undone."
                    }
                    onClick={
                        action === "approve" ? handleApprove : handleReject
                    }
                />
            </div>
        </div>
    );
}
