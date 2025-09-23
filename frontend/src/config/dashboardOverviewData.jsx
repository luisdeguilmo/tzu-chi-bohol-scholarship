import {
    Calendar,
    Calendar1,
    CheckCircle,
    Clock,
    GraduationCap,
    HandHeart,
    HandHeartIcon,
    Hourglass,
    ScrollText,
    UserCog,
    Users,
    XCircle,
    XCircleIcon,
} from "lucide-react";

export const dashboardOverviewData = (data) => {
    const staffOverviewData = [
        {
            title: "Applications Submitted",
            status: data?.numberOfAllApplications ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "New Applicants",
            status: data?.numberOfNewApplications ?? 0,
            color: "bg-yellow-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "Renewal Applicants",
            status: data?.numberOfOldApplications ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "Approved Applications",
            status: data?.numberOfApprovedApplications ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "Rejected Applications",
            status: data?.numberOfRejectedApplications ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <XCircleIcon className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "All Scholars",
            status: data?.numberOfAllScholars ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "New Scholars",
            status: data?.numberOfNewScholars ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "Old Scholars",
            status: data?.numberOfOldScholars ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "Upcoming Events",
            status: data?.numberOfUpcomingEvents ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <Calendar1 className="w-5 h-5 text-slate-600" />,
        },
        {
            title: "New Community Services",
            status: data?.numberOfNewCommunityServices ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
        },
    ];

    const adminOverviewData = [
        {
            title: "All Scholars",
            status: data?.totalScholars ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <GraduationCap className="w-5 h-5 text-gray-600" />,
            iconColor: "text-blue-600",
        },
        {
            title: "Pending Scholars",
            status: data?.pendingScholars ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <Hourglass className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
        },
        {
            title: "Active Scholars",
            status: data?.activeScholars ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
        },
        {
            title: "Deactivated Scholars",
            status: data?.deactivatedScholars ?? 0,
            color: "bg-red-300 text-gray-900",
            icon: <XCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
        },
        {
            title: "All Staff",
            status: data?.totalStaff ?? 0,
            color: "bg-yellow-300 text-gray-900",
            icon: <UserCog className="w-5 h-5 text-gray-600" />,
            iconColor: "text-yellow-600",
        },
        {
            title: "Total Accounts",
            status: data?.totalUsers ?? 0, // scholars + staff
            color: "bg-gray-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-gray-700" />,
            iconColor: "text-gray-700",
        },
    ];

    const scholarOverviewData = [
        {
            title: "Rendered Hours",
            status: data?.renderedHours ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <Clock className="w-5 h-5 text-gray-600" />,
            iconColor: "text-blue-600",
        },
        {
            title: "Events Attended",
            status: data?.attendedEvents ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <Calendar className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
        },
        {
            title: "Community Service Submitted",
            status: data?.numberOfCommunityServices ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <HandHeart className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
        },
        {
            title: "Upcoming Events",
            status: data?.numberOfUpcomingEvents ?? 0,
            color: "bg-red-300 text-gray-900",
            icon: <Calendar className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
        },
    ];

    return { scholarOverviewData, staffOverviewData, adminOverviewData };
};
