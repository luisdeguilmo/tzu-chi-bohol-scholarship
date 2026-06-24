import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { schoolYearsHeaders } from "../../../constant/tableHeaders";
import { CircleCheckBig, Eye, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

const SchoolYears = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
    const [status, setStatus] = useState(null);
    const [action, setAction] = useState("activate");
    const [schoolYear, setSchoolYear] = useState("");
    const {
        loading,
        schoolYears,
        activeSchoolYear,
        fetchSchoolYears,
        updateSchoolYearStatus,
    } = useSchoolYearContext();

    // Filter data based on search term
    const filteredSchoolYears = schoolYears.filter((schoolYear) =>
        schoolYear.school_year.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedSchoolYears = [...filteredSchoolYears].sort((a, b) => {
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
        goToPreviousPage,
        goToNextPage,
    } = usePagination(sortedSchoolYears, itemsPerPage);

    const handleSchoolYearStatusChange = async (id, status, action) => {
        if (action === "activate" && status === "active") {
            toast.error("Account is already active.");
            return;
        }

        try {
            const success = await updateSchoolYearStatus(id, action);
            if (success) {
                toast.success(`School year activated successfully.`);
                setIsConfirmationModalOpen(false);
                fetchSchoolYears();
            }
        } catch (error) {
            console.error("Error updating account status:", error);
            toast.error(`Failed to ${action} account. Please try again.`);
        }
    };

    const handleRefresh = () => {
        fetchSchoolYears();
    };

    return (
        <div className="lg:p-6">
            {/* <EventForm onSuccess={fetchEvents} /> */}
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={schoolYears}
                    label={"School Year Management"}
                    placeholder={"school years"}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedSchoolYears}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeItemsPerPage={setItemsPerPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    // addButton={true}
                    // button={{
                    //     icon: <Plus className="w-4 h-4 text-white" />,
                    //     label: "New Staff Account",
                    // }}
                />

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={schoolYearsHeaders}>
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
                            currentItems.map((schoolYear) => (
                                <tr
                                    key={schoolYear.id}
                                    className="text-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {/* School Year */}
                                    <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                        {schoolYear.school_year}
                                    </td>

                                    {/* Status */}
                                    <td className="pr-4 py-2 whitespace-nowrap">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                                schoolYear.status === "active"
                                                    ? "text-green-800 bg-green-100"
                                                    : schoolYear.status ===
                                                        "archived"
                                                      ? "text-blue-800 bg-blue-100"
                                                      : "text-orange-800 bg-orange-100"
                                            }`}
                                        >
                                            {schoolYear.status === "active"
                                                ? "Active"
                                                : schoolYear.status ===
                                                    "archived"
                                                  ? "Archived"
                                                  : "Upcoming"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="pr-4 py-2 whitespace-nowrap">
                                        <div className="flex justify-center items-center gap-3">
                                            {/* <button
                                            title="View Profile"
                                            className="p-2 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                                        </button> */}
                                            <button
                                                onClick={() => {
                                                    setIsConfirmationModalOpen(
                                                        true,
                                                    );
                                                    setSelectedSchoolYear(
                                                        schoolYear.id,
                                                    );
                                                    setStatus(
                                                        schoolYear.status,
                                                    );
                                                    setSchoolYear(
                                                        schoolYear.school_year,
                                                    );
                                                }}
                                                disabled={
                                                    schoolYear.status ===
                                                        "archived" ||
                                                    schoolYear.status ===
                                                        "active"
                                                }
                                                title="Set as Active"
                                                className={`${schoolYear.status === "upcoming" ? "visible" : "invisible"} p-2 rounded-lg hover:bg-green-50 transition`}
                                            >
                                                <CircleCheckBig className="w-4 h-4 text-green-600 hover:text-green-800" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && !loading && (
                        <EmptyState message="No school years found." />
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    {/* Pagination */}
                    {schoolYears.length > 0 && (
                        <div className="flex justify-end gap-4 items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={goToPreviousPage}
                                onNext={goToNextPage}
                                indexOfFirstItem={indexOfFirstItem}
                                indexOfLastItem={indexOfLastItem}
                                totalItems={filteredSchoolYears.length}
                                itemLabel={"school years"}
                            />
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                // isLoading={isLoading}
                label={"Confirmation"}
                message={`Are you sure you want to activate ${schoolYear}?`}
                onClick={() =>
                    handleSchoolYearStatusChange(
                        selectedSchoolYear,
                        status,
                        action,
                    )
                }
            />
        </div>
    );
};

export default SchoolYears;
