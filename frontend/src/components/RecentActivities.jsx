import { useState } from "react";
import {
    BookOpen,
    Calendar,
    Clock,
    MapPin,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const RecentActivities = ({ activities, initialDisplayCount = 3 }) => {
    const [showAll, setShowAll] = useState(false);

    const recentActivities = showAll
        ? activities
        : activities.slice(0, initialDisplayCount);

    const hasMoreActivities = activities.length > initialDisplayCount;

    return (
        <div className="p-6 bg-white shadow-sm border rounded-lg">
            <div className="flex justify-between">
                <h2 className="font-bold text-gray-700">Recent Activities This Month</h2>
                <BookOpen className="w-5 h-5 text-gray-500" />
            </div>
            <ul className="pt-6 space-y-3">
                {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                        <li
                            key={activity.id}
                            className="p-3 flex items-center justify-between bg-gray-50 rounded-lg"
                        >
                            <div>
                                <h3 className="text-gray-700 text-sm font-bold">
                                    {activity.activity_name}
                                </h3>
                                <div className="mt-2 flex flex-col md:flex-row gap-2.5 md:gap-6">
                                    <div className="flex gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <p className="text-xs mt-[1px] text-gray-600">
                                            {formatDate(activity.activity_date)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <p className="text-xs mt-[1px] text-gray-600">
                                            {formatTime(
                                                activity.activity_start_time
                                            )}{" "}
                                            -{" "}
                                            {formatTime(
                                                activity.activity_end_time
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <p className="text-xs mt-[1px] text-gray-600">
                                            {activity.activity_location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-700">{activity.rendered_hours} {activity.rendered_hours > 1 ? "hours" : "hour"}</p>
                        </li>
                    ))
                ) : (
                    <div className="text-center ">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            You haven’t participated in any activities recently.
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 mb-4">
                            Recent activities like duty report submissions
                            and event participation will appear here.
                        </p>
                        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Browse All Events
                        </button> */}
                    </div>
                )}
            </ul>

            {hasMoreActivities && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        {showAll ? (
                            <>
                                Show Less
                                <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Show More (
                                {activities.length - initialDisplayCount} more)
                                <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentActivities;
