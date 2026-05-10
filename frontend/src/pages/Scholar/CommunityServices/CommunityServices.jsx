import { useState, useEffect, use, useCallback } from "react";
import { useActivities } from "../../../hooks/useActivities";
import { useAuth } from "../../../context/AuthContext";
import { useScholarOverviewData } from "../../../hooks/useScholarOverviewData";
import { Plus } from "lucide-react";
import EmptyState from "../EmptyState";
import CommunityServiceDetailsModal from "../../../components/CommunityServiceDetailsModal";
import CommunityServiceCard from "./CommunityServiceCard";
import EditFormModal from "./EditFormModal";
import OverviewCard from "../OverviewCard";
import { scholarOverviewData } from "../../../config/scholarOverviewData";
import ActivityFormModal from "./FormModal";
import BackgroundLoadingIndicator from "../../../components/BackgroundLoadingIndicator";
import { useLocation } from "react-router-dom";

export default function CommunityServices() {
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(-1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const { user } = useAuth();
    const { loading, activities, fetchActivities } = useActivities(activeTab);
    const { overviewData } = useScholarOverviewData(
        "volunteer_activities",
    );
    const { communityServiceOverviewData } = scholarOverviewData(overviewData);

    useEffect(() => {
        fetchActivities(activeTab);
    }, [activeTab]);

    // Close dropdown when clicking outside
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
    const filteredActivities = activities.filter(
        (activity) =>
            activity.activity_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            activity.activity_status
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const tabs = [
        { name: "All", value: "all" },
        { name: "This Month", value: "this_month" },
        { name: "Past Submissions", value: "past" },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredActivities.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const handleOpenDetails = useCallback((activity) => {
        setSelectedActivity(activity);
        setIsOpenModal(true);
    }, []);

    const handleSelectCommunityService = useCallback((activity) => {
        setSelectedActivity(activity);
    }, []);

    const handleTabChange = useCallback(
        (tab) => {
            setActiveTab(tab);
            fetchActivities(tab);
            setCurrentPage(1);
        },
        [fetchActivities],
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

    const handleRefresh = () => {
        fetchActivities(activeTab);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <OverviewCard
                label={"Duty Reports"}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder={"duty reports"}
                tabs={tabs}
                overviewData={communityServiceOverviewData}
            />

            {/* Scrollable Content Area */}
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {loading ? (
                        <BackgroundLoadingIndicator />
                    ) : (
                        currentItems.map((activity, index) => (
                            <CommunityServiceCard
                                key={index}
                                activity={activity}
                                index={index}
                                handleOpenDetails={handleOpenDetails}
                                handleOpenDotMenu={handleOpenDotMenu}
                                handleSelectCommunityService={
                                    handleSelectCommunityService
                                }
                                isDotMenuOpen={isDotMenuOpen}
                                itemIndex={itemIndex}
                                setIsDotMenuOpen={setIsDotMenuOpen}
                                setItemIndex={setItemIndex}
                                isEditFormModalOpen={isEditFormModalOpen}
                                setIsEditFormModalOpen={setIsEditFormModalOpen}
                                activeTab={activeTab}
                                onRefresh={fetchActivities}
                            />
                        ))
                    )}
                </div>

                {/* Empty State */}
                {!loading && currentItems.length === 0 && (
                    <EmptyState
                        section={"community_services"}
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        header={
                            searchTerm
                                ? "No Results Found"
                                : activeTab === "all"
                                  ? "You haven’t submitted any duty report yet."
                                  : activeTab === "this_month"
                                    ? "No duty report submitted this month."
                                    : "No past duty report submissions found."
                        }
                        subHeader={
                            searchTerm
                                ? `No duty reports match your search for "${searchTerm}"`
                                : activeTab === "all"
                                  ? "Start making a difference and track your impact here."
                                  : activeTab === "this_month"
                                    ? "Add your first duty report for this month!"
                                    : "Once you submit and a new month starts, past entries will appear here."
                        }
                    />
                )}
            </div>

            {/* Modals */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-4 fixed bottom-10 right-12 md:right-16 xl:right-28 bg-green-600 text-white rounded-full transition-colors flex justify-center items-center shadow-lg hover:bg-green-700"
            >
                <Plus className="w-4 h-4  text-white" />
            </button>

            <ActivityFormModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onSuccess={handleRefresh}
            />

            {isEditFormModalOpen && (
                <EditFormModal
                    isOpen={isEditFormModalOpen}
                    setIsOpen={setIsEditFormModalOpen}
                    activity={selectedActivity}
                    onSuccess={handleRefresh}
                />
            )}

            <CommunityServiceDetailsModal
                activity={selectedActivity}
                isOpen={isOpenModal}
                onClose={setIsOpenModal}
            />
        </div>
    );
}
