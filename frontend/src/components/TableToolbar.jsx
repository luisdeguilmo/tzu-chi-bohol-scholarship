import { CheckCircle, Download, RefreshCcw } from "lucide-react";
import SearchInput from "./SearchInput";
import { date } from "../utils/getDateAndTime";

const TableToolbar = ({
    isProcessed = false,
    items,
    label,
    buttonLabel = false,
    placeholder,
    tab,
    searchTerm,
    sortedItems,
    buttons,
    sortBy,
    sortItems = [
        {
            label: "Newest First",
            value: "newest",
        },
        {
            label: "Oldest First",
            value: "oldest",
        },
    ],
    itemsPerPage,
    onChangeItemsPerPage,
    onChangeCurrentPage,
    onChangeNumberOfItemsPerPage = false,
    onSort,
    onSearchChange,
    onRefresh,
    onChangeTab,
    onOpen,
    firstIndex,
    lastIndex,
    addButton = false,
    button,
    buttonExport = false,
    disabledButtonExport = false,
    onExport,
    exportLoading,
    addCreateBatchButton = false,
    passingScore,
    children,
}) => {
    const handleSort = (e) => {
        onSort(e.target.value);
        onChangeCurrentPage(1);
    };
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mb-6">
                <h2 className="self-start text-lg font-bold text-slate-700">
                    {label}
                </h2>
                <div className="flex w-full md:w-[max-content] items-center gap-3">
                    <button
                        onClick={onRefresh}
                        className="flex-1 md:flex-none px-3 py-2.5 text-xs md:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex justify-center items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh
                    </button>
                    {addButton && !buttonLabel && (
                        <button
                            onClick={() => onOpen(true)}
                            className="flex-1 md:flex-none px-3 py-2.5 text-xs md:text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex justify-center items-center gap-2"
                        >
                            {button?.icon}
                            {button?.label}
                        </button>
                    )}

                    {addButton && buttonLabel === "Process Allowance" && (
                        <>
                            {isProcessed ? (
                                <button
                                    disabled={isProcessed} // boolean flag
                                    className={`flex-1 md:flex-none px-3 py-2 text-sm rounded-lg flex justify-center items-center gap-2 transition-colors duration-200 
                                ${
                                    isProcessed
                                        ? "bg-gray-400 text-gray-200 cursor-not-allowed" // Disabled styling
                                        : "bg-green-600 hover:bg-green-700 text-white" // Enabled styling
                                }`}
                                >
                                    <CheckCircle
                                        className={`w-4 h-4 ${isProcessed ? "text-gray-200" : "text-white"}`}
                                    />
                                    Processed
                                </button>
                            ) : (
                                <button
                                    onClick={() => onOpen(true)}
                                    className="flex-1 md:flex-none px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex justify-center items-center gap-2"
                                >
                                    <RefreshCcw className="w-4 h-4 text-white" />
                                    {buttonLabel} {" for "}{" "}
                                    {date.getCurrentMonthFormatted()}
                                </button>
                            )}
                        </>
                    )}

                    {buttonExport && (
                        <button
                            onClick={onExport}
                            disabled={disabledButtonExport}
                            className={`flex-1 md:flex-none px-4 py-2 text-sm rounded-lg flex justify-center items-center gap-2 transition-colors duration-200 
             text-white  ${disabledButtonExport ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                        >
                            {exportLoading ? (
                                <svg
                                    className="w-4 h-4 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            ) : (
                                <Download className="w-4 h-4 text-white" />
                            )}
                            {exportLoading ? "Exporting..." : "Export"}
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-slate-100">
                {/* Top Row - Tabs and Search */}
                <div className="flex justify-between items-center mb-4 gap-2 flex-col sm:flex-row">
                    {/* Tab Navigation */}
                    {buttons && (
                        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border w-full sm:w-[max-content]">
                            {buttons?.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={() => onChangeTab(button?.tabName)}
                                    className={`flex-1 sm:flex-none sm:px-4 py-1.5 rounded-md text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 ${
                                        tab === button?.tabName
                                            ? "bg-green-600 text-white shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    {button?.name}
                                    {button.count && (
                                        <span
                                            className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                                tab === button?.tabName
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {button.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search Input */}
                    <div
                        className={`flex items-center gap-3 w-full ${
                            buttons ? "sm:w-[max-content]" : "w-full"
                        }`}
                    >
                        <SearchInput
                            searchTerm={searchTerm}
                            onSearchChange={onSearchChange}
                            placeholder={`Search ${placeholder}...`}
                        />
                    </div>
                </div>

                {/* Bottom Row - Controls */}
                <div className="mt-4 flex flex-col md:flex-row justify-between items-end">
                    {/* Left side - Selection info and actions */}
                    <div className="self-start md:self-end flex items-center gap-3 mb-4 md:mb-0">
                        <p className="text-xs text-slate-700">
                            Total {placeholder}: {items.length}
                        </p>
                    </div>

                    {/* Right side - Sort and view options */}
                    <div className="flex flex-col gap-3 md:flex-row md:gap-6 w-full md:w-[max-content]">
                        {children}
                        {/* <FilterDropdown
                            label={"Sort"}
                            value={sortBy}
                            onChange={(e) => {
                                onSort(e.target.value);
                                onChangeCurrentPage(1);
                            }}
                            options={[
                                { name: "Newest First", value: "newest" },
                                { name: "Oldest First", value: "oldest" },
                            ]}
                        /> */}
                        <div className="flex items-center gap-2">
                            <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                                Sort:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    onSort(e.target.value);
                                    onChangeCurrentPage(1);
                                }}
                                className="px-3 w-full py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                {sortItems.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                                Show:
                            </span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    onChangeItemsPerPage(
                                        Number(e.target.value),
                                    );
                                    onChangeCurrentPage(1);
                                    if (onChangeNumberOfItemsPerPage) {
                                        onChangeNumberOfItemsPerPage(0);
                                    }
                                }}
                                className="px-3 w-full py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-xs text-gray-600">
                    Showing {firstIndex + 1} to{" "}
                    {Math.min(lastIndex, sortedItems.length)} of{" "}
                    {sortedItems.length} {placeholder}
                </div>
                {searchTerm && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Search results for "{searchTerm}"
                        </span>
                        <button
                            onClick={() => onSearchChange("")}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default TableToolbar;
