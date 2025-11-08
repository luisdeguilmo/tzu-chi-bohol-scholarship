import { Calendar, Clock, Locate, MapPin } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const UpcomingEvents = ({ events }) => {
    return (
        <div className="mb-6 p-6 bg-white shadow-sm border  rounded-lg">
            <div className="flex justify-between">
                <h2 className="font-bold text-gray-700">Upcoming Events</h2>
                <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <ul className="pt-6 space-y-3">
                {events.length > 0 ? (
                    events.map((event) => (
                        <li
                            key={event.id}
                            className="p-3 bg-gray-50 rounded-lg"
                        >
                            <h3 className="text-gray-700 text-sm font-bold">
                                {event.event_name}
                            </h3>
                            <div className="mt-2 flex flex-col md:flex-row gap-2 md:gap-6">
                                <div className="flex gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <p className="text-xs text-gray-600">
                                        {formatDate(event.date)}
                                    </p>
                                </div>
                                <div className="flex gap-1.5">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <p className="text-xs text-gray-600">
                                        {formatTime(event.start_time)} -{" "}
                                        {formatTime(event.end_time)}
                                    </p>
                                </div>
                                <div className="flex gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <p className="text-xs text-gray-600">
                                        {event.event_location}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <div className="text-center ">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            No upcoming events
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                            Stay tuned for upcoming events.
                        </p>
                        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Browse All Events
                        </button> */}
                    </div>
                )}
            </ul>
        </div>
    );
};

export default UpcomingEvents;
