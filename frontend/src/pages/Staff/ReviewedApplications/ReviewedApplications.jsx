import { useState, useEffect } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { useApprovedApplications } from "../../../hooks/useApprovedApplications";
import Pagination from "../../../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { approvedApplicationTableHeaders } from "../../../constant/tableHeaders";
import { applicationButtons } from "../../../constant/tableToolbarButtons";
import TableToolbar from "../../../components/TableToolbar";
import { Download, DownloadIcon, Eye } from "lucide-react";
import Table from "../../../components/Table";
import EmptyState from "../../../components/EmptyState";
import PageContent from "../../../components/PageContent";

const ReviewedApplications = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("new");
    const [sortBy, setSortBy] = useState("newest");
    const { applications, fetchApplications } = useApprovedApplications();
    const { fetchApplicantData } = useApplicantData();
    const { profilePics, fetchAllPics } = useProfilePicture(
        applications,
        "profile-picture"
    );
    const { viewPdf, downloadPdf } = usePdfActions(fetchApplicantData);

    useEffect(() => {
        fetchAllPics();
    }, []);

    // Filter data based on search term
    const filteredApplications = applications.filter((applicant) => {
        const term = searchTerm.trim().toLowerCase();

        // Filter by status: approved
        if ("red".includes(term)) {
            return (
                applicant.is_application_approved === 1 ||
                applicant.is_application_rejected === 1
            );
        }

        if ("approved".includes(term)) {
            return applicant.is_application_approved === 1;
        }

        // Filter by status: rejected
        if ("rejected".includes(term)) {
            return applicant.is_application_rejected === 1;
        }

        // General search by name or date
        return (
            applicant.last_name.toLowerCase().includes(term) ||
            applicant.middle_name.toLowerCase().includes(term) ||
            applicant.first_name.toLowerCase().includes(term) ||
            applicant.created_at.includes(term)
        );
    });

    console.log(filteredApplications);

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
        fetchApplications(tab);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchApplications(activeTab);
        setSelectedItems([]);
    };

    return (
        <PageContent>
            <TableToolbar
                items={applications}
                label={"Reviewed Applications"}
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
                onChangeCurrentPage={setCurrentPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
            />

            <div className="overflow-x-auto rounded-[4px]">
                <Table tableHeaders={approvedApplicationTableHeaders}>
                    {currentItems.map((info) => (
                        <tr
                            key={info.application_id}
                            className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                        >
                            <td className="py-2 whitespace-nowrap text-gray-600 font-bold">
                                {info.application_id}
                            </td>
                            <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                <div className="w-[30%]"></div>
                                <div className="w-[max-content] flex text-left gap-2">
                                    <img
                                        src={profilePics[info.application_id]}
                                        alt="Profile"
                                        className="w-10 h-10 object-cover rounded-full mx-auto"
                                    />
                                    <div>
                                        <p className="font-bold text-xs">
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
                            <td className="py-2 whitespace-nowrap text-gray-500">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium ${
                                        info.is_application_approved
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {info.is_application_approved
                                        ? "Approved"
                                        : info.is_application_rejected
                                          ? "Rejected"
                                          : "--"}
                                </span>
                            </td>
                            <td className="py-2 whitespace-nowrap text-gray-500 text-xs">
                                {formatDateTime(info.created_at)}
                            </td>
                            <td className="py-2 whitespace-nowrap text-gray-500 text-xs">
                                {info.approved_at
                                    ? formatDateTime(info.approved_at)
                                    : "--"}
                            </td>
                            <td className="py-2 whitespace-nowrap font-medium">
                                <button
                                    onClick={() => viewPdf(info.application_id)}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        downloadPdf(info.application_id)
                                    }
                                    className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState message="No approved applications found." />
                )}
            </div>

            {/* Pagination */}
            {filteredApplications.length > 0 && (
                <div className="flex justify-between items-center mt-6">
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
        </PageContent>
    );
};

export default ReviewedApplications;
