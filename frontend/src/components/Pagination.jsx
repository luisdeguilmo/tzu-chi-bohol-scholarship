const Pagination = ({
    indexOfFirstItem,
    indexOfLastItem,
    totalItems,
    onNext,
    onPrevious,
    currentPage,
    totalPages,
    itemLabel = "items",
}) => {
    return (
        <div className="w-full flex justify-end">
            {/* <div className="text-xs text-gray-500">
                Showing 
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}{" "}
                of {totalItems} {itemLabel}
            </div> */}
            <div className="flex space-x-2 text-xs">
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-sm ${
                        currentPage === 1
                            ? "bg-slate-100 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-600 transition-all"
                    } rounded-lg`}
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1.5 rounded-sm ${
                        currentPage === totalPages || totalPages === 0
                            ? "bg-slate-100 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-600 transition-all"
                    } rounded-lg`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
