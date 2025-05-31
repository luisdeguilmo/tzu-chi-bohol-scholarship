// import { useState, useMemo } from 'react';

// export const usePagination = (items, itemsPerPage = 5) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(0);

//     const totalPages = Math.ceil(items.length / itemsPerPage);
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//     const currentItems = useMemo(() => 
//         items.slice(indexOfFirstItem, indexOfLastItem), [items, indexOfFirstItem, indexOfLastItem]
//     );

//     const goToPreviousPage = () => {
//         setCurrentPage((prev) => Math.max(prev - 1, 1));
//         setNumberOfItemsPerPage(numberOfItemsPerPage - itemsPerPage);
//     };

//     const goToNextPage = () => {
//         setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//         setNumberOfItemsPerPage(numberOfItemsPerPage + itemsPerPage);
//     };

//     return {
//         currentPage,
//         totalPages,
//         currentItems,
//         numberOfItemsPerPage,
//         indexOfFirstItem,
//         indexOfLastItem,
//         goToNextPage,
//         goToPreviousPage
//     };
// };

import { useState, useMemo } from "react";

export const usePagination = (items, itemsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(0);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentItems = useMemo(() => 
        items.slice(indexOfFirstItem, indexOfLastItem),
        [items, indexOfFirstItem, indexOfLastItem]
    );

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        setNumberOfItemsPerPage(prev => Math.max(prev - itemsPerPage, 0));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        setNumberOfItemsPerPage(prev => prev + itemsPerPage);
    };

    const resetPagination = () => {
        setCurrentPage(1);
        setNumberOfItemsPerPage(0);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
        resetPagination,
    };
};