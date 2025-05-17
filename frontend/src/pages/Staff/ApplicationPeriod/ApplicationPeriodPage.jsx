import { useState, useEffect } from "react";
import axios from "axios";
import { formatDateTime } from "../../../utils/formatDate";
import ApplicationPeriodEditForm from "./ApplicationPeriodEditForm";
import ApplicationPeriodForm from "./ApplicationPeriodForm";

export default function ApplicationPeriodPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 5;

    const [applicationPeriods, setApplicationPeriods] = useState([]);
    const [hasActiveApplicationPeriod, setHasActiveApplicationPeriod] =
        useState(false);
    const [editingPeriod, setEditingPeriod] = useState(null);

    const fetchApplicationPeriods = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/application-periods.php`
            );
            // Set application periods data
            setApplicationPeriods(response.data.data || []);
            // Set active application period flag
            setHasActiveApplicationPeriod(
                response.data.hasActiveApplicationPeriod || false
            );
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    console.log(applicationPeriods);

    // Filter data based on search term
    const filteredApplicationPeriods = applicationPeriods.filter(
        (application) =>
            application.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(
        filteredApplicationPeriods.length / itemsPerPage
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplicationPeriods.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Handle page changes
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Handle edit action
    const handleEdit = (applicationPeriod) => {
        setEditingPeriod(applicationPeriod);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Application Period
            </h2>
            <div className="flex gap-4">
                {editingPeriod ? (
                    <ApplicationPeriodEditForm
                        applicationPeriod={editingPeriod}
                        onSuccess={() => {
                            fetchApplicationPeriods();
                            setEditingPeriod(null);
                        }}
                        onCancel={() => setEditingPeriod(null)}
                    />
                ) : (
                    <ApplicationPeriodForm
                        onSuccess={fetchApplicationPeriods}
                        disabled={hasActiveApplicationPeriod}
                    />
                )}
                <div className="w-[70%] mx-auto bg-white rounded-md shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            Previous Online Application Periods
                        </h3>

                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by status..."
                                className="pl-10 p-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-md border border-gray-200">
                        <table className="w-[1300px] divide-y divide-gray-200">
                            <thead className="bg-green-100 text-green-800">
                                <tr className="text-center">
                                    <th
                                        scope="col"
                                        className="py-3 text-xs font-medium uppercase tracking-wider"
                                    >
                                        Start Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-xs font-medium uppercase tracking-wider"
                                    >
                                        End Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-xs font-medium uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-xs font-medium uppercase tracking-wider"
                                    >
                                        Message
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-xs font-medium uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((application) => (
                                    <tr
                                        key={application.id}
                                        className="hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(
                                                application.start_date
                                            )}
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(
                                                application.end_date
                                            )}
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    application.status ===
                                                    "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : application.status ===
                                                          "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            {application.announcement_message}
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-sm font-medium">
                                            {application.editable ? (
                                                <button
                                                    onClick={() =>
                                                        handleEdit(application)
                                                    }
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
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                    Edit
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">
                                                    Edit not available for this
                                                    application
                                                </span>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleEdit(application)
                                                }
                                                className="inline-flex items-center text-red-600 hover:text-red-900 mr-3"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                                                    />
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty state */}
                        {currentItems.length === 0 && (
                            <div className="text-center py-10">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="mt-2 text-gray-500">
                                    No application periods found. Try adjusting
                                    your search or create a new application
                                    period.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredApplicationPeriods.length > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstItem + 1}-
                                {Math.min(
                                    indexOfLastItem,
                                    filteredApplicationPeriods.length
                                )}{" "}
                                of {filteredApplicationPeriods.length}{" "}
                                application periods
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-sm ${
                                        currentPage === 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={goToNextPage}
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                    className={`px-4 py-2 rounded-sm ${
                                        currentPage === totalPages ||
                                        totalPages === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}