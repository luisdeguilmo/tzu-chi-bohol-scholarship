import { CheckCircle, Download, Pen, PenLine, Plus } from "lucide-react";
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
    buttonExport = false,
    onExport,
    addCreateBatchButton = false,
    passingScore,
    children,
}) => {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-600">{label}</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onRefresh}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
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
                    {addButton &&
                        (!buttonLabel ||
                            buttonLabel === "College or University") && (
                            <button
                                onClick={() => onOpen(true)}
                                className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4 text-white" />
                                Add New{" "}
                                {buttonLabel === false
                                    ? label.slice(0, -1)
                                    : buttonLabel}
                            </button>
                        )}
                    {addButton && buttonLabel === "Set Message" && (
                        <button
                            onClick={() => onOpen(true)}
                            className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <PenLine className="w-4 h-4 text-white" />
                            {buttonLabel}
                        </button>
                    )}
                    {addButton && buttonLabel === "Process Allowance" && (
                        <>
                            {isProcessed ? (
                                <button
                                    disabled={isProcessed} // boolean flag
                                    className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors duration-200 
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
                                    className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                    {buttonLabel} {" for "}{" "}
                                    {date.getCurrentMonthFormatted()}
                                </button>
                            )}
                        </>
                    )}
                    {buttonExport && (
                        <button
                            onClick={onExport}
                            className="px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors duration-200 
             text-white bg-green-600 hover:bg-green-700"
                        >
                            <Download className="w-4 h-4 text-white" /> Export
                        </button>
                    )}
                    {addCreateBatchButton &&
                    (tab === "Batches" || tab === "Orientation") ? (
                        <button
                            onClick={() => onOpen(true)}
                            className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            Create New Batch
                        </button>
                    ) : addCreateBatchButton && tab === "Result" ? (
                        <button
                            onClick={() => onOpen(true)}
                            className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <Pen className="w-3.5 h-4 text-white" />
                            {passingScore
                                ? "Edit Passing Score"
                                : "Set Passing Score"}
                        </button>
                    ) : null}
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
                                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
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
                <div className="flex justify-between items-center">
                    {/* Left side - Selection info and actions */}
                    <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-700">
                            Total {placeholder}: {items.length}
                        </p>
                    </div>

                    {/* Right side - Sort and view options */}
                    <div className="flex items-center gap-6">
                        {children}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                                Sort by:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    onSort(e.target.value);
                                    onChangeCurrentPage(1);
                                }}
                                className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    onChangeItemsPerPage(
                                        Number(e.target.value)
                                    );
                                    onChangeCurrentPage(1);
                                    if (onChangeNumberOfItemsPerPage) {
                                        onChangeNumberOfItemsPerPage(0);
                                    }
                                }}
                                className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
