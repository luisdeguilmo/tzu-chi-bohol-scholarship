import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import {
    auditLogsHeaders,
    schoolYearsHeaders,
} from "../../../constant/tableHeaders";
import { CircleCheckBig, Eye, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useSchoolYears } from "../../../hooks/useSchoolYears";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useAuditLogs } from "../../../hooks/useAuditLogs";

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
    const [status, setStatus] = useState(null);
    const [action, setAction] = useState("activate");
    const { auditLogs, fetchAuditLogs, loading } = useAuditLogs();

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    // Filter data based on search term
    const filteredAuditLogs = auditLogs.filter((auditLog) =>
        auditLog.action.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedAuditLogs = [...filteredAuditLogs].sort((a, b) => {
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

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(sortedAuditLogs, itemsPerPage);

    const handleRefresh = () => {};

    return (
        <div className="lg:p-6">
            {/* <EventForm onSuccess={fetchEvents} /> */}
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                <TableToolbar
                    items={auditLogs}
                    label={"Audit Logs"}
                    placeholder={"audit logs"}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedAuditLogs}
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
                    <Table tableHeaders={auditLogsHeaders}>
                        {currentItems.map((auditLog) => (
                            <tr
                                key={auditLog.id}
                                className="text-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {/* School Year */}
                                <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    {auditLog.user_id}
                                </td>
                                <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    {auditLog.user_role}
                                </td>
                                <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    {auditLog.action}
                                </td>
                                <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    {auditLog.entity_type}
                                </td>
                                 <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    {auditLog.entity_id}
                                </td>
                                 <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    --
                                </td>
                                 <td className="pr-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                                    {auditLog.created_at}
                                </td>
                            </tr>
                        ))}
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No school years found." />
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    {/* Pagination */}
                    {auditLogs.length > 0 && (
                        <div className="flex justify-end gap-4 items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={goToPreviousPage}
                                onNext={goToNextPage}
                                indexOfFirstItem={indexOfFirstItem}
                                indexOfLastItem={indexOfLastItem}
                                totalItems={filteredAuditLogs.length}
                                itemLabel={"audit logs"}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                // isLoading={isLoading}
                label={"Confirmation"}
                message={"Are you sure you want to activate 2026–2027 ? "}
                onClick={() =>
                    handleSchoolYearStatusChange(
                        selectedSchoolYear,
                        status,
                        action,
                    )
                }
            /> */}
        </div>
    );
};

export default AuditLogs;
