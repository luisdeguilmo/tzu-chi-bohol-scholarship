import React, { useCallback, useEffect, useState } from "react";
import SearchInputMobile from "../../../components/SearchInputMobile";
import { useArchive } from "../../../hooks/useArchive";
import TabNavigation from "../TabNavigation";
import { useAuth } from "../../../context/AuthContext";
import EmptyState from "../EmptyState";
import EventDetailsModal from "../../../components/EventDetailsModal";
import CommunityServiceDetailsModal from "../../../components/CommunityServiceDetailsModal";
import CommunityServiceCard from "../CommunityServices/CommunityServiceCard";
import EventCard from "../Events/EventCard";
import BackgroundLoadingIndicator from "../../../components/BackgroundLoadingIndicator";
import { useLocation } from "react-router-dom";

export default function ArchivedActivities() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const { user } = useAuth();
    const itemsPerPage = 6;
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(-1);

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const { loading, archivedActivities, fetchArchivedActivities } = useArchive(
        activeTab,
        user.user_id
    );

    console.log(archivedActivities);

    const tabs = [
        { name: "All", value: "all" },
        { name: "Community Services", value: "volunteer_activities" },
        { name: "Events", value: "events" },
    ];

    // Filter data based on search term
    const filteredItems = archivedActivities.filter((act) => {
        const activityName = act?.activity_name?.toLowerCase() || "";
        const eventName = act?.event_name?.toLowerCase() || "";

        return (
            activityName.includes(searchTerm.toLowerCase()) ||
            eventName.includes(searchTerm.toLowerCase())
        );
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const [isVolunteerActivityDetailsOpen, setIsVolunteerActivityDetailsOpen] =
        useState(false);
    const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        fetchArchivedActivities();
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

    const handleOpenDetails = useCallback((activity) => {
        setSelectedActivity(activity);
        if (activity.activity_name) {
            setIsVolunteerActivityDetailsOpen(true);
        } else {
            setIsEventDetailsOpen(true);
        }
    }, []);

    const handleTabChange = useCallback(
        (tab) => {
            setActiveTab(tab);
            fetchArchivedActivities(tab, user.user_id);
            setCurrentPage(1);
        },
        [user.user_id]
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
                <div className="px-4 py-4">
                    <h2 className="pt-2 text-xl text-slate-700 font-bold mb-4">
                        Archived Activities
                    </h2>

                    {/* Overview Cards */}

                    {/* Search Input */}
                    <SearchInputMobile
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search events and community services..."}
                    />
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    handleTabChange={handleTabChange}
                    activeTab={activeTab}
                />
            </div>

            {/* Scrollable Content Area */}
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {loading ? (
                        <BackgroundLoadingIndicator />
                    ) : (
                        currentItems.map((activity, index) => (
                            <div key={index}>
                                {activity.event_name ? (
                                    <EventCard
                                        userId={user.user_id}
                                        event={activity}
                                        index={index}
                                        handleOpenDetails={handleOpenDetails}
                                        handleOpenDotMenu={handleOpenDotMenu}
                                        isDotMenuOpen={isDotMenuOpen}
                                        itemIndex={itemIndex}
                                        setIsDotMenuOpen={setIsDotMenuOpen}
                                        setItemIndex={setItemIndex}
                                        dateToday={dateToday}
                                        isArchived={true}
                                        activeTab={activeTab}
                                        onRefresh={fetchArchivedActivities}
                                    />
                                ) : (
                                    <CommunityServiceCard
                                        userId={user.user_id}
                                        key={index}
                                        activity={activity}
                                        index={index}
                                        handleOpenDetails={handleOpenDetails}
                                        handleOpenDotMenu={handleOpenDotMenu}
                                        isDotMenuOpen={isDotMenuOpen}
                                        itemIndex={itemIndex}
                                        setIsDotMenuOpen={setIsDotMenuOpen}
                                        setItemIndex={setItemIndex}
                                        isArchived={true}
                                        activeTab={activeTab}
                                        onRefresh={fetchArchivedActivities}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Empty State */}
                {!loading && currentItems.length === 0 && (
                    <EmptyState
                        section={"archived_activities"}
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        header={
                            searchTerm
                                ? "No Results Found"
                                : activeTab === "all"
                                  ? "There are no archived activities yet."
                                  : activeTab === "volunteer_activities"
                                    ? "No archived community service activities found."
                                    : "No past events have been archived yet."
                        }
                        subHeader={
                            searchTerm
                                ? `No activities match your search for "${searchTerm}"`
                                : activeTab === "all"
                                  ? "Activities will appear here once they are manually archived"
                                  : activeTab === "volunteer_activities"
                                    ? "Volunteer activities will be listed here after you archives them."
                                    : "Events will show up here after being archived you archives them."
                        }
                    />
                )}
            </div>

            {isEventDetailsOpen ? (
                <EventDetailsModal
                    event={selectedActivity}
                    isOpen={isEventDetailsOpen}
                    onClose={setIsEventDetailsOpen}
                    fetchEvents={fetchArchivedActivities}
                    activeTab={activeTab}
                />
            ) : (
                <CommunityServiceDetailsModal
                    activity={selectedActivity}
                    isOpen={isVolunteerActivityDetailsOpen}
                    onClose={setIsVolunteerActivityDetailsOpen}
                />
            )}
        </div>
    );
}
