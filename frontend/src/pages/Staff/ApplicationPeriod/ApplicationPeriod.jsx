import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import SearchInput from "../../../components/SearchInput";
import { useApplicationPeriods } from "../../../hooks/useApplicationPeriods";
import { applicationPeriodTableHeaders } from "../../../constant/tableHeaders";
import { Plus } from "lucide-react";
import ApplicationPeriodFormModal from "./ApplicationPeriodFormModal";
import { usePeriod } from "../../../context/PeriodContext";

const ApplicationPeriod = () => {
    const [searchTerm, setSearchTerm] = useState("");
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const { deleteApplicationPeriod } = useApplicationPeriods();

    const {
        isModalOpen,
        setId,
        setStartDate,
        setEndDate,
        setAnnouncementMessage,
        setStatus,
        setIsModalOpen,
        setIsEditing,
    } = usePeriod();

    const {
        applicationPeriods,
        hasActiveApplicationPeriod,
        fetchApplicationPeriods,
    } = useApplicationPeriods();

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    const handleDelete = async (id) => {
        await deleteApplicationPeriod(id);
        await fetchApplicationPeriods();
    };

    // Filter data based on search term
    const filteredApplicationPeriods = applicationPeriods.filter(
        (application) =>
            application.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort applications
    const sortedApplicationPeriods = [...filteredApplicationPeriods].sort(
        (a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "oldest":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "name":
                    return a.first_name.localeCompare(b.first_name);
                default:
                    return 0;
            }
        }
    );

    const handlePeriodToEdit = (applicationPeriod) => {
        setIsEditing(true);
        setIsModalOpen(true);
        setId(applicationPeriod.id);
        setStartDate(applicationPeriod.start_date);
        setEndDate(applicationPeriod.end_date);
        setAnnouncementMessage(applicationPeriod.announcement_message);
        setStatus(applicationPeriod.status);
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
    } = usePagination(sortedApplicationPeriods, itemsPerPage);

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        fetchApplicationPeriods(tab);
        setCurrentPage(1);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(currentItems.map((item) => item.application_id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleRefresh = () => {
        fetchApplicationPeriods();
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-600">
                        Application Periods
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            New Application Period
                        </button>
                    </div>
                </div>

                {/* Modern Table Toolbar */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-slate-100">
                    {/* Top Row - Tabs and Search */}
                    <div className="flex justify-start items-center mb-4 gap-2 flex-col sm:flex-row">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 w-full ">
                            <SearchInput
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                placeholder="Search application periods..."
                            />
                        </div>
                    </div>

                    {/* Bottom Row - Controls */}
                    <div className="flex justify-between items-center">
                        {/* Left side - Selection info and actions */}
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-slate-700">
                                Total Application Periods:{" "}
                                {applicationPeriods.length}
                            </p>
                        </div>

                        {/* Right side - Sort and view options */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                    Sort by:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                    Show:
                                </span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) =>
                                        setItemsPerPage(Number(e.target.value))
                                    }
                                    className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-xs text-gray-600">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(
                            indexOfLastItem,
                            sortedApplicationPeriods.length
                        )}{" "}
                        of {sortedApplicationPeriods.length} applications
                    </div>
                    {searchTerm && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Search results for "{searchTerm}"
                            </span>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto rounded-[4px]">
                    <table className="lg:w-[100%] min-w-[1000px] relative">
                        <thead className="bg-gray-50 text-gray-700 font-bold">
                            <tr className="border-y border-gray-100">
                                {applicationPeriodTableHeaders.map(
                                    (header, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className={`${header.style} py-3 text-xs uppercase tracking-wider`}
                                        >
                                            {header.name}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs">
                            {currentItems.map((applicationPeriod) => (
                                <tr
                                    key={applicationPeriod.id}
                                    className="hover:bg-gray-50 border-b border-gray-100 transition-colors text-center text-xs"
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(
                                            applicationPeriod.start_date
                                        )}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(
                                            applicationPeriod.end_date
                                        )}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                                applicationPeriod.status ===
                                                "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : applicationPeriod.status ===
                                                      "Pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {applicationPeriod.status}
                                        </span>
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {applicationPeriod.announcement_message}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium">
                                        <button
                                            onClick={() =>
                                                handlePeriodToEdit(
                                                    applicationPeriod
                                                )
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
                                        </button>
                                        {/* <span className="text-gray-400 italic text-xs">
                                                Edit not available
                                            </span> */}

                                        <button
                                            onClick={() =>
                                                handleDelete(applicationPeriod.id)
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
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No application periods found." />
                    )}
                </div>

                {/* Pagination */}
                {sortedApplicationPeriods.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={sortedApplicationPeriods.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}
            </div>

            <ApplicationPeriodFormModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                onRefresh={fetchApplicationPeriods}
                disabled={hasActiveApplicationPeriod}
            />
        </div>
    );
};

export default ApplicationPeriod;
