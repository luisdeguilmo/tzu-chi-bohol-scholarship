import { useState } from "react";

export default function Archive() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const archiveDocuments = [
        {
            id: 1,
            date: "2025-06-05",
            time: "10:00 AM",
            documentType: "COA",
        },
        {
            id: 2,
            date: "2025-06-05",
            time: "8:00 AM",
            documentType: "COE",
        },
        {
            id: 3,
            date: "2025-06-05",
            time: "2:00 PM",
            documentType: "Grades",
        },
    ];

    // const handleDelete = (id) => {
    //     const updatedDocuments = events.filter((event) => event.id !== event);
    //     setDocuments(updatedDocuments);
    // };

    // Filter data based on search term
    const filteredDocuments = archiveDocuments.filter(
        (document) =>
            document.documentType
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            document.date.includes(searchTerm)
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDocuments.slice(
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
            <div className="max-w-7xl mx-auto bg-white rounded-md shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Archived Documents
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
                            placeholder="Search documents..."
                            className="pl-10 p-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-100 text-green-800">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Time
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Document Type
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((event) => (
                                <tr
                                    key={event.id}
                                    className="hover:bg-gray-50 transition-colors text-center"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.documentType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            // onClick={() => handleView(coa)}
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
                                            View
                                        </button>
                                        <button
                                            // onClick={() => handleView(coa)}
                                            className="inline-flex items-center text-green-600 hover:text-blue-900 mr-3"
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
                                            Restore
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
                                No documents found. Try adjusting your search or
                                upload a new document.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredDocuments.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(indexOfLastItem, filteredDocuments.length)}{" "}
                            of {filteredDocuments.length} archived documents
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
    );
}
