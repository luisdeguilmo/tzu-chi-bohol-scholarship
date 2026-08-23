import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useScholars } from "../../../hooks/useScholars";
import {
    scholarsAndAllowancesTableHeaders,
    scholarTableHeaders,
} from "../../../constant/tableHeaders";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { Eye, PenLine, SettingsIcon } from "lucide-react";
import ScholarProfileModal from "../../../components/UserProfileModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useAllowanceCycle } from "../../../hooks/useAllowanceCycle";
import { date } from "../../../utils/getDateAndTime";
import { useScholarAllowances } from "../../../hooks/useScholarAllowances";
import { generateExcel } from "../../../utils/generateExcel";
import { useScholarInformation } from "../../../hooks/useScholarInformation";
import { useResetAllowances } from "../../../hooks/useResetAllowances";
import ChangeStatusModal from "./ChangeStatusModal";
import AllowanceSettingsModal from "./AllowanceSettingsModal";
import { useAllowanceSettings } from "../../../hooks/useAllowanceSettings";
import { toast } from "react-toastify";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

export default function ScholarsAndAllowances() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] =
        useState(false);
    const [isAllowanceSettingsModalOpen, setIsAllowanceSettingsModalOpen] =
        useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [isResetConfirmationModalOpen, setIsResetConfirmationModalOpen] =
        useState(false);
    const [scholarId, setScholarId] = useState(null);
    const [selectedScholar, setSelectedScholar] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [school, setSchool] = useState("all");
    const [course, setCourse] = useState("all");
    const [yearLevel, setYearLevel] = useState("all");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("active");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [filter, setFilter] = useState("all");

    const { schoolYears, activeSchoolYear: schoolYear } =
        useSchoolYearContext();

    const {
        loading,
        scholars,
        fetchScholars,
        processAllowance,
        updateAllowanceStatus,
    } = useScholars(
        "active",
        status,
        schoolYear,
        school,
        course,
        yearLevel,
        sortBy,
        filter,
    );

    const {
        loading: isLoading,
        isProcessed,
        fetchStatus,
        startNewCycle,
    } = useAllowanceCycle();

    const { resetAllowances } = useResetAllowances();
    const { scholarAllowances, fetchScholarAllowances } =
        useScholarAllowances();
    const { exportAllowancesToExcel, exportScholarInformationToExcel } =
        generateExcel();
    const { allowanceSettings, fetchMaximumHoursAndAmountPerHour } =
        useAllowanceSettings();

    useEffect(() => {
        fetchScholars();
    }, [
        activeTab,
        status,
        schoolYear,
        school,
        course,
        yearLevel,
        sortBy,
        filter,
    ]);

    useEffect(() => {
        if (!isAllowanceSettingsModalOpen) {
            fetchMaximumHoursAndAmountPerHour();
        }
    }, [isAllowanceSettingsModalOpen]);

    useEffect(() => {
        fetchMaximumHoursAndAmountPerHour();
    }, [isConfirmationModalOpen]);

    const handleAllowanceOverview = async () => {
        try {
            if (
                allowanceSettings?.maximum_hours === 0 ||
                allowanceSettings?.amount_per_hour === 0
            ) {
                toast.error(
                    "Please set the allowance settings before processing allowances.",
                );
                setIsConfirmationModalOpen(false);
                return;
            }

            const fileName = `Scholar_Allowances_${date.getCurrentMonthFormatted()}_${date.getCurrentYear()}`;

            // Step 1: Process allowance
            const success = await processAllowance(
                "process_overview_allowance",
            );

            if (success) {
                // Step 2: Export to Excel (this also uploads to database)
                const exported = await exportAllowancesToExcel(
                    scholarAllowances,
                    fileName,
                );

                // if (exported) {
                //     // Step 3: Reset allowances after successful export
                //     await resetAllowances();

                //     // Step 4: Refresh data
                //     await Promise.all([fetchScholars(), fetchStatus()]);
                // }
            }

            // Close modal after all operations
            // setIsConfirmationModalOpen(false);
        } catch (error) {
            console.error("Error during allowance processing:", error);
            setIsConfirmationModalOpen(false);
            // Consider showing an error message to the user here
        }
    };

    const handleProcessAllowance = async () => {
        try {
            if (
                allowanceSettings?.maximum_hours === 0 ||
                allowanceSettings?.amount_per_hour === 0
            ) {
                toast.error(
                    "Please set the allowance settings before processing allowances.",
                );
                setIsConfirmationModalOpen(false);
                return;
            }

            const fileName = `Scholar_Allowances_${date.getCurrentMonthFormatted()}_${date.getCurrentYear()}`;

            // Step 1: Process allowance
            const success = await processAllowance("process_final_allowance");

            if (success) {
                // Step 2: Export to Excel (this also uploads to database)
                const exported = await exportAllowancesToExcel(
                    scholarAllowances,
                    fileName,
                    "process_final_allowance",
                );

                if (exported) {
                    // Step 3: Reset allowances after successful export
                    await resetAllowances();

                    // Step 4: Refresh data
                    await Promise.all([fetchScholars(), fetchStatus()]);
                }
            }

            // Close modal after all operations
            setIsConfirmationModalOpen(false);
        } catch (error) {
            console.error("Error during allowance processing:", error);
            setIsConfirmationModalOpen(false);
            // Consider showing an error message to the user here
        }
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
            applicant?.account_id?.toString().includes(searchTerm.toString()) ||
            applicant?.last_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.created_at?.includes(searchTerm),
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
    };

    const handleRefresh = () => {
        fetchStatus();
        fetchScholars(activeTab, status, schoolYear, sortBy);
        fetchMaximumHoursAndAmountPerHour();
    };

    return (
        <div className="bg-gray-50 lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    isProcessed={isProcessed}
                    items={scholars}
                    label={"Scholars and Allowances"}
                    placeholder={"scholars"}
                    tab={activeTab}
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
                        {
                            label: "Rendered Hours (ASC)",
                            value: "hours_asc",
                        },
                        {
                            label: "Rendered Hours (DESC)",
                            value: "hours_desc",
                        },
                    ]}
                    sortedItems={filteredScholars}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
                    onChangeCurrentPage={setCurrentPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={activeTab === "active"}
                    buttonLabel={"Process Allowance"}
                    onOpen={setIsConfirmationModalOpen}
                >
                    <div className="flex items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Filter:
                        </span>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="no_load_allowance">
                                No load allowance
                            </option>
                            <option value="no_transport_allowance">
                                No transport allowance
                            </option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
                                className="px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="all_years">All Years</option>
                                <option value="2025-2026">2025-2026</option>
                                <option value="2024-2025">2024-2025</option>
                            </select>
                        </div>
                    )}
                </TableToolbar>

                <div className="overflow-x-auto rounded-[4px]">
                    <Table tableHeaders={scholarsAndAllowancesTableHeaders}>
                        {loading && (
                            <tr>
                                <td colSpan={6} className="p-6">
                                    <div className=" flex flex-col items-center gap-4">
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
                            currentItems.map((scholar, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-100 transition-colors text-center hover:bg-gray-50`}
                                >
                                    <td className="py-2.5 text-xs whitespace-nowrap text-center text-gray-600 font-bold">
                                        {scholar.account_id}
                                    </td>
                                    <td className="py-2.5 text-center flex justify-start whitespace-nowrap text-sm text-gray-700">
                                        <div className="w-[30%]"></div>
                                        <div className="w-[max-content] flex text-left gap-2">
                                            <img
                                                src={scholar[1].profile}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                            />
                                            <div className="flex justify-center flex-col">
                                                <p className="font-bold text-gray-700 text-xs">
                                                    {scholar.last_name +
                                                        ", " +
                                                        scholar.first_name}{" "}
                                                    {scholar.middle_name
                                                        ? scholar
                                                              .middle_name[0] +
                                                          "."
                                                        : ""}
                                                </p>
                                                <p className="text-[11px] text-gray-500/90">
                                                    {scholar.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 text-center whitespace-nowrap text-gray-500">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium`}
                                        >
                                            {scholar.type}
                                        </span>
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap text-slate-600 text-center font-medium">
                                        {scholar.rendered_hours} hour
                                        {scholar.rendered_hours > 1 ? "s" : ""}
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap text-slate-600 text-center font-medium">
                                        {scholar.load_allowance}
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap text-slate-600 text-center font-medium">
                                        {scholar.transport_allowance}
                                    </td>
                                    <td className="py-2.5 whitespace-nowrap font-medium">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setScholarId(
                                                        scholar.account_id,
                                                    );
                                                    setSelectedScholar([
                                                        scholar[0],
                                                        scholar[1],
                                                        scholar.account_id,
                                                    ]);
                                                }}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {activeTab === "active" && (
                                                <button
                                                    onClick={() => {
                                                        setIsChangeStatusModalOpen(
                                                            true,
                                                        );
                                                        setScholarId(
                                                            scholar.account_id,
                                                        );
                                                        setSelectedScholar(
                                                            scholar,
                                                        );
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
                    {currentItems.length === 0 && !loading && (
                        <EmptyState message="No scholars found." />
                    )}
                </div>

                {/* Pagination */}
                {filteredScholars.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() =>
                                setIsAllowanceSettingsModalOpen(true)
                            }
                            className="px-3 py-2 text-sm whitespace-nowrap bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <SettingsIcon className="w-4 h-4 text-white" />
                            Allowance Settings
                        </button>

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

                {isModalOpen && (
                    <ScholarProfileModal
                        isOpen={isModalOpen}
                        setIsOpen={setIsModalOpen}
                        isScholar={true}
                        info={selectedScholar}
                    />
                )}

                {isAllowanceSettingsModalOpen && (
                    <AllowanceSettingsModal
                        label={"Allowance Settings"}
                        isOpen={isAllowanceSettingsModalOpen}
                        onClose={setIsAllowanceSettingsModalOpen}
                    />
                )}

                {isChangeStatusModalOpen && (
                    <ChangeStatusModal
                        scholar={selectedScholar}
                        isOpen={isChangeStatusModalOpen}
                        onClose={setIsChangeStatusModalOpen}
                        label={"Update Allowance Details"}
                        scholarId={scholarId}
                        onUpdate={updateAllowanceStatus}
                        onRefresh={handleRefresh}
                        onRefreshAllowanceData={fetchScholarAllowances}
                        isLoading={loading}
                    />
                )}

                {isConfirmationModalOpen && (
                    <ConfirmationModal
                        isOpen={isConfirmationModalOpen}
                        onClose={setIsConfirmationModalOpen}
                        isLoading={loading}
                        label={`Process Allowance for ${date.getCurrentMonthFormatted()}`}
                        message={"This action cannot be undone."}
                        isForProcessAllowance={true}
                        allowanceSettings={allowanceSettings}
                        onClick={handleProcessAllowance}
                        onClickOverview={handleAllowanceOverview}
                    />
                )}
            </div>
        </div>
    );
}
