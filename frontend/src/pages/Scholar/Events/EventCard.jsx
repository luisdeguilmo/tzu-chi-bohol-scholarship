import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Archive,
    MessageSquare,
} from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import { useArchive } from "../../../hooks/useArchive";
import { toast } from "react-toastify";
import { date } from "../../../utils/getDateAndTime";

const EventCard = ({
    event,
    index,
    handleOpenDetails,
    handleOpenDotMenu,
    dateToday,
    isDotMenuOpen,
    itemIndex,
    setItemIndex,
    setIsDotMenuOpen,
    activeTab,
    onRefresh,
    isArchived = false,
}) => {
    const { archiveActivity, unArchiveActivity } = useArchive(activeTab);

    const handleArchiveToggle = async (e) => {
        e.stopPropagation();
        setIsDotMenuOpen(false);
        setItemIndex(-1);

        if (event.date > dateToday) {
            toast.error("Can't archive upcoming events.");
            return;
        }

        try {
            if (isArchived) {
                await unArchiveActivity(event.id, "event");
            } else {
                await archiveActivity(event.id, "event");
            }

            if (onRefresh) {
                await onRefresh(activeTab);
            }
        } catch (error) {
            console.error("Error archiving/unarchiving event:", error);
        }
    };

    console.log(
        date.getCurrentDateAndTime(),
        event.date + " " + event.start_time,
        date.getCurrentDateAndTime() < event.date + " " + event.start_time,
    );

    return (
        <div
            key={`${event.id || index}-${event.event_name}`}
            onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails(event);
            }}
            className={`group relative p-6 rounded-lg shadow-sm border transition-all duration-300 cursor-pointer ${
                isArchived
                    ? "bg-gray-100 border-slate-300 shadow-inner"
                    : "bg-white border-gray-200 hover:shadow-md hover:border-green-200"
            }`}
        >
            {/* Modern Accent Border - Different style for archived */}
            <div
                className={`absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-300 ${
                    isArchived
                        ? "bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100"
                        : "bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100"
                }`}
            ></div>

            {/* Archive indicator overlay - More prominent */}
            {/* {isArchived && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 bg-slate-300 rounded-full border border-slate-400">
                    <Archive className="w-4 h-4 text-slate-700" />
                    <span className="text-sm font-semibold text-slate-700">Archived</span>
                </div>
            )} */}

            <div className="relative">
                <h3
                    className={`font-bold text-lg md:text-xl leading-tight mb-4 pr-8 overflow-ellipsis overflow-hidden whitespace-nowrap ${
                        isArchived
                            ? "italic text-slate-400 decoration-slate-400"
                            : "text-slate-700"
                    }`}
                >
                    {event.event_name}
                </h3>

                <div className="space-y-3">
                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <Calendar
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-gray-600"
                            }`}
                        />
                        <span
                            className={`text-xs mt-[1px] ${isArchived ? "italic" : ""}`}
                        >
                            {formatDate(event.date)}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <Clock
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-gray-600"
                            }`}
                        />
                        <span
                            className={`text-xs mt-[1px] ${isArchived ? "italic" : ""}`}
                        >
                            {formatTime(event.start_time)} -{" "}
                            {formatTime(event.end_time)}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <MapPin
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-gray-600"
                            }`}
                        />
                        <span
                            className={`text-xs mt-[1px] truncate ${isArchived ? "italic" : ""}`}
                        >
                            {event.event_location}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-400" : "text-slate-600"
                        }`}
                    >
                        <Users
                            className={`w-4 h-4 mr-2 ${
                                isArchived ? "text-slate-400" : "text-gray-600"
                            }`}
                        />
                        <span
                            className={`text-xs mt-[1px] ${isArchived ? "italic" : ""}`}
                        >
                            {event.numberOfParticipants}{" "}
                            {event.event_type === "optional"
                                ? event.date > dateToday &&
                                  event.numberOfParticipants < 2
                                    ? `/ ${event.participant_limit} Participant`
                                    : event.date > dateToday &&
                                        event.numberOfParticipants > 1
                                      ? `/ ${event.participant_limit} Participants`
                                      : `/ ${event.participant_limit} Participated`
                                : event.date > dateToday &&
                                    event.numberOfParticipants < 2
                                  ? `Participant`
                                  : event.date > dateToday &&
                                      event.numberOfParticipants > 1
                                    ? `Participants`
                                    : `Participated`}
                            {/* {event.numberOfParticipants}
                            {" / "}
                            {event.participant_limit} Participants */}
                        </span>
                    </div>
                </div>
            </div>

            {/* Upcoming badge - Different styling for archived */}
            {event.date > dateToday && (
                <p
                    className={`p-2 rounded-xl absolute bottom-6 text-xs right-6 ${
                        isArchived
                            ? "bg-slate-300 text-slate-700 border border-slate-400"
                            : "bg-green-200 text-green-900"
                    }`}
                >
                    Upcoming
                </p>
            )}

            {/* //      ${
                //     isArchived
                //         ? "bg-slate-300 text-slate-700 border border-slate-400"
                //         : "bg-green-200 text-green-900"
                // } */}

            {/* <p className="absolute bottom-16 text-xs right-6">
                <MessageSquare className="w-5 h-5 text-green-500" />
            </p> */}

            {event.numberOfStaffUnreadComments > 0 && (
                <span
                    className={`absolute -top-2 text-[11px] -right-2 py-[3.5px] px-[8px] rounded-full bg-red-600 text-white font-bold flex items-center justify-center`}
                >
                    {event.numberOfStaffUnreadComments}
                </span>
            )}

            <p
                className={`py-2 px-4 rounded-xl absolute bottom-6 text-xs right-6
               
                ${
                    date.getCurrentDateAndTime() <
                    event.date + " " + event.start_time
                        ? "bg-yellow-100 text-yellow-800"
                        : event.date + " " + event.start_time <=
                                date.getCurrentDateAndTime() &&
                            date.getCurrentDateAndTime() <=
                                event.date + " " + event.end_time
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                }
                `}
            >
                {date.getCurrentDateAndTime() <
                event.date + " " + event.start_time
                    ? "Upcoming"
                    : event.date + " " + event.start_time <=
                            date.getCurrentDateAndTime() &&
                        date.getCurrentDateAndTime() <=
                            event.date + " " + event.end_time
                      ? "Ongoing"
                      : "Ended"}
            </p>

            {/* Archived stamp/watermark effect */}
            {/* {isArchived && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="text-slate-300 text-4xl font-bold transform rotate-12 opacity-20 select-none">
                        ARCHIVED
                    </div>
                </div>
            )} */}

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

            {/* Dropdown Menu */}
            {isDotMenuOpen && index === itemIndex && (
                <div className="dropdown-menu absolute top-12 right-4 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[120px] p-1">
                    <button
                        onClick={handleArchiveToggle}
                        className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                    >
                        {isArchived ? "Restore" : "Archive"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventCard;
