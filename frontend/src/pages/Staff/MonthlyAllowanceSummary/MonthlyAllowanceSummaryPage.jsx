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
import { useYearContext } from "../../../context/YearContext";

export default function MonthlyAllowanceSummaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("newest");
    const [year, setYear] = useState(date.getCurrentYear());
    const [month, setMonth] = useState("all_months");
    const [status, setStatus] = useState("all");

    const { years } = useYearContext();
    const { loading, allowanceCycles, fetchAllowanceCycles } =
        useMonthlyAllowanceSummary(month, year, sortBy);
    const { downloadExcel } = useDownloadExcel();

    useEffect(() => {
        fetchAllowanceCycles();
    }, [month, year, sortBy]);

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
            toast.info(
                `No file available for this month. Allowance was not processed.`,
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
                <div className="flex justify-between items-center gap-2">
                    <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                        Year:
                    </span>
                    <select
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all_years">All Years</option>
                        {years.map((year) => (
                            <option key={year.year} value={year.year}>
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
                        onChange={(e) => {
                            setMonth(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value={"all_months"}>All Months</option>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>
            </TableToolbar>

            <div className="overflow-x-auto rounded-[4px]">
                <Table tableHeaders={allowanceCyclesTableHeaders}>
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
                        currentItems.map((item) => (
                            <TableRow key={item.id}>
                                {/* <td className="py-5 whitespace-nowrap text-xs">
                                {formatMonth(item.cycle_month)}
                            </td> */}
                                <td className="py-5 whitespace-nowrap text-xs text-gray-700 font-bold">
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
                                                        item.cycle_month.slice(
                                                            0,
                                                            7,
                                                        )
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
                {currentItems.length === 0 && !loading && (
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
