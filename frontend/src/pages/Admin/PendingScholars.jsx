import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PendingScholars() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedScholars, setSelectedScholars] = useState([]);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scholars, setScholars] = useState([]);

    const fetchScholarsData = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `http://localhost:8000/app/views/scholar-accounts.php?application_status=Pending`
            );
            setScholars(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching scholars data:", err);
            setError("Failed to load scholars data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarsData();
    }, []);

    const createAccounts = async () => {
        if (selectedScholars.length === 0) {
            toast.error("Please select at least one scholar");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/app/views/scholar-accounts.php",
                {
                    applicationIds: selectedScholars,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Refresh the data after account creation
                await fetchScholarsData();

                // Clear selections
                setSelectedScholars([]);

                // Show success notification
                toast.success(
                    `Successfully created ${selectedScholars.length} account(s)`
                );
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error creating accounts:", err);
            toast.error(
                "Failed to create accounts: " +
                    (err.response?.data?.message || err.message)
            );
            setLoading(false);
        }
    };

    // Toggle scholar selection
    const toggleScholarSelection = (scholarId) => {
        setSelectedScholars((prev) => {
            if (prev.includes(scholarId)) {
                return prev.filter((id) => id !== scholarId);
            } else {
                return [...prev, scholarId];
            }
        });
    };

    // Select all visible scholars
    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.id);
        if (selectedScholars.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedScholars([]);
        } else {
            // Otherwise select all visible
            setSelectedScholars(visibleIds);
        }
    };

    // Filter data based on search term
    const filteredScholars = scholars.filter(
        (scholar) =>
            scholar.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            scholar.created_at
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            scholar.approved_at
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredScholars.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredScholars.slice(
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

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Pending Scholars
                    </h2>

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
                            placeholder="Search by name, email or ID..."
                            className="pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blgreene-300 focus:border-green-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px] border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-100 text-green-800">
                            <tr>
                                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        checked={
                                            currentItems.length > 0 &&
                                            selectedScholars.length ===
                                                currentItems.length
                                        }
                                        onChange={selectAllVisible}
                                    />
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((scholar) => (
                                <tr
                                    key={scholar.application_id}
                                    className={`transition-colors text-center ${
                                        selectedScholars.includes(
                                            scholar.application_id
                                        )
                                            ? "bg-green-50"
                                            : ""
                                    }`}
                                >
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            checked={selectedScholars.includes(
                                                scholar.application_id
                                            )}
                                            onChange={() =>
                                                toggleScholarSelection(
                                                    scholar.application_id
                                                )
                                            }
                                            disabled={
                                                scholar.application_status !==
                                                "Pending"
                                            }
                                        />
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {scholar.application_id}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {scholar.first_name}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {scholar.email}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
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
                                No scholars found. Try adjusting your search.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredScholars.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={createAccounts}
                                disabled={
                                    selectedScholars.length === 0 || loading
                                }
                                className={`px-4 py-2 rounded-md ${
                                    selectedScholars.length === 0 || loading
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                {loading
                                    ? "Processing..."
                                    : "Create Selected Accounts"}
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(indexOfLastItem, filteredScholars.length)}{" "}
                            of {filteredScholars.length} scholars
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${
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
                                className={`px-4 py-2 rounded-md ${
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
    );
}
