import React from "react";

const Pagination = ({
    indexOfFirstItem, 
    indexOfLastItem,
    totalItems,
    onNext, 
    onPrevious,
    currentPage,
    totalPages,
    itemLabel = 'items'
}) => {
    return (
        <>
            <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, totalItems)} of{" "}
                {totalItems} {itemLabel}
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                        currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-600 transition-all"
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-4 py-2 rounded-md ${
                        currentPage === totalPages || totalPages === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                    }`}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default Pagination;