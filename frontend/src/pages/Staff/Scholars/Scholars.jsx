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
import { Eye, PenLine, RotateCcw } from "lucide-react";
import { getCurrentSchoolYear } from "../../../utils/getCurrentSchoolYear";
import ScholarProfileModal from "./ScholarProfileModal";
import ChangeStatusModal from "./ChangeStatusModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useAllowanceCycle } from "../../../hooks/useAllowanceCycle";
import { date } from "../../../utils/getDateAndTime";
import { useScholarAllowances } from "../../../hooks/useScholarAllowances";
import { generateExcel } from "../../../utils/generateExcel";
import { useScholarInformation } from "../../../hooks/useScholarInformation";

export default function Scholars() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] =
        useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [isResetConfirmationModalOpen, setIsResetConfirmationModalOpen] =
        useState(false);
    const [scholarId, setScholarId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedScholar, setSelectedScholar] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("all");
    const [status, setStatus] = useState("all");
    const [schoolYear, setSchoolYear] = useState(getCurrentSchoolYear());
    const [sortBy, setSortBy] = useState("newest");

    const {
        loading,
        scholars,
        fetchScholars,
        processAllowance,
        updateAllowanceStatus,
    } = useScholars(activeTab, status, schoolYear, sortBy);

    const {
        loading: isLoading,
        isProcessed,
        fetchStatus,
        startNewCycle,
    } = useAllowanceCycle();

    const { scholarAllowances, fetchScholarAllowances } =
        useScholarAllowances();
    const { scholarsInformation, fetchScholarsInformation } =
        useScholarInformation(status, schoolYear, sortBy);
    const { exportAllowancesToExcel, exportScholarInformationToExcel } =
        generateExcel();

    console.log(scholarsInformation);

    const { profilePics } = useProfilePicture(scholars);

    useEffect(() => {
        fetchScholars();
    }, [activeTab, status, schoolYear, sortBy]);

    const handleProcessAllowance = async () => {
        try {
            const fileName = `Scholar_Allowances_${date.getCurrentMonth()}_${date.getCurrentYear()}`;

            // Step 1: Export to Excel
            const exported = await exportAllowancesToExcel(
                scholarAllowances,
                fileName
            );

            if (!exported) {
                console.error("Excel export failed, skipping processing");
                return; // stop here if export fails
            }

            // Step 2: Process allowance only if export succeeded
            const success = await processAllowance();

            // Close modal regardless of success/failure
            setIsConfirmationModalOpen(false);

            if (success) {
                // Step 3: Refresh data
                await Promise.all([fetchScholars(), fetchStatus()]);
            } else {
                console.error("Allowance processing failed");
            }
        } catch (error) {
            console.error("Error during allowance processing:", error);
            setIsConfirmationModalOpen(false);
        }
    };

    const handleExport = async () => {
        const fileName = `Scholar_Information_${date.getCurrentMonth()}_${date.getCurrentYear()}`;

        // Step 1: Export to Excel
        await exportScholarInformationToExcel(scholarsInformation, fileName);
    };

    const handleStartNewCycle = async () => {
        const success = await startNewCycle();

        if (success) {
            setIsResetConfirmationModalOpen(false);
            fetchScholars();
        } else {
            setIsResetConfirmationModalOpen(false);
        }
    };

    // Filter data based on search term
    const filteredScholars = scholars.filter(
        (applicant) =>
            applicant?.last_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.created_at?.includes(searchTerm)
    );

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
        fetchStatus();
        fetchScholars(activeTab, status, schoolYear, sortBy);
        setSelectedItems([]);
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    isProcessed={isProcessed}
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
                    buttonExport={activeTab === "active"}
                    onExport={handleExport}
                    addButton={activeTab === "active"}
                    buttonLabel={"Process Allowance"}
                    onOpen={setIsConfirmationModalOpen}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            Filtered by type:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="new">New</option>
                            <option value="old">Old</option>
                        </select>
                    </div>
                    {activeTab !== "active" && (
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
                        </div>
                    )}
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
                                <td className="py-1 text-xs whitespace-nowrap text-center text-gray-600 font-bold">
                                    {scholar.account_id}
                                </td>
                                <td className="py-1 text-center flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[30%]"></div>
                                    <div className="w-[max-content] flex text-left gap-2">
                                        <img
                                            src={
                                                profilePics[scholar.account_id]
                                            }
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div className="flex justify-center flex-col">
                                            <p className="font-bold text-gray-700 text-xs">
                                                {scholar.first_name +
                                                    " " +
                                                    scholar.last_name}
                                            </p>
                                            <p className="text-[11px] text-gray-500/90">
                                                {scholar.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-1 text-center whitespace-nowrap text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium`}
                                    >
                                        {scholar.type}
                                    </span>
                                </td>
                                <td className="py-1 whitespace-nowrap text-slate-600 text-center font-medium">
                                    {scholar.rendered_hours} hour
                                    {scholar.rendered_hours > 1 ? "s" : ""}
                                </td>
                                {/* <td className="py-1 whitespace-nowrap text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium ${
                                            scholar.allowance_status ===
                                            "received"
                                                ? "bg-green-100 text-green-800"
                                                : scholar.allowance_status ===
                                                    "not_received"
                                                  ? "bg-red-100 text-red-800"
                                                  : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {scholar.allowance_status === "received"
                                            ? "Received"
                                            : scholar.allowance_status ===
                                                "not_received"
                                              ? "Not Received"
                                              : "Pending"}
                                    </span>
                                </td> */}
                                <td className="py-1 whitespace-nowrap font-medium">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                setScholarId(
                                                    scholar.account_id
                                                );
                                            }}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="View PDF"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {activeTab === "active" && (
                                            <button
                                                onClick={() => {
                                                    setIsChangeStatusModalOpen(
                                                        true
                                                    );
                                                    setScholarId(
                                                        scholar.account_id
                                                    );
                                                    setSelectedScholar(scholar);
                                                }}
                                                className="p-2 text-green-600 hover:text-green-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                title="Change Status"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                        )}
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
                        {/* {activeTab === "active" && (
                            <button
                                onClick={() =>
                                    setIsResetConfirmationModalOpen(true)
                                }
                                className="px-3 py-2 text-sm whitespace-nowrap bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4 text-white" />
                                Initialize Month
                            </button>
                        )} */}
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

                <ScholarProfileModal
                    scholarId={scholarId}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                />

                <ChangeStatusModal
                    scholar={selectedScholar}
                    isOpen={isChangeStatusModalOpen}
                    onClose={setIsChangeStatusModalOpen}
                    label={"Update Allowance Status"}
                    scholarId={scholarId}
                    onUpdate={updateAllowanceStatus}
                    onRefresh={handleRefresh}
                    onRefreshAllowanceData={fetchScholarAllowances}
                    isLoading={loading}
                />

                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={setIsConfirmationModalOpen}
                    isLoading={loading}
                    label={"Confirmation"}
                    message={
                        "This will calculate the allowance for all scholars with Pending status. This action cannot be undone. Proceed?"
                    }
                    onClick={handleProcessAllowance}
                />

                <ConfirmationModal
                    isOpen={isResetConfirmationModalOpen}
                    onClose={setIsResetConfirmationModalOpen}
                    isLoading={isLoading}
                    label={"Confirmation"}
                    message={
                        "You are about to reset all scholars’ allowance status to Pending. This will start a new allowance cycle and cannot be undone. Do you want to continue?"
                    }
                    onClick={handleStartNewCycle}
                />
            </div>
        </div>
    );
}
