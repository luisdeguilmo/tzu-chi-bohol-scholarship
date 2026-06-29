import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { applicationButtons } from "../../../constant/tableToolbarButtons";
import { useApplicationRecords } from "../../../hooks/useApplicationRecords";
import TableToolbar from "../../../components/TableToolbar";
import { applicationRecordsTableHeaders } from "../../../constant/tableHeaders";
import Table from "../../../components/Table";
import TableRow from "../../../components/TableRow";
import PageContent from "../../../components/PageContent";
import ApplicantDetailsModal from "./ApplicantDetailsModal";
import { Loader2 } from "lucide-react";
import PageLoader from "../../../components/PageLoader";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

export default function ApplicationRecordsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("new");
    const [sortBy, setSortBy] = useState("newest");
    const [status, setStatus] = useState("all_years");

    const { schoolYears, activeSchoolYear } = useSchoolYearContext();

    const [schoolYear, setSchoolYear] = useState(activeSchoolYear || "all_years");

    const { loading, applications, fetchApplications } = useApplicationRecords(
        activeTab,
        status,
        schoolYear,
        sortBy,
    );

    const { fetchApplicantData } = useApplicantData();
    const { viewPdf, downloadPdf } = usePdfActions(
        activeTab,
        fetchApplicantData,
    );

    useEffect(() => {
        fetchApplications();
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

    console.log(applications);

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
        setCurrentPage(1);
    };

    return (
        <PageContent>
            <TableToolbar
                items={applications}
                label={"Application Records"}
                placeholder={"applications"}
                tab={activeTab}
                buttons={applicationButtons}
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
            >
                <div className="flex justify-between items-center gap-2">
                    <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                        Status:
                    </span>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        {activeTab === "new" ? (
                            schoolYear === activeSchoolYear ? (
                                <>
                                    <option value="all">All</option>
                                    <option value="fully_qualified">
                                        Fully Qualified
                                    </option>
                                    <option value="application_approved">
                                        Application Approved
                                    </option>
                                    <option value="entrance_examination_passed">
                                        Entrance Examination Passed
                                    </option>
                                    <option value="initial_interview_passed">
                                        Initial Interview Passed
                                    </option>
                                    <option value="home_visitation_qualified">
                                        Home Visitation Qualified
                                    </option>{" "}
                                    <option value="final_interview_passed">
                                        Final Interview Passed
                                    </option>
                                    <option value="attended_orientation">
                                        Attended Orientation
                                    </option>
                                    {/* <option value="attended_awarding">
                                        Attended Awarding
                                    </option> */}
                                    <option value="application_rejected">
                                        Application Rejected
                                    </option>
                                    <option value="entrance_examination_failed">
                                        Entrance Examination Failed
                                    </option>
                                    <option value="initial_interview_failed">
                                        Initial Interview Failed
                                    </option>
                                    <option value="home_visitation_not_qualified">
                                        Home Visitation Not Qualified
                                    </option>{" "}
                                    <option value="final_interview_failed">
                                        Final Interview Failed
                                    </option>
                                    <option value="not_attended_orientation">
                                        Not Attended Orientation
                                    </option>
                                    <option value="not_attended_awarding">
                                        Not Attended Awarding
                                    </option>
                                </>
                            ) : (
                                <>
                                    <option value="all">All</option>
                                    <option value="pending">Closed</option>
                                    <option value="fully_qualified">
                                        Fully Qualified
                                    </option>
                                    <option value="application_rejected">
                                        Application Rejected
                                    </option>
                                    <option value="entrance_examination_failed">
                                        Entrance Examination Failed
                                    </option>
                                    <option value="initial_interview_failed">
                                        Initial Interview Failed
                                    </option>
                                    <option value="home_visitation_not_qualified">
                                        Home Visitation Not Qualified
                                    </option>{" "}
                                    <option value="final_interview_failed">
                                        Final Interview Failed
                                    </option>
                                    <option value="not_attended_orientation">
                                        Not Attended Orientation
                                    </option>
                                    <option value="not_attended_awarding">
                                        Not Attended Awarding
                                    </option>
                                </>
                            )
                        ) : (
                            <>
                                <option value="all">All</option>
                                <option value="application_approved">
                                    Approved
                                </option>
                                <option value="application_rejected">
                                    Rejected
                                </option>
                                <option value="pending">Pending</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                        School Year:
                    </span>
                    <select
                        value={schoolYear}
                        onChange={(e) => {
                            setSchoolYear(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all_years">All Years</option>
                        {schoolYears.map((schoolYear) => (
                            <option
                                key={schoolYear.id}
                                value={schoolYear.school_year}
                            >
                                {schoolYear.school_year}
                            </option>
                        ))}
                    </select>
                </div>
            </TableToolbar>

            <div className="overflow-x-auto rounded-[4px]">
                <Table tableHeaders={applicationRecordsTableHeaders}>
                    {loading && (
                        <tr>
                            <td colSpan={6} className="p-6">
                                <div className="mt-4 flex flex-col items-center gap-4">
                                    <div className="flex items-end gap-1 h-10">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 bg-emerald-500 rounded-full animate-bounce"
                                                style={{
                                                    height: "10px",
                                                    animationDelay: `${i * 100}ms`,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-sm text-slate-500">
                                        Loading data...
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        currentItems.map((info) => (
                            <TableRow key={info.application_id}>
                                <td className="py-2.5 whitespace-nowrap font-bold text-gray-700">
                                    {info.application_id}
                                </td>
                                <td className="py-2.5 flex justify-start whitespace-nowrap">
                                    <div className="w-[20%]"></div>
                                    <div className="w-[max-content] flex items-center text-left gap-2">
                                        <img
                                            src={info[0]?.profile}
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">
                                                {info.last_name +
                                                    ", " +
                                                    info.first_name}{" "}
                                                {info.middle_name
                                                    ? info.middle_name[0] + "."
                                                    : ""}
                                            </p>
                                            <p className="text-[11px] text-gray-500/90">
                                                {info.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2.5 whitespace-nowrap">
                                    {info.school_year}
                                </td>

                                {activeTab === "new" ? (
                                    <>
                                        {info.school_year === activeSchoolYear ? (
                                            <td className="py-2.5 whitespace-nowrap text-xs">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg ${
                                                        info.is_attended_awarding
                                                            ? "bg-green-100 text-green-800"
                                                            : info.is_not_attended_awarding
                                                              ? "bg-red-100 text-red-800"
                                                              : info.is_attended_orientation
                                                                ? "bg-green-100 text-green-800"
                                                                : info.is_not_attended_orientation
                                                                  ? "bg-red-100 text-red-800"
                                                                  : info.is_final_interview_passed
                                                                    ? "bg-green-100 text-green-800"
                                                                    : info.is_final_interview_failed
                                                                      ? "bg-red-100 text-red-800"
                                                                      : info.is_home_visitation_qualified
                                                                        ? "bg-green-100 text-green-800"
                                                                        : info.is_home_visitation_not_qualified
                                                                          ? "bg-red-100 text-red-800"
                                                                          : info.is_initial_interview_passed
                                                                            ? "bg-green-100 text-green-800"
                                                                            : info.is_initial_interview_failed
                                                                              ? "bg-red-100 text-red-800"
                                                                              : info.is_examination_passed
                                                                                ? "bg-green-100 text-green-800"
                                                                                : info.is_examination_failed
                                                                                  ? "bg-red-100 text-red-800"
                                                                                  : info.is_application_approved
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : info.is_application_rejected
                                                                                      ? "bg-red-100 text-red-800"
                                                                                      : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {info.is_attended_awarding
                                                        ? "Fully Qualified"
                                                        : info.is_not_attended_awarding
                                                          ? "Not Attended Awarding"
                                                          : info.is_attended_orientation
                                                            ? "Attended Orientation"
                                                            : info.is_not_attended_orientation
                                                              ? "Not Attended Orientation"
                                                              : info.is_final_interview_passed
                                                                ? "Final Interview Passed"
                                                                : info.is_final_interview_failed
                                                                  ? "Final Interview Failed"
                                                                  : info.is_home_visitation_qualified
                                                                    ? "Home Visitation Qualified"
                                                                    : info.is_home_visitation_not_qualified
                                                                      ? "Home Visitation Not Qualified"
                                                                      : info.is_initial_interview_passed
                                                                        ? "Initial Interview Passed"
                                                                        : info.is_initial_interview_failed
                                                                          ? "Initial Interview Failed"
                                                                          : info.is_examination_passed
                                                                            ? "Entrance Examination Passed"
                                                                            : info.is_examination_failed
                                                                              ? "Entrance Examination Failed"
                                                                              : info.is_application_approved
                                                                                ? "Application Approved"
                                                                                : info.is_application_rejected
                                                                                  ? "Application Rejected"
                                                                                  : "Pending"}
                                                </span>
                                            </td>
                                        ) : (
                                            <td className="py-1 whitespace-nowrap text-xs">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg ${
                                                        info.is_attended_awarding
                                                            ? "bg-green-100 text-green-800"
                                                            : info.is_not_attended_awarding
                                                              ? "bg-red-100 text-red-800"
                                                              : info.is_not_attended_orientation
                                                                ? "bg-red-100 text-red-800"
                                                                : info.is_final_interview_failed
                                                                  ? "bg-red-100 text-red-800"
                                                                  : info.is_home_visitation_not_qualified
                                                                    ? "bg-red-100 text-red-800"
                                                                    : info.is_interview_failed
                                                                      ? "bg-red-100 text-red-800"
                                                                      : info.is_examination_failed
                                                                        ? "bg-red-100 text-red-800"
                                                                        : info.is_application_rejected
                                                                          ? "bg-red-100 text-red-800"
                                                                          : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {info.is_attended_awarding
                                                        ? "Fully Qualified"
                                                        : info.is_not_attended_awarding
                                                          ? "Not Attended Awarding"
                                                          : info.is_not_attended_orientation
                                                            ? "Not Attended Orientation"
                                                            : info.is_final_interview_failed
                                                              ? "Final Interview Failed"
                                                              : info.is_home_visitation_not_qualified
                                                                ? "Home Visitation Not Qualified"
                                                                : info.is_initial_interview_failed
                                                                  ? "Initial Interview Failed"
                                                                  : info.is_examination_failed
                                                                    ? "Entrance Examination Failed"
                                                                    : info.is_application_rejected
                                                                      ? "Application Rejected"
                                                                      : "Closed"}
                                                </span>
                                            </td>
                                        )}
                                    </>
                                ) : (
                                    <td className="py-1 whitespace-nowrap text-xs">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg ${
                                                info.is_application_approved
                                                    ? "bg-red-100 text-red-800"
                                                    : info.is_application_rejected
                                                      ? "bg-red-100 text-red-800"
                                                      : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {info.is_application_approved
                                                ? "Application Approved"
                                                : info.is_application_rejected
                                                  ? "Application Rejected"
                                                  : "Pending"}
                                        </span>
                                    </td>
                                )}

                                <td className="py-2 whitespace-nowrap text-gray-500 text-xs">
                                    {formatDateTime(info.created_at)}
                                </td>
                                {/* <td className="py-2 whitespace-nowrap">
                                {formatDateTime(info.updated_at) || "--"}
                            </td> */}

                                <td className="py-2 text-left whitespace-nowrap font-medium">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => {
                                                // viewPdf(
                                                //     info.application_id ||
                                                //         info.scholar_id
                                                // )
                                                setSelectedScholar(info);
                                                setIsModalOpen(true);
                                            }}
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
                                                downloadPdf({
                                                    applicationId:
                                                        info.application_id,
                                                    scholarId: info.scholar_id,
                                                })
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
                {currentItems.length === 0 && !loading && (
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

            {isModalOpen && (
                <ApplicantDetailsModal
                    schoolYear={schoolYear}
                    label={"Applicant Details"}
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
                    applicant={selectedScholar}
                    viewPdf={viewPdf}
                    downloadPdf={downloadPdf}
                />
            )}
        </PageContent>
    );
}
