import {
    Award,
    AwardIcon,
    Calendar,
    Calendar1,
    CheckCircle,
    ClipboardEdit,
    Clock,
    GraduationCap,
    HandHeart,
    HandHeartIcon,
    Home,
    Hourglass,
    ScrollText,
    UserCog,
    Users,
    XCircle,
    XCircleIcon,
} from "lucide-react";
import { formatDate } from "../utils/formatDate";

export const dashboardOverviewData = (data) => {
    // const staffOverviewData = [
    //     {
    //         title: "Applications Submitted",
    //         status: data?.numberOfAllApplications ?? 0,
    //         color: "bg-green-300 text-gray-900",
    //         icon: <ScrollText className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "New Applicants",
    //         status: data?.numberOfNewApplications ?? 0,
    //         color: "bg-yellow-300 text-gray-900",
    //         icon: <Users className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "Renewal Applicants",
    //         status: data?.numberOfOldApplications ?? 0,
    //         color: "bg-blue-300 text-gray-900",
    //         icon: <Users className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "Approved Applications",
    //         status: data?.numberOfApprovedApplications ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "Rejected Applications",
    //         status: data?.numberOfRejectedApplications ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <XCircleIcon className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "All Scholars",
    //         status: data?.numberOfAllScholars ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <Users className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "New Scholars",
    //         status: data?.numberOfNewScholars ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <Users className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "Old Scholars",
    //         status: data?.numberOfOldScholars ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <Users className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "Upcoming Events",
    //         status: data?.numberOfUpcomingEvents ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <Calendar1 className="w-5 h-5 text-slate-600" />,
    //     },
    //     {
    //         title: "New Community Services",
    //         status: data?.numberOfNewCommunityServices ?? 0,
    //         color: "bg-orange-300 text-gray-900",
    //         icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
    //     },
    // ];

    const staffOverviewData = [
        {
            title: "Pending Applications",
            status: data?.numberOfApplicationsSubmitted ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/applications",
            sidebarTabName: "applications",
        },
        {
            title: "Reviewed Applications",
            status: data?.numberOfReviewedApplications ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/reviewed-applications",
            sidebarTabName: "applications",
        },
        {
            title: "Active Scholars",
            status: data?.numberOfActiveScholars ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <ClipboardEdit className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/entrance-examination",
            sidebarTabName: "applications",
        },
        // {
        //     title: "Initial Interview",
        //     status: data?.numberOfApplicantsForInitialInterview ?? 0,
        //     color: "bg-orange-300 text-gray-900",
        //     icon: <Users className="w-5 h-5 text-slate-600" />,
        //     navigate: "/staff/initial-interview",
        //     sidebarTabName: "applications",
        // },
        // {
        //     title: "Home Visitation",
        //     status: data?.numberOfApplicantsForHomeVisitation ?? 0,
        //     color: "bg-orange-300 text-gray-900",
        //     icon: <Home className="w-5 h-5 text-slate-600" />,
        //     navigate: "/staff/home-visitation",
        //     sidebarTabName: "applications",
        // },
        // {
        //     title: "Final Interview",
        //     status: data?.numberOfApplicantsForFinalInterview ?? 0,
        //     color: "bg-orange-300 text-gray-900",
        //     icon: <Users className="w-5 h-5 text-slate-600" />,
        //     navigate: "/staff/final-interview",
        //     sidebarTabName: "applications",
        // },
        // {
        //     title: "Orientation",
        //     status: data?.numberOfApplicantsForOrientation ?? 0,
        //     color: "bg-orange-300 text-gray-900",
        //     icon: <Users className="w-5 h-5 text-slate-600" />,
        //     navigate: "/staff/orientation-awarding-attendance",
        //     sidebarTabName: "applications",
        // },
        // {
        //     title: "Awarding",
        //     status: data?.numberOfApplicantsForAwarding ?? 0,
        //     color: "bg-orange-300 text-gray-900",
        //     icon: <AwardIcon className="w-5 h-5 text-slate-600" />,
        //     navigate: "/staff/orientation-awarding-attendance",
        //     sidebarTabName: "applications",
        // },
        {
            title: "Pending Community Services",
            status: data?.numberOfNewCommunityServices ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/community-services",
            sidebarTabName: "events_duty",
        },
        // {
        //     title: "Upcoming Events",
        //     status: data?.numberOfNewCommunityServices ?? 0,
        //     color: "bg-orange-300 text-gray-900",
        //     icon: <Calendar1 className="w-5 h-5 text-slate-600" />,
        //     navigate: "/staff/events",
        //     sidebarTabName: "events_duty",
        // },
    ];

    const adminOverviewData = [
        {
            title: "Scholars",
            status: data?.totalScholars ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <GraduationCap className="w-5 h-5 text-gray-600" />,
            iconColor: "text-blue-600",
            navigate: "/admin/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Pending Scholars",
            status: data?.pendingScholars ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <Hourglass className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
            navigate: "/admin/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Active Scholars",
            status: data?.activeScholars ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
            navigate: "/admin/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Deactivated Scholars",
            status: data?.deactivatedScholars ?? 0,
            color: "bg-red-300 text-gray-900",
            icon: <XCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
            navigate: "/admin/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Non-renewed Scholars",
            status: data?.notRenewedScholars ?? 0,
            color: "bg-red-300 text-gray-900",
            icon: <XCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
            navigate: "/admin/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Staff",
            status: data?.totalStaff ?? 0,
            color: "bg-yellow-300 text-gray-900",
            icon: <UserCog className="w-5 h-5 text-gray-600" />,
            iconColor: "text-yellow-600",
            navigate: "/admin/staff-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Total Accounts",
            status: data?.totalUsers ?? 0, // scholars + staff
            color: "bg-gray-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-gray-700" />,
            iconColor: "text-gray-700",
            navigate: null,
            sidebarTabName: null,
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
        {
            title: "Renewal Application",
            status:
                data?.renewalApplicationStatus?.status === "pending"
                    ? "Pending"
                    : data?.renewalApplicationStatus?.status === "approved"
                      ? "Approved"
                      : data?.renewalApplicationStatus?.status === "rejected"
                        ? "Rejected"
                        : "Not Submitted",
            color: "bg-red-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
            dateSubmitted: formatDate(
                data?.renewalApplicationStatus?.created_at
            ),
        },
    ];

    return { scholarOverviewData, staffOverviewData, adminOverviewData };
};
