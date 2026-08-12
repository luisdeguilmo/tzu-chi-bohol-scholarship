import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import { useEventsOnStaff } from "../../../hooks/useEventsOnStaff";
import EventDetailsModal from "../../../components/EventDetailsModal";
import { date } from "../../../utils/getDateAndTime";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { eventTableHeaders } from "../../../constant/tableHeaders";
import { ClipboardEdit, Eye, MessageSquare, PenLine, Plus } from "lucide-react";
import EventFormModal from "./EventFormModal";
import { useAuth } from "../../../context/AuthContext";
import { useYearContext } from "../../../context/YearContext";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isOpenEventDetailsModal, setIsOpenEventDetailsModal] =
        useState(false);
    const [shouldScrollToComments, setShouldScrollToComments] = useState(false);
    const [year, setYear] = useState("2026");
    const [status, setStatus] = useState("all");
    const [action, setAction] = useState("create");

    const { user } = useAuth();
    const { years } = useYearContext();
    const { loading, events, fetchEvents } = useEventsOnStaff(
        year,
        status,
        sortBy,
    );

    useEffect(() => {
        fetchEvents();
    }, [year, status, sortBy]);

    // Filter data based on search term
    const filteredEvents = events.filter((event) =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // const participated = selectedEvent?.participants.filter(
    //     (participant) => participant.is_attended
    // );

    const sortedApplications = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date) - new Date(a.date);
            case "oldest":
                return new Date(a.date) - new Date(b.date);
            case "name":
                return a.event_name.localeCompare(b.event_name);
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
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={events}
                    label={"Events"}
                    placeholder={"events"}
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
                            label: "Event Name (A-Z)",
                            value: "name",
                        },
                    ]}
                    sortedItems={sortedApplications}
                    onOpen={setIsOpenFormModal}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeItemsPerPage={setItemsPerPage}
                    onChangeCurrentPage={setCurrentPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={true}
                    button={{
                        icon: <Plus className="w-4 h-4 text-white" />,
                        label: "Add New Event",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-1 w-[150px] text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Year:
                        </span>
                        <select
                            value={year}
                            onChange={(e) =>
                                handleChangeYear(Number(e.target.value))
                            }
                            className="px-3 py-1 w-[150px] text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            {years.map((year) => (
                                <option key={year.year} value={year.year}>
                                    {year.year}
                                </option>
                            ))}
                        </select>
                    </div>
                </TableToolbar>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={eventTableHeaders}>
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
                            currentItems.map((event) => (
                                <tr
                                    key={event.id}
                                    className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-5 pl-6 whitespace-nowrap text-gray-700">
                                        <p className="text-left font-bold">
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
                                                    : "bg-red-100 text-red-800"
                                            } ${
                                                date.getCurrentDateAndTime() <
                                                event.date +
                                                    " " +
                                                    event.start_time
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : event.date +
                                                            " " +
                                                            event.start_time <=
                                                            date.getCurrentDateAndTime() &&
                                                        date.getCurrentDateAndTime() <=
                                                            event.date +
                                                                " " +
                                                                event.end_time
                                                      ? "bg-green-100 text-green-800"
                                                      : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {date.getCurrentDateAndTime() <
                                            event.date + " " + event.start_time
                                                ? "Upcoming"
                                                : event.date +
                                                        " " +
                                                        event.start_time <=
                                                        date.getCurrentDateAndTime() &&
                                                    date.getCurrentDateAndTime() <=
                                                        event.date +
                                                            " " +
                                                            event.end_time
                                                  ? "Ongoing"
                                                  : "Ended"}
                                        </span>
                                    </td>
                                    <td className="py-3 text-center whitespace-nowrap font-medium">
                                        <button
                                            onClick={() => {
                                                handleOpenDetailsModal(event);
                                                setAction("view_and_record");
                                                setShouldScrollToComments(
                                                    false,
                                                );
                                            }}
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                        >
                                            {date.getCurrentDateAndTime() >
                                            event.date +
                                                " " +
                                                event.end_time ? (
                                                event?.participants.filter(
                                                    (participant) =>
                                                        participant.is_attended,
                                                ).length !==
                                                event.numberOfParticipants ? (
                                                    <ClipboardEdit className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                )
                                            ) : (
                                                <Eye className="w-4 h-4 text-blue-600" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpenFormModal(true);
                                                setAction("edit");
                                                setSelectedEvent(event);
                                            }}
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                        >
                                            <PenLine className="w-4 h-4 text-green-600" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleOpenDetailsModal(event);
                                                setAction("view_and_record");
                                                setShouldScrollToComments(true);
                                            }}
                                            className={`${event.numberOfScholarUnreadComments > 0 ? "visible" : "invisible"} inline-flex relative items-center text-green-600 hover:text-green-900 mr-3`}
                                        >
                                            <span
                                                className={`absolute -top-2 -right-1 text-[9px] py-[.2px] px-[5px] rounded-full bg-red-600 text-white font-bold flex items-center justify-center`}
                                            >
                                                {
                                                    event.numberOfScholarUnreadComments
                                                }
                                            </span>
                                            <MessageSquare className="w-4 h-4 text-purple-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && !loading && (
                        <EmptyState message="No event found." />
                    )}
                </div>

                <div className="flex justify-end items-center mt-6">
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

            {isOpenFormModal && (
                <EventFormModal
                    isOpen={isOpenFormModal}
                    onClose={setIsOpenFormModal}
                    onSuccess={fetchEvents}
                    onRefresh={fetchEvents}
                    event={selectedEvent}
                    action={action}
                    setAction={setAction}
                />
            )}

            {isOpenEventDetailsModal && (
                <EventDetailsModal
                    isOpen={
                        isOpenEventDetailsModal && action === "view_and_record"
                    }
                    onClose={setIsOpenEventDetailsModal}
                    event={selectedEvent}
                    isStaff={true}
                    firstName={user.first_name}
                    lastName={user.last_name}
                    fetchEvents={handleRefresh}
                    shouldScrollToComments={shouldScrollToComments}
                    onStaffEventsRefresh={fetchEvents}
                />
            )}
        </div>
    );
}
