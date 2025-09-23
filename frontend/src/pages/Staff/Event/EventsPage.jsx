import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import AddEventFormModal from "./AddEventFormModal";
import { useEventsOnStaff } from "../../../hooks/useEventsOnStaff";
import EventDetailsModal from "../../../components/EventDetailsModal";
import { date } from "../../../utils/getDateAndTime";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { eventTableHeaders } from "../../../constant/tableHeaders";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isOpenEventDetailsModal, setIsOpenEventDetailsModal] =
        useState(false);
    const [year, setYear] = useState("2025");
    const [status, setStatus] = useState("all");

    const { events, fetchEvents } = useEventsOnStaff(year, status, sortBy);

    useEffect(() => {
        fetchEvents();
    }, [year, status, sortBy]);

    // Filter data based on search term
    const filteredEvents = events.filter((event) =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedApplications = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date) - new Date(a.date);
            case "oldest":
                return new Date(a.date) - new Date(b.date);
            case "name":
                return a.first_name.localeCompare(b.first_name);
            default:
                return 0;
        }
    });

    const handleOpenDetailsModal = (event) => {
        setSelectedEvent(event);
        setIsOpenEventDetailsModal(true);
    };

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

    const handleChangeYear = (year) => {
        setYear(year);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchEvents();
        setSelectedItems([]);
    };

    return (
        <div className="lg:p-6">
            {/* <EventForm onSuccess={fetchEvents} /> */}
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={events}
                    label={"Events"}
                    placeholder={"events"}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedApplications}
                    onOpen={setIsOpenFormModal}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeItemsPerPage={setItemsPerPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={true}
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
                            <option value="upcoming">Upcoming</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Year:</span>
                        <select
                            value={year}
                            onChange={(e) =>
                                handleChangeYear(Number(e.target.value))
                            }
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value={2025}>2025</option>
                            <option value={2024}>2024</option>
                        </select>
                    </div>
                </TableToolbar>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={eventTableHeaders}>
                        {currentItems.map((event) => (
                            <tr
                                key={event.id}
                                className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="py-3 pl-6 whitespace-nowrap text-gray-700">
                                    <p className="text-left">
                                        {event.event_name}
                                    </p>
                                </td>
                                <td className="py-3 text-left pr-16 whitespace-nowrap text-xs text-gray-700">
                                    {event.event_location}
                                </td>
                                <td className="py-3 text-left whitespace-nowrap text-gray-500">
                                    {formatDate(event.date)}
                                </td>
                                <td className="py-3 text-left whitespace-nowrap text-gray-500">
                                    {formatTime(event.start_time)} -{" "}
                                    {formatTime(event.end_time)}
                                </td>
                                <td className="py-3 text-left whitespace-nowrap text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium
                                            ${
                                                event.date +
                                                    " " +
                                                    event.end_time >
                                                date.getCurrentDateAndTime()
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-900"
                                            }`}
                                    >
                                        {event.date + " " + event.end_time >
                                        date.getCurrentDateAndTime()
                                            ? "Upcoming"
                                            : "Ended"}
                                    </span>
                                </td>
                                <td className="py-3 text-center whitespace-nowrap font-medium">
                                    <button
                                        onClick={() =>
                                            handleOpenDetailsModal(event)
                                        }
                                        className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-4 h-4 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No events found." />
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    {/* Pagination */}
                    {events.length > 0 && (
                        <div className="flex justify-end gap-4 items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={goToPreviousPage}
                                onNext={goToNextPage}
                                indexOfFirstItem={indexOfFirstItem}
                                indexOfLastItem={indexOfLastItem}
                                totalItems={filteredEvents.length}
                                itemLabel={"events"}
                            />
                        </div>
                    )}
                </div>
            </div>

            <AddEventFormModal
                isOpen={isOpenFormModal}
                onClose={setIsOpenFormModal}
                onSuccess={fetchEvents}
                onRefresh={fetchEvents}
            />

            <EventDetailsModal
                isOpen={isOpenEventDetailsModal}
                onClose={setIsOpenEventDetailsModal}
                event={selectedEvent}
                isStaff={true}
            />
        </div>
    );
}
