import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { staffAccountHeaders } from "../../../constant/tableHeaders";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";
import { formatDateTime } from "../../../utils/formatDateTime";
import FormModal from "./FormModal";

const StaffAccounts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const { staffAccounts, fetchStaffAccounts } = useStaffAccounts();

    useEffect(() => {
        fetchStaffAccounts();
    }, []);

    // Filter data based on search term
    const filteredStaffAccounts = staffAccounts.filter(
        (staff) =>
            staff.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedStaffAccounts = [...filteredStaffAccounts].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date) - new Date(a.date);
            case "oldest":
                return new Date(a.date) - new Date(b.date);
            case "name":
                return a.first_name.localeCompare(b.first_name);
            default:
                return 0;
        }
    });

    const handleOpenDetailsModal = (event) => {
        setSelectedEvent(event);
        setIsOpenEventDetailsModal(true);
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
    } = usePagination(sortedStaffAccounts, itemsPerPage);

    const handleRefresh = () => {
        fetchApplications(activeTab);
        setSelectedItems([]);
    };

    return (
        <div className="lg:p-6">
            {/* <EventForm onSuccess={fetchEvents} /> */}
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={staffAccounts}
                    label={"Staff Accounts"}
                    placeholder={"staff accounts"}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedStaffAccounts}
                    onOpen={setIsFormModalOpen}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeItemsPerPage={setItemsPerPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={true}
                />

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={staffAccountHeaders}>
                        {currentItems.map((staff) => (
                            <tr
                                key={staff.account_id}
                                className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="py-5 whitespace-nowrap text-gray-700">
                                    {staff.account_id}
                                </td>
                                <td className="py-5 whitespace-nowrap text-gray-700 font-bold">
                                    {staff.first_name} {staff.last_name}
                                </td>
                                <td className="py-3 whitespace-nowrap text-xs text-gray-700">
                                    {staff.email}
                                </td>
                                <td className="py-3 whitespace-nowrap text-gray-500">
                                    {formatDateTime(staff.created_at)}
                                </td>
                                <td className="py-3 whitespace-nowrap font-medium">
                                    <button className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3">
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
                                        Edit
                                    </button>
                                    <button className="inline-flex items-center text-red-600 hover:text-red-900">
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
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No events found." />
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    {/* Pagination */}
                    {staffAccounts.length > 0 && (
                        <div className="flex justify-end gap-4 items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={goToPreviousPage}
                                onNext={goToNextPage}
                                indexOfFirstItem={indexOfFirstItem}
                                indexOfLastItem={indexOfLastItem}
                                totalItems={filteredStaffAccounts.length}
                                itemLabel={"events"}
                            />
                        </div>
                    )}
                </div>
            </div>

            <FormModal
                isOpen={isFormModalOpen}
                onClose={setIsFormModalOpen}
                onSuccess={fetchStaffAccounts}
            />
        </div>
    );
};

export default StaffAccounts;
