import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    MapPin,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { useArchive } from "../../hooks/useArchive";

const CommunityServiceCard = ({
    userId,
    activity,
    index,
    handleOpenDetails,
    handleOpenDotMenu,
    isDotMenuOpen,
    itemIndex,
    setIsDotMenuOpen,
    setItemIndex,
    activeTab,
    onRefresh,
    isArchived = false,
}) => {
    const { archiveActivity, unArchiveActivity } = useArchive(
        activeTab,
        userId
    );

    const handleArchiveToggle = async (e) => {
        e.stopPropagation();
        setIsDotMenuOpen(false);
        setItemIndex(-1);

        try {
            if (isArchived) {
                await unArchiveActivity(userId, activity.id, "volunteer");
            } else {
                await archiveActivity(userId, activity.id, "volunteer");
            }

            if (onRefresh) {
                await onRefresh(activeTab, userId);
            }
        } catch (error) {
            console.error("Error archiving/unarchiving event:", error);
        }
    };

    return (
        <div
            // key={`${activity.id || index}-${activity.activity_name}`}
            onClick={() => handleOpenDetails(activity)}
            className={`group relative p-6 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer ${
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
                    className={`font-bold text-xl leading-tight mb-4 pr-8 overflow-ellipsis overflow-hidden whitespace-nowrap ${
                        isArchived
                            ? "italic text-slate-500 decoration-slate-400"
                            : "text-slate-700"
                    }`}
                >
                    {activity.activity_name}
                </h3>

                <div className="space-y-3">
                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        <Calendar
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-slate-600"
                            }`}
                        />
                        <span>{formatDate(activity.activity_date)}</span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        <Clock
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-slate-600"
                            }`}
                        />
                        <span>
                            {formatTime(activity.start_time)} -{" "}
                            {formatTime(activity.end_time)}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        <MapPin
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-slate-600"
                            }`}
                        />
                        <span className="truncate">
                            {activity.activity_location}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        {activity.activity_status === "Pending" ? (
                            <AlertCircle
                                className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        ) : (
                            <CheckCircle
                                className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        )}
                        <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                activity.activity_status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                        >
                            {activity.activity_status === "Pending"
                                ? "Pending"
                                : "Recorded"}
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

            {isArchived && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="text-slate-300 text-4xl font-bold transform rotate-12 opacity-20 select-none">
                        ARCHIVED
                    </div>
                </div>
            )}

            {/* Dropdown Menu */}
            {isDotMenuOpen && index === itemIndex && (
                <div className="dropdown-menu absolute top-12 right-4 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[120px] py-1">
                    {activity.activity_status === "Pending" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                                setIsDotMenuOpen(false);
                                setItemIndex(-1);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={handleArchiveToggle}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                    >
                        {isArchived ? "Restore" : "Archive"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommunityServiceCard;
