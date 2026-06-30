import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import { volunteerActivitiesTableHeaders } from "../../../constant/tableHeaders";
import { usePagination } from "../../../hooks/usePagination";
import { useScholarsAndActivities } from "../../../hooks/useScholarsAndActivities";
import { formatDateTime } from "../../../utils/formatDateTime";
import CommunityServiceDetailsModal from "../../../components/CommunityServiceDetailsModal";
import TableToolbar from "../../../components/TableToolbar";
import { Eye } from "lucide-react";
import Table from "../../../components/Table";
import TableRow from "../../../components/TableRow";
import { useYears } from "../../../hooks/useYear";

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

    const { years } = useYears();
    const { loading, scholars, fetchScholars } = useScholarsAndActivities(
        year,
        month,
        status,
        sortBy,
    );

    useEffect(() => {
        fetchScholars(year, month, status, sortBy);
    }, [year, month, status, sortBy]);

    // Filter data based on search term
    const filteredActivities = scholars.filter((applicant) =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedActivities = [...filteredActivities].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at) - new Date(a.created_at);
            case "oldest":
                return new Date(a.created_at) - new Date(b.created_at);
            case "name":
                return a.last_name.localeCompare(b.last_name);
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
                    label={"Duty Reports"}
                    placeholder={"duty reports"}
                    activeTab={status}
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
                            label: "Name (A-Z)",
                            value: "name",
                        },
                    ]}
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
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="recorded">Recorded</option>
                            <option value="not_recorded">Not Recorded</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Year:
                        </span>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {years.map((year) => (
                                <option key={year.id} value={year.year}>
                                    {year.year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Month:
                        </span>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            currentItems.map((info, index) => (
                                <TableRow key={index}>
                                    <td className="py-2.5 whitespace-nowrap text-gray-700 font-bold">
                                        {info.application_id}
                                    </td>
                                    <td className="py-2.5 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                        <div className="w-[25%]"></div>
                                        <div className="w-[max-content] flex items-center text-left gap-2">
                                            <img
                                                src={info.profile}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                            />
                                            <div>
                                                <p className="font-bold text-xs">
                                                    {info.last_name +
                                                        ", " +
                                                        info.first_name}{" "}
                                                    {info.middle_name
                                                        ? info.middle_name[0] +
                                                          "."
                                                        : ""}
                                                </p>
                                                <p className="text-[11px] text-gray-500">
                                                    {info.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap font-medium">
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
                                    <td className="py-2.5 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.date_submitted)}
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap text-center font-medium">
                                        <button
                                            onClick={() =>
                                                handleViewDetails(info)
                                            }
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <Eye className="w-4 h-4 text-blue-600" />
                                        </button>
                                    </td>
                                </TableRow>
                            ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && !loading && (
                        <EmptyState message="No duty report found." />
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
