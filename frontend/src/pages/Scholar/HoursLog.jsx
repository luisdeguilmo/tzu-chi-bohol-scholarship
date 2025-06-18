import React, { act, useState } from "react";
import SearchInputMobile from "../../components/SearchInputMobile";
import { formatDate } from "../../utils/formatDate";

export default function HoursLog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 5;

    const activities = [
        {
            id: 1,
            date: "2025-06-05",
            task: "Event Assistant",
            hoursEarned: "3 hrs",
            verifiedBy: "Staff",
        },
        {
            id: 2,
            date: "2025-07-11",
            task: "Cleanup",
            hoursEarned: "2 hrs",
            verifiedBy: "Staff",
        },
        {
            id: 3,
            date: "2025-08-23",
            task: "Event Assistant",
            hoursEarned: "2 hrs",
            verifiedBy: "Staff",
        },
    ];

    const handleDelete = (id) => {
        const updatedDocuments = activities.filter((act) => act.id !== act);
        setDocuments(updatedDocuments);
    };

    // Filter data based on search term
    const filteredActs = activities.filter(
        (act) =>
            act.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
            act.date.includes(searchTerm) ||
            act.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredActs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredActs.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page changes
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="">
            <div className="flex flex-col h-screen max-w-7xl mx-auto rounded-lg p-6">
                <SearchInputMobile
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={"Search activities..."}
                />

                <div className="my-4 p-6 bg-green-500 rounded-lg">
                    <h2 className="text-sm font-light text-white">
                        Total Hours This Month
                    </h2>
                    <p className="text-3xl font-bold text-white">2 hours</p>
                </div>

                <div className="space-x-2 mb-4">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${activeTab === 'all' ? "bg-green-500 text-white" : "bg-transparent" }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab("this month")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${activeTab === 'this month' ? "bg-green-500 text-white" : "bg-transparent" }`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setActiveTab("previous")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${activeTab === 'previous' ? "bg-green-500 text-white" : "bg-transparent" }`}
                    >
                        Previous
                    </button>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentItems.map((activity, index) => (
                        <li
                            key={index}
                            className="p-5 duration-100 transition-all hover:border-l-[6px] hover:border-green-500 bg-white rounded-lg shadow-md"
                        >
                            <div className="flex items-center">
                                <p className="pb-2 text-xs font-medium text-gray-600">
                                    {formatDate(activity.date)}
                                </p>

                                <p className="inline-block ml-auto text-sm font-medium text-gray-800">
                                    {activity.hoursEarned}
                                </p>
                            </div>
                            <p className="font-bold ml-auto text-gray-800 text-xl mb-3">
                                {activity.task}
                            </p>
                            <p className="flex items-center text-xs text-gray-500">
                                Verified by: {activity.verifiedBy}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                {filteredActs.length > 0 && (
                    <div className="flex justify-center items-center mt-auto">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                Previous
                            </button>
                            <div className="text-sm text-gray-600">
                                {indexOfFirstItem + 1} of {filteredActs.length}
                            </div>
                            <button
                                onClick={goToNextPage}
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === totalPages ||
                                    totalPages === 0
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
