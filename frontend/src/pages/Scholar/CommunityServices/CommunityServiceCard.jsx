import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    MapPin,
} from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import { useArchive } from "../../../hooks/useArchive";

const CommunityServiceCard = ({
    activity,
    index,
    handleOpenDetails,
    handleOpenDotMenu,
    handleSelectCommunityService,
    isDotMenuOpen,
    itemIndex,
    setIsDotMenuOpen,
    setItemIndex,
    setIsEditFormModalOpen,
    activeTab,
    onRefresh,
    isArchived = false,
}) => {
    const { archiveActivity, unArchiveActivity } = useArchive(activeTab);

    const handleArchiveToggle = async (e) => {
        e.stopPropagation();
        setIsDotMenuOpen(false);
        setItemIndex(-1);

        try {
            if (isArchived) {
                await unArchiveActivity(activity.id, "volunteer");
            } else {
                await archiveActivity(activity.id, "volunteer");
            }

            if (onRefresh) {
                await onRefresh(activeTab);
            }
        } catch (error) {
            console.error("Error archiving/unarchiving event:", error);
        }
    };

    return (
        <div
            // key={`${activity.id || index}-${activity.activity_name}`}
            onClick={(e) => {
                e.stopPropagation();
                if (
                    activity.activity_status === "Not Recorded" &&
                    !isArchived
                ) {
                    setIsEditFormModalOpen(true);
                    handleSelectCommunityService(activity);
                } else {
                    handleOpenDetails(activity);
                }
            }}
            className={`group relative p-6 rounded-lg shadow-sm border transition-all duration-300 cursor-pointer ${
                isArchived
                    ? "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 shadow-inner"
                    : "bg-white border-gray-200 hover:shadow-md hover:border-green-200"
            }`}
        >
            {/* Modern Accent Border */}
            <div
                className={`absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-300 ${
                    isArchived
                        ? "bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100"
                        : "bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100"
                }`}
            ></div>

            <div className="relative">
                <h3
                    className={`font-bold text-[16px] md:text-lg leading-tight mb-2 pr-8 overflow-ellipsis overflow-hidden whitespace-nowrap ${
                        isArchived
                            ? "italic text-slate-400 decoration-slate-400"
                            : "text-slate-700"
                    }`}
                >
                    {activity.activity_name}
                </h3>

                <div className="space-y-2">
                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-gray-600"
                        }`}
                    >
                        <span className="bg-gray-100/80 p-2 mr-4 rounded-lg">
                            <Calendar
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        </span>
                        <span
                            className={`text-xs mt-[1px] ${isArchived ? "italic" : ""}`}
                        >
                            {formatDate(activity.activity_date)}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <span className="bg-gray-100/80 p-2 mr-4 rounded-lg">
                            <Clock
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        </span>

                        <span
                            className={`text-xs mt-[1px] ${isArchived ? "italic" : ""}`}
                        >
                            {formatTime(activity.start_time)} -{" "}
                            {formatTime(activity.end_time)}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <span className="bg-gray-100/80 p-2 mr-4 rounded-lg">
                            <MapPin
                                className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        </span>

                        <span
                            className={`text-xs mt-[1px] ${isArchived ? "italic" : ""}`}
                        >
                            {activity.activity_location}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <span className="bg-gray-100/80 p-2 mr-4 rounded-lg">
                            {activity.activity_status === "Pending" ? (
                                <AlertCircle
                                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                                        isArchived
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                />
                            ) : (
                                <CheckCircle
                                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                                        isArchived
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}
                                />
                            )}
                        </span>

                        <span
                            className={`mt-[1px] rounded-lg text-xs font-medium ${
                                isArchived
                                    ? ""
                                    : activity.activity_status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : activity.activity_status === "Recorded"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                            } ${isArchived ? "italic text-slate-400" : "px-2 py-1"}`}
                        >
                            {activity.activity_status === "Pending"
                                ? "Pending"
                                : activity.activity_status === "Recorded"
                                  ? "Recorded"
                                  : "Not Recorded"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu Button */}
            <button
                onClick={(e) => handleOpenDotMenu(e, index)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 ${
                    isArchived
                        ? "text-slate-500 hover:text-slate-700 hover:bg-slate-300"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
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

            {/* {isArchived && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="text-slate-300 text-4xl font-bold transform rotate-12 opacity-20 select-none">
                        Community Service
                    </div>
                </div>
            )} */}

            {/* Dropdown Menu */}
            {isDotMenuOpen && index === itemIndex && (
                <div className="dropdown-menu absolute top-12 right-4 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[120px] p-1">
                    {activity.activity_status === "Pending" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditFormModalOpen(true);
                                handleSelectCommunityService(activity);
                            }}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     // Handle edit
                            //     setIsDotMenuOpen(false);
                            //     setItemIndex(-1);
                            // }}
                            className="w-full text-left rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={handleArchiveToggle}
                        className={`${
                            activity.activity_status === "Pending"
                                ? "hidden"
                                : "block"
                        } w-full text-left rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150`}
                    >
                        {isArchived ? "Restore" : "Archive"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommunityServiceCard;
