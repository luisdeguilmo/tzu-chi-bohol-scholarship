import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import { volunteerActivitiesTableHeaders } from "../../../constant/tableHeaders";
import { usePagination } from "../../../hooks/usePagination";
import { useScholarsAndActivities } from "../../../hooks/useScholarsAndActivities";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import CommunityServiceDetailsModal from "../../../components/CommunityServiceDetailsModal";
import TableToolbar from "../../../components/TableToolbar";
import { Eye } from "lucide-react";
import Table from "../../../components/Table";
import TableRow from "../../../components/TableRow";

const CommunityServicePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("newest");
    const [status, setStatus] = useState("all");
    const [active, setActiveTab] = useState("");

    const { scholars, fetchScholars } = useScholarsAndActivities(
        year,
        month,
        status,
        sortBy
    );

    const { profilePics, fetchAllPics } = useProfilePicture(
        scholars,
        "profile-picture"
    );

    console.log(scholars);

    useEffect(() => {
        fetchScholars(year, month, status, sortBy);
    }, [year, month, status, sortBy]);

    // useEffect(() => {
    //     fetchAllPics();
    // }, [scholars]);

    console.log(scholars);

    // Filter data based on search term
    const filteredActivities = scholars.filter((applicant) =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedActivities = [...filteredActivities].sort((a, b) => {
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
    });

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(filteredActivities, itemsPerPage);

    const handleViewDetails = (scholar) => {
        setIsOpen(true);
        setSelectedScholar(scholar);
    };

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        // setSelectedItems([]);
        fetchScholars(year, month, status, sortBy);
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={scholars}
                    label={"Community Services"}
                    placeholder={"community services"}
                    activeTab={status}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedActivities}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
                    onChangeCurrentPage={setCurrentPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
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
                            <option value="pending">Pending</option>
                            <option value="recorded">Recorded</option>
                            <option value="not_recorded">Not Recorded</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Year:</span>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value={2025}>2025</option>
                            <option value={2024}>2024</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Month:</span>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value={1}>Jan</option>
                            <option value={2}>Feb</option>
                            <option value={3}>Mar</option>
                            <option value={4}>Apr</option>
                            <option value={5}>May</option>
                            <option value={6}>Jun</option>
                            <option value={7}>Jul</option>
                            <option value={8}>Aug</option>
                            <option value={9}>Sep</option>
                            <option value={10}>Oct</option>
                            <option value={11}>Nov</option>
                            <option value={12}>Dec</option>
                        </select>
                    </div>
                </TableToolbar>

                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={volunteerActivitiesTableHeaders}>
                        {currentItems.map((info, index) => (
                            <TableRow key={index}>
                                <td className="py-2 whitespace-nowrap text-gray-900 font-bold">
                                    {info.application_id}
                                </td>
                                <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[25%]"></div>
                                    <div className="w-[max-content] flex items-center text-left gap-2">
                                        <img
                                            src={
                                                profilePics[info.application_id]
                                            }
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div>
                                            <p className="font-bold text-xs">
                                                {info.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {info.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 whitespace-nowrap font-medium">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium
                                            ${
                                                info.status === "Recorded"
                                                    ? "bg-green-100 text-green-800"
                                                    : info.status ===
                                                        "Not Recorded"
                                                      ? "bg-red-100 text-red-800"
                                                      : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {info.status === "Recorded"
                                            ? "Recorded"
                                            : info.status === "Not Recorded"
                                              ? "Not Recorded"
                                              : "Pending"}
                                    </span>
                                </td>
                                <td className="py-2 whitespace-nowrap text-gray-500">
                                    {formatDateTime(info.date_submitted)}
                                </td>
                                <td className="py-2 whitespace-nowrap text-center font-medium">
                                    <button
                                        onClick={() => handleViewDetails(info)}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        <Eye className="w-4 h-4 text-blue-600" />
                                    </button>
                                </td>
                            </TableRow>
                        ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No applications found." />
                    )}
                </div>

                {/* Pagination */}
                {filteredActivities.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredActivities.length}
                            itemLabel={"community services"}
                        />
                    </div>
                )}

                <CommunityServiceDetailsModal
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    activity={selectedScholar}
                    isStaff={true}
                    onRefresh={fetchScholars}
                    status={status}
                    year={year}
                    month={month}
                    sort={sortBy}
                />
            </div>
        </div>
    );
};

export default CommunityServicePage;
