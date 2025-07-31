import {
    Calendar1,
    CheckCircle,
    HandHeartIcon,
    ScrollText,
    Users,
    XCircleIcon,
} from "lucide-react";

export const staffDashboard = (data) => {
    const staffOverviewData = [
        {
            title: "All Applications",
            status: data?.numberOfAllApplications,
            color: "bg-green-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-slate-600" />,
            iconColor: "text-green-600",
        },
        {
            title: "New Applicants",
            status: data?.numberOfNewApplications,
            color: "bg-yellow-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
            iconColor: "text-yellow-600",
        },
        {
            title: "Renewal Applicants",
            status: data?.numberOfOldApplications,
            color: "bg-blue-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
            iconColor: "text-blue-600",
        },
        {
            title: "Approved Applications",
            status: data.numberOfApprovedApplications,
            color: "bg-orange-300 text-gray-900",
            icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
        {
            title: "Rejected Applications",
            status: data.numberOfRejectedApplications,
            color: "bg-orange-300 text-gray-900",
            icon: <XCircleIcon className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
        {
            title: "All Scholars",
            status: data.numberOfAllScholars,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
        {
            title: "New Scholars",
            status: data.numberOfNewScholars,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
        {
            title: "Old Scholars",
            status: data.numberOfOldScholars,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
        {
            title: "Upcoming Events",
            status: data.numberOfUpcomingEvents,
            color: "bg-orange-300 text-gray-900",
            icon: <Calendar1 className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
        {
            title: "New Community Services",
            status: data.numberOfNewCommunityServices,
            color: "bg-orange-300 text-gray-900",
            icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
            iconColor: "text-orange-600",
        },
    ];

    return { staffOverviewData };
};
