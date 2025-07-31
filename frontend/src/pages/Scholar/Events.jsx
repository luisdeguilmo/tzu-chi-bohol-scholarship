import { useState, useEffect, useCallback } from "react";
import SearchInputMobile from "../../components/SearchInputMobile";
import { useEvents } from "../../hooks/useEvents";
import { useScholarOverviewData } from "../../hooks/useScholarOverviewData";
import { useAuth } from "../../context/AuthContext";
import EventCard from "./EventCard";
import TabNavigation from "./TabNavigation";
import DataOverview from "./DataOverview";
import EmptyState from "./EmptyState";
import EventDetailsModal from "../../components/EventDetailsModal";

export default function Events() {
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 12;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(null);

    const { user } = useAuth();
    const { loading, joinEvent, cancelEvent, events, fetchEvents } =
        useEvents(activeTab, user.user_id);
    const { overviewData } = useScholarOverviewData(user.user_id, "events");

    const tabs = [
        { name: "All", value: "all" },
        { name: "This Month", value: "this_month" },
        { name: "Upcoming", value: "upcoming" },
        { name: "Past", value: "past" },
    ];

    useEffect(() => {
        fetchEvents(activeTab, user.user_id);
    }, [activeTab, user.user_id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDotMenuOpen && !event.target.closest(".dropdown-menu")) {
                setIsDotMenuOpen(false);
                setItemIndex(-1);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isDotMenuOpen]);

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

    const handleOpenDetails = useCallback((event) => {
        setSelectedEvent(event);
        setIsDetailsOpen(true);
    }, []);

    const handleTabChange = useCallback(
        (tab) => {
            setActiveTab(tab);
            fetchEvents(tab, user.user_id);
            setCurrentPage(1);
        },
        [fetchEvents, user.user_id]
    );

    const handleOpenDotMenu = useCallback(
        async (event, index) => {
            event.stopPropagation();
            if (itemIndex === index && isDotMenuOpen === true) {
                setIsDotMenuOpen(false);
            } else {
                setIsDotMenuOpen(true);
            }
            setItemIndex(index);
        },
        [itemIndex, isDotMenuOpen]
    );

    const today = new Date();
    const dateToday = today.toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header Section */}
            <div className=" bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-6">
                    <h2 className="text-xl text-slate-700 font-bold mb-4">
                        Events
                    </h2>

                    {/* Overview Cards */}
                    <DataOverview overviewData={overviewData} />

                    {/* Search Input */}
                    <SearchInputMobile
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search events..."}
                    />
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                />
            </div>

            {/* Scrollable Content Area */}
            <div className="md:p-6">
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                        {currentItems.map((event, index) => (
                            <EventCard
                                userId={user.user_id}
                                key={index}
                                event={event}
                                index={index}
                                handleOpenDetails={handleOpenDetails}
                                handleOpenDotMenu={handleOpenDotMenu}
                                isDotMenuOpen={isDotMenuOpen}
                                itemIndex={itemIndex}
                                setIsDotMenuOpen={setIsDotMenuOpen}
                                setItemIndex={setItemIndex}
                                dateToday={dateToday}
                                activeTab={activeTab}
                                onRefresh={fetchEvents}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {currentItems.length === 0 && (
                    <EmptyState
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                )}
            </div>

            {/* Modals */}
            <EventDetailsModal
                event={selectedEvent}
                isOpen={isDetailsOpen}
                onClose={setIsDetailsOpen}
                joinEvent={joinEvent}
                cancelEvent={cancelEvent}
                userId={user.user_id}
                fetchEvents={fetchEvents}
                activeTab={activeTab}
                isScholar={true}
            />
        </div>
    );
}
