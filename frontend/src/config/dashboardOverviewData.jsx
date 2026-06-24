import {
    Calendar,
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
} from "lucide-react";
import { formatDate } from "../utils/formatDate";

export const dashboardOverviewData = (data) => {
    const staffOverviewData = [
        {
            title: "Pending Applications",
            status: data?.numberOfApplicationsSubmitted ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/applications/applications-submitted",
            sidebarTabName: "applications",
        },
        {
            title: "Reviewed Applications",
            status: data?.numberOfReviewedApplications ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <ScrollText className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/applications/reviewed-applications",
            sidebarTabName: "applications",
        },
        {
            title: "Active Scholars",
            status: data?.numberOfActiveScholars ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <Users className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/records/scholars",
            sidebarTabName: "applications",
        },
        {
            title: "Pending Duty Reports",
            status: data?.numberOfNewCommunityServices ?? 0,
            color: "bg-orange-300 text-gray-900",
            icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
            navigate: "/staff/events-duty/duty-reports",
            sidebarTabName: "events_duty",
        },
    ];

    const adminOverviewData = [
        {
            title: "Scholars",
            status: data?.totalScholars ?? 0,
            color: "bg-blue-300 text-gray-900",
            icon: <GraduationCap className="w-5 h-5 text-gray-600" />,
            iconColor: "text-blue-600",
            navigate: "/admin/users-accounts/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Pending Scholars",
            status: data?.pendingScholars ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <Hourglass className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
            navigate: "/admin/users-accounts/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Active Scholars",
            status: data?.activeScholars ?? 0,
            color: "bg-green-300 text-gray-900",
            icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-green-600",
            navigate: "/admin/users-accounts/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Deactivated Scholars",
            status: data?.deactivatedScholars ?? 0,
            color: "bg-red-300 text-gray-900",
            icon: <XCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
            navigate: "/admin/users-accounts/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Non-renewed Scholars",
            status: data?.notRenewedScholars ?? 0,
            color: "bg-red-300 text-gray-900",
            icon: <XCircle className="w-5 h-5 text-gray-600" />,
            iconColor: "text-red-600",
            navigate: "/admin/users-accounts/scholar-account-management",
            sidebarTabName: "manage_accounts",
        },
        {
            title: "Staff",
            status: data?.totalStaff ?? 0,
            color: "bg-yellow-300 text-gray-900",
            icon: <UserCog className="w-5 h-5 text-gray-600" />,
            iconColor: "text-yellow-600",
            navigate: "/admin/users-accounts/staff-account-management",
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
            title: "Duty Reports Submitted",
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
                data?.renewalApplicationStatus?.created_at,
            ),
        },
    ];

    return { scholarOverviewData, staffOverviewData, adminOverviewData };
};
