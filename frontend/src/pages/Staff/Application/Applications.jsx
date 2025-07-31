import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { manageApplication } from "../../../services/applicationService";
import { useApplications } from "../../../hooks/useApplications";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { usePdfActions } from "../../../hooks/usePdfActions";
import {
    applicationTableHeaders,
    renewalTableHeaders,
} from "../../../constant/tableHeaders";
import { applicationButtons } from "../../../constant/tableToolbarButtons";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { CheckCircle, DownloadIcon, Eye, XCircle } from "lucide-react";
import FormModal from "./FormModal";

export default function Applications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("new");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [action, setAction] = useState("");
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isRefresh, setIsRefresh] = useState(false);

    const { loading, error, applications, fetchApplications } =
        useApplications(activeTab);
    const { approveApplication, rejectApplication } = manageApplication();
    const { fetchApplicantData } = useApplicantData();
    const { profilePics, fetchAllPics } = useProfilePicture(applications);
    const { viewPdf, downloadPdf } = usePdfActions(fetchApplicantData);

    useEffect(() => {
        fetchApplications();
        fetchAllPics();
        setIsRefresh(false);
    }, [activeTab, isRefresh]);

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
        setIsRefresh(true);
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    items={applications}
                    label={"Applications"}
                    placeholder={"applications"}
                    tab={activeTab}
                    buttons={applicationButtons}
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
                            activeTab === "new"
                                ? applicationTableHeaders
                                : renewalTableHeaders
                        }
                    >
                        {currentItems.map((info) => (
                            <tr
                                key={info.application_id}
                                className={`border-b border-gray-100 transition-colors text-center hover:bg-gray-50 `}
                            >
                                <td className="py-3 whitespace-nowrap text-gray-900 font-bold">
                                    {info.application_id}
                                </td>
                                {activeTab === "old" && (
                                    <td className="py-3 whitespace-nowrap text-gray-900 font-bold">
                                        {info.scholar_id}
                                    </td>
                                )}
                                <td className="py-3 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[30%]"></div>
                                    <div className="w-[max-content] flex text-left gap-2">
                                        <img
                                            src={
                                                profilePics[info.application_id]
                                            }
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div>
                                            <p className="font-bold">
                                                {info.first_name +
                                                    " " +
                                                    info.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {info.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 whitespace-nowrap text-gray-500">
                                    {formatDateTime(info.created_at)}
                                </td>
                                <td className="py-3 whitespace-nowrap text-right font-medium">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() =>
                                                viewPdf(info.application_id)
                                            }
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="View PDF"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                downloadPdf(info.application_id)
                                            }
                                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                            title="Download PDF"
                                        >
                                            <DownloadIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOpenApproveModal(info)
                                            }
                                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                            disabled={loading}
                                            title="Approve"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOpenRejectModal(info)
                                            }
                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            disabled={loading}
                                            title="Reject"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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

                <FormModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    action={action}
                    label={"Confirmation"}
                    applicant={selectedApplicant}
                    setAction={setAction}
                    onSuccess={fetchApplications}
                />
            </div>
        </div>
    );
}
