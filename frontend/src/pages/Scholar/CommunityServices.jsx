import { useState, useEffect, use, useCallback } from "react";
import SearchInputMobile from "../../components/SearchInputMobile";
import { useActivities } from "../../hooks/useActivities";
import { useAuth } from "../../context/AuthContext";
import { useScholarOverviewData } from "../../hooks/useScholarOverviewData";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    HandHeart,
} from "lucide-react";
import ActivityFormModal from "./ActivityFormModal";
import EmptyState from "./EmptyState";
import TabNavigation from "./TabNavigation";
import CommunityServiceDetailsModal from "../../components/CommunityServiceDetailsModal";
import CommunityServiceCard from "./CommunityServiceCard";

export default function CommunityServices() {
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(-1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const { user } = useAuth();
    const { activities, fetchActivities } = useActivities(
        activeTab,
        user.user_id
    );
    const { overviewData } = useScholarOverviewData(
        user.user_id,
        "volunteer_activities"
    );

    useEffect(() => {
        fetchActivities(activeTab, user.user_id);
    }, [activeTab, user.user_id]);

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
                .includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { name: "All", value: "all" },
        { name: "This Month", value: "this_month" },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredActivities.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handleOpenDetails = useCallback((activity) => {
        setSelectedActivity(activity);
        setIsOpenModal(true);
    }, []);

    const handleTabChange = useCallback(
        (tab) => {
            setActiveTab(tab);
            fetchActivities(tab, user.user_id);
            setCurrentPage(1);
        },
        [fetchActivities, user.user_id]
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
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header Section */}
            <div className=" bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-6">
                    <h2 className="text-xl text-slate-700 font-bold mb-4">
                        Community Services
                    </h2>

                    {/* Overview Cards */}
                    <div className="mb-6 p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-xl text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-left text-white/90 text-sm font-medium">
                                    This Month Overview
                                </p>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Calendar className="w-4 h-5 text-white" />
                                    <span className="text-sm">July 2024</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Pending
                                        </span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <AlertCircle className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {overviewData.pendingActivities || 0}
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Recorded
                                        </span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {overviewData.recordedActivities || 0}
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Activities
                                        </span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <HandHeart className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {overviewData.numberOfActivities || 0}
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Total Rendered Hours
                                        </span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {overviewData.totalHours || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Input */}
                    <SearchInputMobile
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search activities..."}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((activity, index) => (
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
                            activeTab={activeTab}
                            onRefresh={fetchActivities}
                        />
                    ))}
                </div>

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
            <ActivityFormModal isOpen={isOpen} setIsOpen={setIsOpen} />

            <CommunityServiceDetailsModal
                activity={selectedActivity}
                isOpen={isOpenModal}
                onClose={setIsOpenModal}
            />
        </div>
    );
}
