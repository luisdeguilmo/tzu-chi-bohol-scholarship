import {
    AlertCircle,
    Calendar,
    CircleCheck,
    CircleX,
    Clock,
    HandHeart,
} from "lucide-react";

export const scholarOverviewData = (data) => {
    const communityServiceOverviewData = [
        {
            label: "Pending",
            icon: <AlertCircle className="w-4 h-4 text-white" />,
            status: data?.pendingActivities ?? 0,
        },
        {
            label: "Recorded",
            icon: <CircleCheck className="w-4 h-4 text-white" />,
            status: data?.recordedActivities ?? 0,
        },
        {
            label: "Not Recorded",
            icon: <CircleX className="w-4 h-4 text-white" />,
            status: data?.notRecordedActivities ?? 0,
        },
        {
            label: "Duty Reports",
            icon: <HandHeart className="w-4 h-4 text-white" />,
            status: data?.numberOfActivities ?? 0,
        },
        {
            label: "Rendered Hours",
            icon: <Clock className="w-4 h-4 text-white" />,
            status: data?.totalHours ?? 0,
        },
    ];

    const eventOverviewData = [
        {
            label: "All Events",
            icon: <Calendar className="w-4 h-4 text-white" />,
            status: data?.numberOfEvents ?? 0,
        },
        {
            label: "Upcoming Events",
            icon: <Calendar className="w-4 h-4 text-white" />,
            status: data?.upcomingEvents ?? 0,
        },
        {
            label: "Attended Events",
            icon: <CircleCheck className="w-4 h-4 text-white" />,
            status: data?.attendedEvents ?? 0,
        },
        {
            label: "Rendered Hours",
            icon: <Clock className="w-4 h-4 text-white" />,
            status: data?.totalHours ?? 0,
        },
    ];

    return { communityServiceOverviewData, eventOverviewData };
};
