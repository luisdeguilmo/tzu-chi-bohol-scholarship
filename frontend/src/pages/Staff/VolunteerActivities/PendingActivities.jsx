import { useEffect, useState } from "react";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { formatDateTime } from "../../../utils/formatDateTime";
import { manageApplication } from "../../../services/applicationService";
import SearchInput from "../../../components/SearchInput";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useScholarsAndActivities } from "../../../hooks/useScholarsAndActivities";
import ViewDetails from "./ViewDetails";

export default function PendingActivities() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const itemsPerPage = 5;

    const { scholars, fetchScholars } = useScholarsAndActivities("pending");
    const { approveApplication, rejectApplication } = manageApplication();

    // Filter data based on search term
    const filteredApplications = scholars.filter(
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

    const handleViewDetails = (scholar) => {
        setIsOpen(true);
        setSelectedScholar(scholar);
    };

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Applications
                    </h2>

                    {/* Search */}
                    <SearchInput
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search applications..."}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px] border border-gray-200">
                    <table className="w-[1160px] divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-800 font-bold">
                            <tr>
                                {/* <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Application ID
                                </th> */}
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
                                    {/* <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.application_id}
                                    </td> */}
                                    <td className="py-3 whitespace-nowrap text-sm text-gray-500">
                                        {info.last_name +
                                            ", " +
                                            info.middle_name +
                                            ", " +
                                            info.first_name}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 pr-10 whitespace-nowrap text-right font-medium">
                                        {/* <ApplicationFormPDF
                                            studentId={info.application_id}
                                        /> */}
                                        <button
                                            onClick={() => handleViewDetails(info)}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
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
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            View Details
                                        </button>
                                        <button
                                            // onClick={() =>
                                            //     approveApplication(
                                            //         info.application_id,
                                            //         applications,
                                            //         fetchApplications
                                            //     )
                                            // }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            // disabled={loading}
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
                                            // onClick={() =>
                                            //     rejectApplication(
                                            //         info.application_id,
                                            //         applications,
                                            //         fetchApplications
                                            //     )
                                            // }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            // disabled={loading}
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

            <ViewDetails isOpen={isOpen} setIsOpen={setIsOpen} scholar={selectedScholar} />
        </div>
    );
}
