import { useState, useEffect, useMemo } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { useApprovedApplications } from "../../../hooks/useApprovedApplications";
import Pagination from "../../../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { usePdfActions } from "../../../hooks/usePdfActions";
import {
    approvedApplicationTableHeaders,
    approvedRenewalApplicationTableHeaders,
} from "../../../constant/tableHeaders";
import { applicationButtons } from "../../../constant/tableToolbarButtons";
import TableToolbar from "../../../components/TableToolbar";
import { Download, DownloadIcon, Eye } from "lucide-react";
import Table from "../../../components/Table";
import EmptyState from "../../../components/EmptyState";
import PageContent from "../../../components/PageContent";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { TableButtonAction } from "../../../components/TableButtonAction";

const ReviewedApplications = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("new");
    const [sortBy, setSortBy] = useState("newest");
    const [tableHeaders, setTableHeaders] = useState([]);

    const { loading, applications, fetchApplications } =
        useApprovedApplications();
    const { fetchApplicantData } = useApplicantData();
    const { viewPdf, downloadPdf } = usePdfActions(
        activeTab,
        fetchApplicantData,
    );
    const size = useWindowSize();
    const isMobile = size.width < 768;

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

        return (
            applicant.last_name.toLowerCase().includes(term) ||
            applicant.middle_name.toLowerCase().includes(term) ||
            applicant.first_name.toLowerCase().includes(term) ||
            applicant.created_at.includes(term)
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

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        fetchApplications(tab);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchApplications(activeTab);
        setSelectedItems([]);
    };

    useMemo(() => {
        setTableHeaders(
            activeTab === "new"
                ? approvedApplicationTableHeaders
                : approvedRenewalApplicationTableHeaders,
        );
    }, [activeTab]);

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

            <div
                className={`${isMobile && "flex flex-col gap-2"} overflow-x-auto rounded-[4px]`}
            >
                {isMobile ? (
                    currentItems.map((item, index) => (
                        <div className="p-4 border rounded-md bg-gray-50">
                            <p className="mb-2 font-normal text-gray-600">
                                <div className="w-[max-content] flex items-center text-left gap-2">
                                    <img
                                        src={item[0].profile}
                                        alt="Profile"
                                        className="w-10 h-10 object-cover rounded-full mx-auto"
                                    />
                                    <div>
                                        <p className="font-bold text-xs">
                                            {item.last_name +
                                                ", " +
                                                item.first_name}{" "}
                                            {item.middle_name
                                                ? item.middle_name[0] + "."
                                                : ""}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.email}
                                        </p>
                                    </div>
                                </div>
                            </p>
                            <div key={index} className="flex gap-6 ">
                                <div className="space-y-2">
                                    {tableHeaders
                                        .filter(
                                            (item) =>
                                                item.name !== "Applicant" &&
                                                item.name !== "Scholar",
                                        )
                                        .map((header, index) => (
                                            <p
                                                key={index}
                                                className="text-xs font-bold text-gray-800"
                                            >
                                                {header.name}
                                            </p>
                                        ))}
                                </div>
                                <div className="text-xs space-y-2">
                                    <p className="font-normal text-gray-600">
                                        {item.application_id}
                                    </p>
                                    {activeTab === "old" && (
                                        <p className="text-gray-600">
                                            {item.scholar_id}
                                        </p>
                                    )}
                                    <p className="whitespace-nowrap text-gray-500">
                                        <span
                                            className={`inline-flex items-center px-2.5 rounded-lg font-medium ${
                                                item.is_application_approved
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {item.is_application_approved
                                                ? "Approved"
                                                : item.is_application_rejected
                                                  ? "Rejected"
                                                  : "--"}
                                        </span>
                                    </p>
                                    <p className="font-normal text-gray-600">
                                        {formatDateTime(item.created_at)}
                                    </p>
                                    <p className="font-normal text-gray-600">
                                        {formatDateTime(item.approved_at)}
                                    </p>

                                    <TableButtonAction
                                        onClick={() =>
                                            viewPdf({
                                                applicationId:
                                                    item.application_id,
                                                scholarId: item.scholar_id,
                                            })
                                        }
                                        button={{
                                            title: "View PDF",
                                            icon: <Eye className="w-4 h-4" />,
                                            color: "blue",
                                        }}
                                    />
                                    <TableButtonAction
                                        onClick={() =>
                                            downloadPdf({
                                                applicationId:
                                                    item.application_id,
                                                scholarId: item.scholar_id,
                                            })
                                        }
                                        button={{
                                            title: "Download PDF",
                                            icon: (
                                                <DownloadIcon className="w-4 h-4" />
                                            ),
                                            color: "red",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <Table
                        tableHeaders={
                            activeTab === "new"
                                ? approvedApplicationTableHeaders
                                : approvedRenewalApplicationTableHeaders
                        }
                    >
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
                                <tr
                                    key={info.application_id}
                                    className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-2.5 whitespace-nowrap text-gray-600 font-bold">
                                        {info.application_id}
                                    </td>
                                    {activeTab === "old" && (
                                        <td className="py-2.5 whitespace-nowrap text-gray-600 font-bold">
                                            {info.scholar_id}
                                        </td>
                                    )}
                                    <td className="py-2.5 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                        <div className="w-[30%]"></div>
                                        <div className="w-[max-content] flex text-left gap-2">
                                            <img
                                                src={info[0].profile}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                            />
                                            <div>
                                                <p className="font-bold text-xs">
                                                    {info.last_name +
                                                        ", " +
                                                        info.first_name}{" "}
                                                    {info.middle_name
                                                        ? info.middle_name[0] +
                                                          "."
                                                        : ""}
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    {info.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap text-gray-500">
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
                                            onClick={() =>
                                                viewPdf({
                                                    applicationId:
                                                        info.application_id,
                                                    scholarId: info.scholar_id,
                                                })
                                            }
                                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                downloadPdf({
                                                    applicationId:
                                                        info.application_id,
                                                    scholarId: null,
                                                })
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </Table>
                )}

                {/* Empty state */}
                {currentItems.length === 0 && !loading && (
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
