import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { manageApplication } from "../../../services/applicationService";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { applicationButtons } from "../../../constant/tableToolbarButtons";
import { useApplicationRecords } from "../../../hooks/useApplicationRecords";
import TableToolbar from "../../../components/TableToolbar";
import { approvedApplicationTableHeaders } from "../../../constant/tableHeaders";
import Table from "../../../components/Table";
import TableRow from "../../../components/TableRow";
import PageContent from "../../../components/PageContent";

export default function ApplicationRecordsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("new");
    const [sortBy, setSortBy] = useState("newest");
    const [schoolYear, setSchoolYear] = useState("all_years");
    const [status, setStatus] = useState("all");

    const { applications, fetchApplications } = useApplicationRecords(
        activeTab,
        status,
        schoolYear,
        sortBy
    );
    const { fetchApplicantData } = useApplicantData();
    const { profilePics, fetchAllPics } = useProfilePicture(applications);
    const { viewPdf, downloadPdf } = usePdfActions(fetchApplicantData);

    useEffect(() => {
        fetchApplications();
        fetchAllPics();
    }, [activeTab, status, schoolYear, sortBy]);

    // Filter data based on search term
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

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchApplications();
    };

    return (
        <PageContent>
            <TableToolbar
                items={applications}
                label={"Applications Records"}
                placeholder={"applications"}
                tab={activeTab}
                buttons={applicationButtons}
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
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                        Filtered by status:
                    </span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
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
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">School Year:</span>
                    <select
                        value={schoolYear}
                        onChange={(e) => setSchoolYear(e.target.value)}
                        className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all_years">All Years</option>
                        <option value="2025-2026">2025-2026</option>
                        <option value="2024-2025">2024-2025</option>
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
            </TableToolbar>

            <div className="overflow-x-auto rounded-[4px]">
                <Table tableHeaders={approvedApplicationTableHeaders}>
                    {currentItems.map((info) => (
                        <TableRow key={info.application_id}>
                            <td className="py-3 whitespace-nowrap">
                                {info.application_id}
                            </td>
                            <td className="py-3 flex justify-start whitespace-nowrap">
                                <div className="w-[30%]"></div>
                                <div className="w-[max-content] flex items-center text-left gap-2">
                                    <img
                                        src={profilePics[info.application_id]}
                                        alt="Profile"
                                        className="w-10 h-10 object-cover rounded-full mx-auto"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-gray-600">
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
                            <td className="py-3 whitespace-nowrap text-xs">
                                {formatDateTime(info.created_at)}
                            </td>
                            <td className="py-3 whitespace-nowrap">
                                {formatDateTime(info.approved_at)}
                            </td>
                            <td className="py-3 whitespace-nowrap ">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg ${
                                        info.is_application_approved
                                            ? "bg-green-100 text-green-800"
                                            : info.is_application_rejected
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {info.is_application_approved
                                        ? "Approved"
                                        : info.is_application_rejected
                                        ? "Rejected"
                                        : "Pending"}
                                </span>
                            </td>
                            <td className="py-3 text-left whitespace-nowrap font-medium">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            viewPdf(info.application_id)
                                        }
                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                        title="View PDF"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() =>
                                            downloadPdf(info.application_id)
                                        }
                                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                        title="Download PDF"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </TableRow>
                    ))}
                </Table>

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState message="No applications found." />
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
}
