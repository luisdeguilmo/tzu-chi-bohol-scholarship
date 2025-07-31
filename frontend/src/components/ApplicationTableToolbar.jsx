import { useState } from "react";
import { useBatch } from "../context/BatchContext";
import { usePagination } from "../hooks/usePagination";
import SearchInput from "./SearchInput";
import { ChevronDown, ChevronUp } from "lucide-react";

const ApplicationTableToolbar = ({
    buttons,
    activeTab,
    handleChangeTab,
    searchTerm,
    setSearchTerm,
    searchPlaceholder,
    batches,
    selectedApplicants,
    handleApplicantsChange,
    onRefresh,
}) => {
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState("All");

    const { setPageNum, selectedBatchInBatches, setSelectedBatchInBatches } =
        useBatch();

    const handleBatchChange = async (value) => {
        setSelectedBatch(value);
        setSelectedBatchInBatches(value);
        setPageNum(1);
        setIsDotMenuOpen(false);
        await onRefresh(activeTab, selectedBatchInBatches);
    };
    
    const handleStatusChange = () => {};

    return (
        <div className="flex justify-between items-center mb-4">
            <div className="w-full flex items-center space-x-4">
                <nav className="mr-auto space-x-2">
                    {buttons.map((button) => (
                        <button
                            onClick={() => handleChangeTab(button.tabName)}
                            className={`${
                                activeTab === button.tabName
                                    ? "bg-slate-800 text-white"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-slate-50"
                            } rounded-md whitespace-nowrap px-3 py-1.5 font-medium text-sm`}
                        >
                            {button.name}
                        </button>
                    ))}
                </nav>
                {/* Batch Dropdown - FIX: Use id as value instead of batch_name */}
                <div className="relative text-sm">
                    <select className="appearance-none bg-slate-50 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500">
                        <option value={new Date()}>Sort By</option>
                        <option value="">Asc</option>
                        <option value="">Desc</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
                <div className="relative text-sm">
                    <select className="appearance-none bg-slate-50 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500">
                        <option value={new Date()}>Year</option>
                        <option value="">2025</option>
                        <option value="">2026</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>

                {activeTab === "Batches" || activeTab === "Result" ? (
                    <>
                        <div className="relative">
                            <button
                                onClick={() => setIsDotMenuOpen(true)}
                                className="flex items-center gap-3 text-sm p-2 capitalize text-slate-900 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70"
                            >
                                {selectedBatch}
                                <ChevronDown width={16} />
                            </button>

                            {/* Modern Dropdown Menu */}
                            {isDotMenuOpen && (
                                <div className="absolute top-10 left-[50%] translate-x-[-50%] p-1 rounded-xl bg-white shadow-xl border border-slate-200/50 backdrop-blur-sm z-[999] w-[120px]">
                                    <button
                                        key={'All'}
                                        onClick={() =>
                                            handleBatchChange('all')
                                        }
                                        className="w-full text-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors duration-150"
                                    >
                                        All
                                    </button>
                                    {batches.map((batch) => (
                                        <button
                                            key={batch.id}
                                            onClick={() =>
                                                handleBatchChange(
                                                    batch.batch_name
                                                )
                                            }
                                            className="w-full text-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors duration-150"
                                        >
                                            {batch.batch_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative text-sm">
                            <select
                                value={selectedBatchInBatches}
                                onChange={handleBatchChange}
                                className="appearance-none bg-slate-50 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                            >
                                <option value="all">All Batches</option>
                                {batches.map((batch) => (
                                    <option
                                        key={batch.id}
                                        value={batch.batch_name}
                                    >
                                        {batch.batch_name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </>
                ) : (
                    <div></div>
                )}

                {activeTab === "Result" && (
                    <>
                        <div className="relative text-sm">
                            <select
                                value={selectedApplicants}
                                onChange={handleApplicantsChange}
                                className="appearance-none bg-slate-50 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                            >
                                <option value="all">All</option>
                                <option value="passed">Passed</option>
                                <option value="failed">Failed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationTableToolbar;
