import React, { act, useEffect, useState } from "react";
import SearchInputMobile from "../../components/SearchInputMobile";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { useAuth } from "../../context/AuthContext";
import { red } from "@tailwindcss/postcss7-compat/colors";

export default function HoursLog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const itemsPerPage = 5;
    const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
    const [itemIndex, setItemIndex] = useState(-1);
    const [renderedHours, setRenderedHours] = useState(0);

    const { user } = useAuth();

    const handleGetRenderedHours = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/app/views/rendered-hours.php?account_id=${user.user_id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch rendered hours");
            }
            const data = await response.json();
            setRenderedHours(data.renderedHours || 0);
        } catch (error) {
            console.error("Error fetching rendered hours:", error);
        }
    };

    useEffect(() => {
        handleGetRenderedHours();
    }, []);

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

    const handleOpenDotMenu = async (index) => {
        if (itemIndex === index && isDotMenuOpen === true) {
            setIsDotMenuOpen(false);
        } else {
            setIsDotMenuOpen(true);
        }
        setItemIndex(index);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="">
            <div className="w-full pt-6 bg-white shadow-sm">
                <div className="px-6">
                    <h2 className="text-xl text-slate-600 font-bold mb-4">
                        Rendered Hours
                    </h2>

                    <div className="mb-6 p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-500 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-left text-white/90 text-sm font-medium">
                                    This Month Overview
                                </p>
                                <div className="flex items-center gap-2 text-white/80">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-sm">July 2024</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Attended Events
                                        </span>
                                        <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4 text-green-200"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        3
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Volunteer Activities
                                        </span>
                                        <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4 text-yellow-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        6
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/80 text-sm">
                                            Total Hours
                                        </span>
                                        <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4 text-purple-200"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        4
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SearchInputMobile
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search activities..."}
                    />
                </div>
                <div className="border-t border-gray-100 mt-4"></div>
                <div className=" px-6 py-2 space-x-1 mb-4 font-medium">
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`px-4 py-2 rounded-lg text-sm text-gray-600 ${
                            activeTab === "all"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleTabChange("this_month")}
                        className={`px-4 py-2 rounded-lg text-sm text-gray-600 ${
                            activeTab === "this_month"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        This Month
                    </button>
                </div>
            </div>
            <div className="flex flex-col h-screen rounded-lg px-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentItems.map((activity, index) => (
                        <li
                            key={index}
                            className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 hover:shadow-md hover:border-indigo-200/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Modern Accent Border */}
                            <div className="absolute left-0 top-6 bottom-6 w-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative">
                                <h3 className="flex items-center gap-2 pb-3 text-gray-600 text-lg leading-tight">
                                    <span
                                        className={`material-symbols-outlined text-xl block px-2 py-1 bg-pink-50 text-pink-800 rounded-lg`}
                                    >
                                        calendar_clock
                                    </span>
                                    {activity.task}
                                </h3>

                                <div className="flex items-center space-x-4 mb-2">
                                    <div className="flex items-center text-xs text-slate-500">
                                        <svg
                                            className="w-4 h-4 mr-2 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {formatDate(activity.date)}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <svg
                                            className="w-4 h-4 mr-2 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {activity.hoursEarned}
                                    </div>
                                </div>

                                <div className="flex items-center text-xs text-slate-500">
                                    <svg
                                        className="w-4 h-4 mr-2 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                    </svg>
                                    {activity.verifiedBy}
                                </div>
                            </div>

                            {/* <p
                                className={`${
                                    activity.activity_status === "Recorded"
                                        ? "bg-green-100 text-green-800"
                                        : activity.activity_status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                } absolute px-3 py-1 text-xs rounded-full  bottom-4 right-6`}
                            >
                                {activity.activity_status}
                            </p> */}

                            {/* Modern Menu Button */}
                            <button
                                onClick={() => handleOpenDotMenu(index)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 group-hover:opacity-100 opacity-70"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 5.25a.75.75 0 110 1.5.75.75 0 010-1.5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5z"
                                    />
                                </svg>
                            </button>

                            {/* {activeTab === "upcoming" && (
                                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm text-white absolute bottom-5 right-8">
                                    Join
                                </button>
                            )} */}

                            {/* Modern Dropdown Menu */}
                            {isDotMenuOpen && index === itemIndex && (
                                <div className="absolute top-12 right-4 p-1 rounded-xl bg-white shadow-xl border border-slate-200/50 backdrop-blur-sm z-[999] w-[120px]">
                                    <button className="w-full text-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors duration-150">
                                        Edit
                                    </button>
                                    <button className="w-full text-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors duration-150">
                                        Archive
                                    </button>
                                    <button className="w-full text-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors duration-150">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                {filteredActs.length > 6 && (
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
                )}
            </div>
        </div>
    );
}
