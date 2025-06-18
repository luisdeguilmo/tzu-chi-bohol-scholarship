import { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "../../components/SearchInput";
import SearchInputMobile from "../../components/SearchInputMobile";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { useEvents } from "../../hooks/useEvents";
import DocumentForm from "./DocumentForm";

export default function Events() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const { events, fetchEvents } = useEvents();

    // Filter data based on search term
    const filteredEvents = events.filter((event) =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(
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
        fetchEvents(tab);
        setCurrentPage(1);
        console.log(events);
    };

    return (
        <div className="">
            <div className="flex flex-col h-screen max-w-7xl mx-auto rounded-lg p-6">
                <SearchInputMobile
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={"Search events..."}
                />

                <div className="my-4 p-6 bg-green-500 rounded-md">
                    <h2 className="text-md font-medium text-white">
                        Upcoming Events
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
                        onClick={() => handleTabChange("upcoming")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${
                            activeTab === "upcoming"
                                ? "bg-green-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => handleTabChange("ended")}
                        className={`px-6 py-2 text-sm text-gray-600 rounded-full border-[1px] border-gray-300 ${
                            activeTab === "ended"
                                ? "bg-green-500 text-white"
                                : "bg-transparent"
                        }`}
                    >
                        Ended
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
                    {currentItems.map((event, index) => (
                        <li
                            key={index}
                            className="relative p-5 duration-100 transition-all hover:border-l-[6px] hover:border-green-500 bg-white rounded-lg shadow-md"
                        >
                            <p className="text-xs font-medium text-gray-500">
                                {formatDate(event.date)},{" "}
                                {formatTime(event.time)}
                            </p>
                            <p className="py-2 font-bold text-gray-800 text-xl">
                                {event.event_name}
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

                                {event.event_location}
                            </p>
                            {/* {activeTab === "ended" && (
                                // <button
                                //     // onClick={() => setIsOpen(true)}
                                //     className="py-2 pl-2 pr-1 absolute bottom-4 right-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex justify-center items-center"
                                // >
                                //     <svg
                                //         xmlns="http://www.w3.org/2000/svg"
                                //         className="h-5 w-5 mr-1"
                                //         fill="none"
                                //         viewBox="0 0 24 24"
                                //         stroke="currentColor"
                                //     >
                                //         <path
                                //             strokeLinecap="round"
                                //             strokeLinejoin="round"
                                //             strokeWidth={2}
                                //             d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                //         />
                                //     </svg>
                                // </button>
                                // <DocumentForm isOpen={isOpen} setIsOpen={setIsOpen} />
                            )} */}
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                {filteredEvents.length > 6 && (
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
