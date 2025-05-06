import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDateTime } from "../../utils/formatDate";

export default function CreatedAccounts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const fetchAccountsData = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `http://localhost:8000/app/views/scholar-accounts.php`
            );
            setAccounts(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching accounts data:", err);
            setError("Failed to load accounts data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountsData();
    }, []);

    const sendCredentials = async () => {
        if (selectedAccounts.length === 0) {
            toast.error("Please select at least one account");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/app/views/send-credentials.php",
                {
                    accountIds: selectedAccounts,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Clear selections
                setSelectedAccounts([]);

                // Show success notification
                toast.success(
                    `Credentials sent to ${selectedAccounts.length} scholar(s)`
                );
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error sending credentials:", err);
            toast.error(
                "Failed to send credentials: " +
                    (err.response?.data?.message || err.message)
            );
            setLoading(false);
        }
    };

    const resetPassword = async (accountId) => {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/app/views/reset-password.php",
                {
                    accountId: accountId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Refresh data to get updated password
                await fetchAccountsData();

                // Show success notification
                toast.success(`Password reset for ${accountId}`);
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error resetting password:", err);
            toast.error(
                "Failed to reset password: " +
                    (err.response?.data?.message || err.message)
            );
            setLoading(false);
        }
    };

    // Toggle account selection
    const toggleAccountSelection = (accountId) => {
        setSelectedAccounts((prev) => {
            if (prev.includes(accountId)) {
                return prev.filter((id) => id !== accountId);
            } else {
                return [...prev, accountId];
            }
        });
    };

    // Select all visible accounts
    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.id);
        if (selectedAccounts.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedAccounts([]);
        } else {
            // Otherwise select all visible
            setSelectedAccounts(visibleIds);
        }
    };

    // Filter data based on search term
    const filteredAccounts = accounts.filter(
        (account) =>
            account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAccounts.slice(
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
                        Created Accounts
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
                            className="pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
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
                                            selectedAccounts.length ===
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
                                    Password
                                </th>
                                <th className="py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="py-3 text-center text-xs font-medium uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((account) => (
                                <tr
                                    key={account.id}
                                    className={`transition-colors text-center ${
                                        selectedAccounts.includes(account.id)
                                            ? "bg-green-50"
                                            : ""
                                    }`}
                                >
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            checked={selectedAccounts.includes(
                                                account.id
                                            )}
                                            onChange={() =>
                                                toggleAccountSelection(
                                                    account.id
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {account.id}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {account.name}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {account.email}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {account.password}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {account.created_at
                                            ? formatDateTime(account.created_at)
                                            : "--"}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() =>
                                                resetPassword(account.id)
                                            }
                                            disabled={loading}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Reset Password
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
                                No accounts found. Try adjusting your search.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredAccounts.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={sendCredentials}
                                disabled={
                                    selectedAccounts.length === 0 || loading
                                }
                                className={`px-4 py-2 rounded-md ${
                                    selectedAccounts.length === 0 || loading
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                {loading
                                    ? "Processing..."
                                    : "Send Credentials to Selected"}
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(indexOfLastItem, filteredAccounts.length)}{" "}
                            of {filteredAccounts.length} accounts
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
