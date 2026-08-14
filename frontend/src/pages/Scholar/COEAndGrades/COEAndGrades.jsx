import { useState, useEffect, useCallback } from "react";
import { useSubmissions } from "../../../hooks/useSubmissions"; // Changed from useActivities
import { useAuth } from "../../../context/AuthContext";
import { Plus } from "lucide-react";
import EmptyState from "../EmptyState";
import EditFormModal from "./EditFormModal";
import CoeGradesFormModal from "./CoeGradesFormModal"; // Changed
import BackgroundLoadingIndicator from "../../../components/BackgroundLoadingIndicator";
import CoeGradesCard from "./COEAndGradeCard";
import SearchInputMobile from "../../../components/SearchInputMobile";
import TabNavigation from "../TabNavigation";
import CoeGradesDetailsModal from "../../../components/CoeGradesDetailsModal";
import { useCurrentYearLevel } from "../../../hooks/useCurrentYearLevel";
import { useLocation } from "react-router-dom";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

export default function CoeGrades() {
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(-1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null); // Changed from selectedActivity

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, -5);
    }, [pathname]);

    const { user } = useAuth();
    const { activeSchoolYear } = useSchoolYearContext();

    const { yearLevel } = useCurrentYearLevel(activeSchoolYear);

    const { loading, submissions, fetchSubmissions } = useSubmissions(
        activeTab,
        yearLevel,
        null,
    );

    useEffect(() => {
        fetchSubmissions(activeTab); // Changed
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
    const filteredSubmissions = submissions.filter(
        // Changed from filteredActivities
        (submission) =>
            submission.year_level
                .toString()
                .includes(searchTerm.toLowerCase()) ||
            submission.semester // Changed from activity_status
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            submission.submission_status // Added
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const tabs = [
        { name: "All", value: "all" },
        { name: "This Academic Year", value: "this_school_year" }, // Changed from "This Month"
        { name: "Past Submissions", value: "past" },
    ];

    // Calculate pagination
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubmissions.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const handleOpenDetails = useCallback((submission) => {
        // Changed parameter
        setSelectedSubmission(submission); // Changed
        setIsOpenModal(true);
    }, []);

    const handleSelectSubmission = useCallback((submission) => {
        setSelectedSubmission(submission); // Changed
    }, []);

    const handleTabChange = useCallback(
        (tab) => {
            setActiveTab(tab);
            fetchSubmissions(tab); // Changed
            setCurrentPage(1);
        },
        [fetchSubmissions], // Changed
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
        fetchSubmissions(activeTab); // Changed
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className=" bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 py-4">
                    <h2 className="pt-2 text-lg sm:text-xl text-slate-700 font-bold mb-4">
                        Certificate of Enrollment and Grades
                    </h2>

                    {/* Search Input */}
                    <SearchInputMobile
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search COE and grades..."}
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
            <div className="p-4 md:p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4">
                    {loading ? (
                        <BackgroundLoadingIndicator />
                    ) : (
                        currentItems.map(
                            (
                                submission,
                                index, // Changed from activity
                            ) => (
                                <CoeGradesCard // Changed component name
                                    key={index}
                                    submission={submission} // Changed prop name
                                    index={index}
                                    handleOpenDetails={handleOpenDetails}
                                    handleOpenDotMenu={handleOpenDotMenu}
                                    handleSelectSubmission={
                                        handleSelectSubmission
                                    }
                                    isDotMenuOpen={isDotMenuOpen}
                                    itemIndex={itemIndex}
                                    setIsDotMenuOpen={setIsDotMenuOpen}
                                    setItemIndex={setItemIndex}
                                    isEditFormModalOpen={isEditFormModalOpen}
                                    setIsEditFormModalOpen={
                                        setIsEditFormModalOpen
                                    }
                                    activeTab={activeTab}
                                    onRefresh={fetchSubmissions} // Changed
                                />
                            ),
                        )
                    )}
                </div>

                {/* Empty State */}
                {!loading && currentItems.length === 0 && (
                    <EmptyState
                        section={"coe_grades"} // Changed
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        header={
                            searchTerm
                                ? "No Results Found"
                                : activeTab === "all"
                                  ? "You haven't submitted any COE and grades yet." // Changed
                                  : activeTab === "this_year" // Changed
                                    ? "No COE and grades submitted this academic year." // Changed
                                    : "No past COE and grades submissions found." // Changed
                        }
                        subHeader={
                            searchTerm
                                ? `No submissions match your search for "${searchTerm}"` // Changed
                                : activeTab === "all"
                                  ? "Upload your Certificate of Enrollment and grades to keep your records up to date." // Changed
                                  : activeTab === "this_year" // Changed
                                    ? "Add your COE and grades for this academic year!" // Changed
                                    : "Once you submit and a new academic year starts, past entries will appear here." // Changed
                        }
                    />
                )}
            </div>

            {/* Add Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-4 fixed bottom-10 right-12 md:right-16 xl:right-28 bg-green-600 text-white rounded-full transition-colors flex justify-center items-center shadow-lg hover:bg-green-700" // Changed from green to blue
            >
                <Plus className="w-4 h-4 text-white" />
            </button>

            {/* Modals */}
            {isOpen && (
                <CoeGradesFormModal // Changed component name
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={handleRefresh}
                    yearLevel={yearLevel}
                />
            )}

            {isEditFormModalOpen && (
                <EditFormModal
                    isOpen={isEditFormModalOpen}
                    setIsOpen={setIsEditFormModalOpen}
                    submission={selectedSubmission} // Changed prop name
                    onSuccess={handleRefresh}
                />
            )}

            {isOpenModal && (
                <CoeGradesDetailsModal
                    submission={selectedSubmission}
                    isOpen={isOpenModal}
                    onClose={setIsOpenModal}
                />
            )}
        </div>
    );
}
