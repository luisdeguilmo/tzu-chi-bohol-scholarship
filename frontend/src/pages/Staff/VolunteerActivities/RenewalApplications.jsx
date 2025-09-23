import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useApplications } from "../../../hooks/useApplications";
import { manageApplication } from "../../../services/applicationService";
import { usePagination } from "../../../hooks/usePagination";
import SearchInput from "../../../components/SearchInput";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";

export default function RenewalApplications() {
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    const { loading, error, applications, fetchApplications } =
        useApplications("Old");
    const { approveApplication, rejectApplication } = manageApplication();

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

    // Calculate pagination
    const {
        currentItems,
        currentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(filteredApplications, itemsPerPage);

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Applications
                    </h2>

                    {/* Search */}
                    <div className="relative">
                        <SearchInput
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            placeholder={"Search applications..."}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px] border border-gray-200">
                    <table className="w-[1160px] divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-800 font-bold">
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Application ID
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Date Applied
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 pr-32 text-right text-xs uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-xs">
                            {currentItems.map((info) => (
                                <tr
                                    key={info.application_id}
                                    className="transition-colors text-center"
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.application_id}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium text-gray-500">
                                        {info.last_name +
                                            ", " +
                                            info.middle_name +
                                            ", " +
                                            info.first_name}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 pr-10 text-right whitespace-nowrap font-medium">
                                        <ApplicationFormPDF
                                            studentId={info.application_id}
                                        />
                                        <button
                                            onClick={() =>
                                                approveApplication(
                                                    info.application_id,
                                                    applications,
                                                    fetchApplications
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            disabled={loading}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Approve
                                        </button>
                                        <button
                                            onClick={() =>
                                                rejectApplication(
                                                    info.application_id,
                                                    applications,
                                                    fetchApplications
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            disabled={loading}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
            </div>
        </div>
    );
}
