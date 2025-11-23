import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import TableToolbar from "../../../components/TableToolbar";
import { allowanceCyclesTableHeaders } from "../../../constant/tableHeaders";
import Table from "../../../components/Table";
import TableRow from "../../../components/TableRow";
import PageContent from "../../../components/PageContent";
import { date } from "../../../utils/getDateAndTime";
import useMonthlyAllowanceSummary from "../../../hooks/useMonthlyAllowanceSummary";
import { formatDate } from "../../../utils/formatDate";
import { DownloadIcon } from "lucide-react";
import { formatMonth } from "../../../utils/formatMonth";
import { useDownloadExcel } from "../../../hooks/useDownloadExcel";
import { toast } from "react-toastify";

export default function MonthlyAllowanceSummaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("newest");
    const [year, setYear] = useState(date.getCurrentYear());
    const [month, setMonth] = useState("all_months");
    const [status, setStatus] = useState("all");

    const { loading, allowanceCycles, fetchAllowanceCycles } =
        useMonthlyAllowanceSummary(month, year);
    const { downloadExcel } = useDownloadExcel();

    useEffect(() => {
        fetchAllowanceCycles();
    }, [month, year]);

    console.log(allowanceCycles);

    // Filter data based on search term
    const filteredAllowanceCycles = allowanceCycles.filter((cycle) => {
        const term = searchTerm.trim().toLowerCase();

        return cycle.cycle_month.includes(term);
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
    } = usePagination(filteredAllowanceCycles, itemsPerPage);

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleDownloadExcel = (item) => {
        if (!item.is_processed) {
            toast.warn(
                `No file available for this month. Allowance was not processed.`
            );
            return;
        }

        downloadExcel(item.id, item.file_name);
    };

    const handleRefresh = () => {
        fetchAllowanceCycles();
    };

    return (
        <PageContent>
            <TableToolbar
                items={allowanceCycles}
                label={"Monthly Allowance Summary"}
                placeholder={"allowance cycles"}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
                sortedItems={filteredAllowanceCycles}
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
                    <span className="text-xs text-gray-600">Year:</span>
                    <select
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all_years">All Years</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Month:</span>
                    <select
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value={"all_months"}>All Months</option>
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
                <Table tableHeaders={allowanceCyclesTableHeaders}>
                    {currentItems.map((item) => (
                        <TableRow key={item.id}>
                            <td className="py-5 whitespace-nowrap text-xs">
                                {formatMonth(item.cycle_month)}
                            </td>
                            <td className="py-3 whitespace-nowrap text-xs">
                                {formatMonth(item.allowance_month) || "--"}
                            </td>
                            <td className="py-3 whitespace-nowrap text-xs">
                                {formatDate(item.cutoff_date)}
                            </td>
                            <td className="py-3 whitespace-nowrap text-xs">
                                <span
                                    className={`py-1 px-3 rounded-full ${
                                        item.is_processed
                                            ? "bg-green-100 text-green-800"
                                            : !item.is_processed &&
                                                date.getCurrentYearMonth() >
                                                    item.cycle_month.slice(0, 7)
                                              ? "bg-orange-100 text-orange-800"
                                              : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {item.is_processed
                                        ? "Processed"
                                        : !item.is_processed &&
                                            date.getCurrentYearMonth() >
                                                item.cycle_month.slice(0, 7)
                                          ? "Skipped"
                                          : "Pending"}
                                </span>
                            </td>
                            <td className="py-3 whitespace-nowrap text-xs">
                                {formatDate(item.processed_at) || "--"}
                            </td>
                            <td className="py-1 whitespace-nowrap text-right font-medium">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            handleDownloadExcel(item)
                                        }
                                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                        title="Download File"
                                    >
                                        <DownloadIcon className="w-4 h-4" />
                                    </button>
                                </div>
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
            {filteredAllowanceCycles.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevious={goToPreviousPage}
                        onNext={goToNextPage}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={filteredAllowanceCycles.length}
                        itemLabel={"applications"}
                    />
                </div>
            )}
        </PageContent>
    );
}
