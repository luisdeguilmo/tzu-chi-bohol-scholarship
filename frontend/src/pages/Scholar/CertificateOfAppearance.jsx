import { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "../../components/SearchInput";
import SearchInputMobile from "../../components/SearchInputMobile";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import DocumentForm from "./DocumentForm";
import { useActivities } from "../../hooks/useActivities";

export default function CertificateOfAppearance() {
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // const [activitys, setactivitys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erorr, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(-1);

    const { activities, fetchActivities } = useActivities();

    // Filter data based on search term
    const filteredActivities = activities.filter((activity) =>
        activity.activity_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredActivities.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Handle page changes
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchActivities(tab);
        setCurrentPage(1);
    };

    const handleOpenDotMenu = (index) => {
        setItemIndex(index);
        setIsDotMenuOpen(!isDotMenuOpen);
    };

    return (
        <div className="">
            <div className="relative flex flex-col min-h-screen max-w-7xl mx-auto rounded-lg p-6">
                <SearchInputMobile
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={"Search activities..."}
                />

                <div className="my-4 p-6 bg-green-500 rounded-md">
                    <h2 className="text-md font-medium text-white">
                        Volunteer Activities This Month
                    </h2>
                    <p className="text-3xl font-bold text-white">2</p>
                </div>

                <div className="space-x-2 mb-4">
                    {/* <button
                        onClick={() => handleTabChange("all")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${
                            activeTab === "all"
                                ? "bg-green-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        All
                    </button> */}
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${
                            activeTab === "all"
                                ? "bg-green-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleTabChange("this_month")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${
                            activeTab === "this_month"
                                ? "bg-green-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        This Month
                        {/* <select
                            className={`${
                                activeTab === "previous"
                                    ? "bg-green-500 text-white"
                                    : "bg-transparent"
                            } outline-none`}
                            name=""
                            id=""
                        >
                            Previous
                            <option value="">2024</option>
                        </select> */}
                    </button>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentItems.map((activity, index) => (
                        <li
                            key={index}
                            className="relative p-5 duration-100 transition-all hover:border-l-[6px] hover:border-green-500 bg-white rounded-lg shadow-md"
                        >
                            
                            <p className="pb-2 font-bold text-gray-800 text-xl">
                                {activity.activity_name}
                            </p>
                            <p className="text-xs font-medium text-gray-500">
                                {formatDate(activity.activity_date)},{" "}
                                {formatTime(activity.activity_time)}
                            </p>
                            <p className="flex items-center text-xs text-gray-500">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                </svg>

                                {/* {activity.activity_location} */}
                            </p>
                            <span onClick={() => handleOpenDotMenu(index)} className="absolute p-1 top-2 right-2 text-gray-800 font-bold cursor-pointer rounded-full hover:bg-gray-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.9"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 5.25a.75.75 0 110 1.5.75.75 0 010-1.5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5z"
                                    />
                                </svg>
                            </span>
                            {isDotMenuOpen && index === itemIndex && (
                                <ul className="absolute top-10 right-0 p-3 rounded-sm bg-white shadow-gray-300 shadow-lg">
                                    <li className="cursor-pointer hover:bg-gray-100">Archive</li>
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                {/* {filteredActivities.length > 6 && (
                    <div className="flex justify-center items-center mt-8 py-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-1 rounded-md ${
                                    currentPage === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                Prev
                            </button>
                            <div className="text-sm text-gray-600">
                                {currentPage} of {totalPages}
                            </div>
                            <button
                                onClick={goToNextPage}
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className={`px-4 py-1 rounded-md ${
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
                )} */}

                <DocumentForm isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </div>
    );
}
