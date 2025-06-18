import { useState, useEffect } from "react";
import axios from "axios";
import { formatDateTime } from "../../../utils/formatDateTime";
import EventForm from "./EventForm";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 5;

    const [events, setEvents] = useState([]);
    const [editingPeriod, setEditingPeriod] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/events.php`
            );
            // Set application periods data
            setEvents(response.data.data || []);
            // Set active application period flag
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
        fetchEvents();
    }, []);

    // Filter data based on search term
    const filteredEvents = events.filter((event) =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(
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
    const handleEdit = (event) => {
        setEditingPeriod(event);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Application Period
            </h2>
            <div className="flex gap-4">
                <EventForm onSuccess={fetchEvents} />
                <div className="w-[70%] mx-auto bg-white rounded-md shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            Events
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
                                <tr className="text-center bg-gray-50 text-gray-800 font-bold">
                                    <th
                                        scope="col"
                                        className="py-3 text-xs uppercase tracking-wider"
                                    >
                                        Date & Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-xs uppercase tracking-wider"
                                    >
                                        Event Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-xs uppercase tracking-wider"
                                    >
                                        Event Location
                                    </th>
                                    {/* <th
                                        scope="col"
                                        className="py-3 text-xs uppercase tracking-wider"
                                    >
                                        Message
                                    </th> */}
                                    <th
                                        scope="col"
                                        className="py-3 text-xs uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((event) => (
                                    <tr
                                        key={event.id}
                                        className="hover:bg-gray-50 transition-colors text-center text-xs"
                                    >
                                        <td className="py-3 whitespace-nowrap text-gray-500">
                                            {formatDateTime(
                                                event.event_date_time
                                            )}
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-gray-500">
                                            {event.event_name}
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-gray-500">
                                            {event.event_location}
                                        </td>
                                        <td className="py-3 whitespace-nowrap font-medium">
                                            {event.editable ? (
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
                                                    event
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
                                    No events found. Try adjusting your search
                                    or create a new event.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {fetchEvents.length > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstItem + 1}-
                                {Math.min(
                                    indexOfLastItem,
                                    filteredEvents.length
                                )}{" "}
                                of {filteredEvents.length} events
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
