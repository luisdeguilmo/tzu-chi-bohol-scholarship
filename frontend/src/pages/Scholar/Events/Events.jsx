import { useState, useEffect, useCallback } from "react";
import SearchInputMobile from "../../../components/SearchInputMobile";
import { useEvents } from "../../../hooks/useEvents";
import { useScholarOverviewData } from "../../../hooks/useScholarOverviewData";
import { useAuth } from "../../../context/AuthContext";
import EventCard from "./EventCard";
import EmptyState from "../EmptyState";
import EventDetailsModal from "../../../components/EventDetailsModal";
import OverviewCard from "../OverviewCard";
import { scholarOverviewData } from "../../../config/scholarOverviewData";
import BackgroundLoadingIndicator from "../../../components/BackgroundLoadingIndicator";
import { useLocation } from "react-router-dom";

export default function Events() {
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 12;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(null);

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const { user } = useAuth();

    const { loading, joinEvent, cancelEvent, events, fetchEvents } =
        useEvents(activeTab);

    const { overviewData } = useScholarOverviewData("events");

    const { eventOverviewData } = scholarOverviewData(overviewData);

    const tabs = [
        { name: "All", value: "all" },
        { name: "This Month", value: "this_month" },
        { name: "Upcoming", value: "upcoming" },
        { name: "Past", value: "past" },
    ];

    useEffect(() => {
        fetchEvents();
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
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(
        indexOfFirstItem,
        indexOfLastItem,
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
        [fetchEvents, user.user_id],
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
        [itemIndex, isDotMenuOpen],
    );

    const today = new Date();
    const dateToday = today.toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header Section */}
            <OverviewCard
                label={"Events"}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder={"events"}
                tabs={tabs}
                overviewData={eventOverviewData}
            />

            {/* Scrollable Content Area */}
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {loading ? (
                        <BackgroundLoadingIndicator />
                    ) : (
                        currentItems.map((event, index) => (
                            <EventCard
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
                        ))
                    )}
                </div>

                {/* Empty State */}
                {!loading && currentItems.length === 0 && (
                    <EmptyState
                        section={"events"}
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        header={
                            searchTerm
                                ? "No Results Found"
                                : activeTab === "all"
                                  ? "There are no events at the moment."
                                  : activeTab === "this_month"
                                    ? "No events scheduled for this month."
                                    : activeTab === "upcoming"
                                      ? "No upcoming events right now."
                                      : "No past events recorded yet."
                        }
                        subHeader={
                            searchTerm
                                ? `No activities match your search for "${searchTerm}"`
                                : activeTab === "all"
                                  ? "Check back soon for new events."
                                  : activeTab === "this_month"
                                    ? "Check back later for new events."
                                    : activeTab === "upcoming"
                                      ? "Stay tuned for updates."
                                      : "Events will appear here after they occur."
                        }
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
                firstName={user.first_name}
                lastName={user.last_name}
                onScholarEventsRefresh={fetchEvents}
            />
        </div>
    );
}
