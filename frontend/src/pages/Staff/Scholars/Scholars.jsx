import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { scholarButtons } from "../../../constant/tableToolbarButtons";
import { useScholars } from "../../../hooks/useScholars";
import { scholarTableHeaders } from "../../../constant/tableHeaders";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { Eye } from "lucide-react";

export default function Scholars() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("all");
    const [status, setStatus] = useState("all");
    const [schoolYear, setSchoolYear] = useState("all_years");
    const [sortBy, setSortBy] = useState("newest");

    const { scholars, fetchScholars } = useScholars(
        activeTab,
        status,
        schoolYear,
        sortBy
    );
    const { profilePics, fetchAllPics } = useProfilePicture(scholars);

    useEffect(() => {
        fetchScholars();
        fetchAllPics();
    }, [activeTab, status, schoolYear, sortBy]);

    // Filter data based on search term
    const filteredScholars = scholars.filter(
        (applicant) =>
            applicant.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.created_at.includes(searchTerm)
    );

    // Sort applications
    // const sortedScholars = [...filteredScholars].sort((a, b) => {
    //     switch (sortBy) {
    //         case "newest":
    //             return new Date(b.created_at) - new Date(a.created_at);
    //         case "oldest":
    //             return new Date(a.created_at) - new Date(b.created_at);
    //         case "name":
    //             return a.first_name.localeCompare(b.first_name);
    //         case "rendered_asc":
    //             return a.rendered_hours - b.rendered_hours;
    //         case "rendered_desc":
    //             return b.rendered_hours - a.rendered_hours;
    //         default:
    //             return 0;
    //     }
    // });

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(filteredScholars, itemsPerPage);

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSelectedItems([]);
    };

    const handleRefresh = () => {
        fetchScholars();
        setSelectedItems([]);
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    items={scholars}
                    label={"Scholars"}
                    placeholder={"scholars"}
                    tab={activeTab}
                    buttons={scholarButtons}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={filteredScholars}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
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
                            <option value="active">Active</option>
                            <option value="deactivated">Deactivated</option>
                            {activeTab !== "new" && (
                                <option value="not_renewed">Not Renewed</option>
                            )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            School Year:
                        </span>
                        <select
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all_years">All Years</option>
                            <option value="2025-2026">2025-2026</option>
                            <option value="2024-2025">2024-2025</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </TableToolbar>

                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={scholarTableHeaders}>
                        {currentItems.map((scholar, index) => (
                            <tr
                                key={index}
                                className={`border-b border-gray-100 transition-colors text-center hover:bg-gray-50 ${
                                    selectedItems.includes(scholar.account_id)
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <td className="py-3 whitespace-nowrap text-center text-gray-900 font-bold">
                                    {scholar.account_id}
                                </td>
                                <td className="py-3 text-center flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[30%]"></div>
                                    <div className="w-[max-content] flex text-left gap-2">
                                        <img
                                            src={
                                                profilePics[scholar.account_id]
                                            }
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div>
                                            <p className="font-bold">
                                                {scholar.first_name +
                                                    " " +
                                                    scholar.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {scholar.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 whitespace-nowrap text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium ${
                                            scholar.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : scholar.status ===
                                                  "deactivated"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {scholar.status === "active"
                                            ? "Active"
                                            : scholar.status === "deactivated"
                                            ? "Deactivated"
                                            : "Not Renewed"}
                                    </span>
                                </td>
                                <td className="py-3 whitespace-nowrap text-slate-600 text-center font-medium">
                                    {scholar.rendered_hours} hour
                                    {scholar.rendered_hours > 1 ? "s" : ""}
                                </td>
                                <td className="py-3 whitespace-nowrap font-medium">
                                    <div className="flex items-center justify-center">
                                        <button
                                            // onClick={() =>
                                            //     viewPdf(info.application_id)
                                            // }
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="View PDF"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No applications found." />
                    )}
                </div>

                {/* Pagination */}
                {filteredScholars.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredScholars.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
