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
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useAuditLogs } from "../../../hooks/useAuditLogs";
import { date } from "../../../utils/getDateAndTime";
import { formatTimestamp } from "../../../utils/formatTimestamp";
import { formatDateTime } from "../../../utils/formatDateTime";
import DetailsModal from "./DetailsModal";

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);
    const [status, setStatus] = useState(null);
    const [action, setAction] = useState("activate");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { auditLogs, fetchAuditLogs, loading } = useAuditLogs();

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    // Filter data based on search term
    const filteredAuditLogs = auditLogs.filter(
        (auditLog) =>
            auditLog.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            auditLog.user_role
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            auditLog.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            auditLog.entity_type
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const sortedAuditLogs = [...filteredAuditLogs].sort((a, b) => {
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
    } = usePagination(sortedAuditLogs, itemsPerPage);

    const handleRefresh = () => {
        fetchAuditLogs();
    };

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
                    onChangeCurrentPage={setCurrentPage}
                    // addButton={true}
                    // button={{
                    //     icon: <Plus className="w-4 h-4 text-white" />,
                    //     label: "New Staff Account",
                    // }}
                />

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={auditLogsHeaders}>
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
                            currentItems.map((auditLog, index) => (
                                <tr
                                    key={index}
                                    className="text-center text-xs border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="pr-4 py-4 text-gray-600 whitespace-nowrap">
                                        {auditLog.user_id ? (
                                            <span>
                                                {auditLog.user_role === "staff"
                                                    ? auditLog?.staff_first_name +
                                                      " " +
                                                      auditLog?.staff_last_name
                                                    : auditLog.user_role ===
                                                        "scholar"
                                                      ? auditLog?.scholar_first_name +
                                                        " " +
                                                        auditLog?.scholar_last_name
                                                      : auditLog?.admin_name}
                                            </span>
                                        ) : (
                                            <span>{auditLog.actor}</span>
                                        )}
                                    </td>
                                    <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        {auditLog.user_role
                                            .charAt(0)
                                            .toUpperCase()
                                            .concat(
                                                auditLog.user_role.substring(1),
                                            )}
                                    </td>
                                    <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        {auditLog.action}
                                    </td>
                                    {/* <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        {auditLog.description}
                                    </td> */}
                                    <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        {auditLog.entity_type}
                                    </td>
                                    <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        {auditLog.entity_id}
                                    </td>
                                    <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        --
                                    </td>
                                    <td className="pr-4 py-2.5 text-gray-600 whitespace-nowrap">
                                        {formatDateTime(auditLog.created_at)}
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap font-medium">
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setSelectedLog(auditLog);
                                                }}
                                                // onClick={() => {
                                                //     setIsModalOpen(true);
                                                //     onSelectScholarId(
                                                //         account.account_id,
                                                //     );
                                                //     onSelectScholar([
                                                //         account[0],
                                                //         account[1],
                                                //         account.account_id,
                                                //     ]);
                                                //     setModal(
                                                //         "view_profile_modal",
                                                //     );
                                                // }}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors" />
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

                <div className="flex justify-end items-center mt-6">
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

            <DetailsModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                data={selectedLog}
            />
        </div>
    );
};

export default AuditLogs;
