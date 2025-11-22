import {
    Calendar,
    GraduationCap,
    Layers,
    LayoutDashboard,
    LogOut,
    ScrollText,
    Archive,
    FileClock,
    HandHeart,
    RotateCcw,
    UserCog,
    BookOpen,
    Users,
} from "lucide-react";

export const scholarSidebarItems = [
    {
        itemName: "dashboard",
        text: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/dashboard",
    },
    {
        itemName: "activities",
        text: "Community Services",
        icon: <HandHeart className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/community-services",
    },
    {
        itemName: "events",
        text: "Events",
        icon: <Calendar className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/events",
    },
    // {
    //     itemName: "recent",
    //     text: "Recent Activities",
    //     icon: <BookOpen className="w-5 h-5 text-slate-600" />,
    //     navigate: "/scholar/recent-activities",
    // },
    {
        itemName: "archive",
        text: "Archived Activities",
        icon: <Archive className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/archived-activities",
    },
    {
        itemName: "renew",
        text: "Renew",
        icon: <RotateCcw className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/renew",
        // state: { userId: user }
    },
    {
        text: "Logout",
        itemName: "logout",
        style: "mt-auto",
        icon: <LogOut className="w-5 h-5 text-slate-600" />,
        navigate: "/",
    },
];

export const staffSidebarItems = [
    {
        text: "Dashboard",
        itemName: "dashboard",
        icon: <LayoutDashboard className="w-5 h-5 text-slate-600" />,
        navigate: "/staff/dashboard",
    },
    {
        text: "Scholarship",
        itemName: "scholarship",
        icon: <GraduationCap className="w-5 h-5 text-slate-600" />,
        subItems: [
            {
                text: "College & University Management",
                navigate: "/staff/college-university",
            },
            {
                text: "Scholarship Criteria",
                navigate: "/staff/scholarship-criteria",
            },
            {
                text: "Application Period",
                navigate: "/staff/application-period",
            },
        ],
    },
    {
        text: "Records",
        itemName: "records",
        icon: <Layers className="w-5 h-5 text-slate-600" />,
        subItems: [
            { text: "Scholars and Allowances", navigate: "/staff/scholars-and-allowances" },
            {
                text: "Monthly Allowance Summary",
                navigate: "/staff/monthly-allowance-summary",
            },
            { text: "Scholars", navigate: "/staff/scholars" },
            { text: "Applications", navigate: "/staff/application-records" },
        ],
    },
    {
        text: "Applications",
        itemName: "applications",
        icon: <ScrollText className="w-5 h-5 text-slate-600" />,
        subItems: [
            { text: "Applications", navigate: "/staff/applications" },
            {
                text: "Reviewed Applications",
                navigate: "/staff/reviewed-applications",
            },
            {
                text: "Entrance Examination",
                navigate: "/staff/entrance-examination",
            },
            { text: "Initial Interview", navigate: "/staff/initial-interview" },
            { text: "Home Visitation", navigate: "/staff/home-visitation" },
            { text: "Final Interview", navigate: "/staff/final-interview" },
            {
                text: "Orientation & Awarding Attendance",
                navigate: "/staff/orientation-awarding-attendance",
            },
        ],
    },
    {
        text: "Events & Duty",
        itemName: "events_duty",
        icon: <Calendar className="w-5 h-5 text-slate-600" />,
        subItems: [
            { text: "Events", navigate: "/staff/events" },
            {
                text: "Community Services",
                navigate: "/staff/community-services",
            },
        ],
    },
    {
        text: "Logout",
        itemName: "logout",
        style: "mt-auto",
        icon: <LogOut className="w-5 h-5 text-slate-600" />,
        iconStyle: "text-[1.1rem]",
        navigate: "/",
    },
];

export const adminSidebarItems = [
    {
        text: "Dashboard",
        itemName: "dashboard",
        icon: <LayoutDashboard className="w-5 h-5 text-slate-600" />,
        navigate: "/admin/dashboard",
    },
    // {
    //     text: "Users",
    //     itemName: "users",
    //     icon: <Users className="w-5 h-5 text-slate-600" />,
    //     navigate: "/admin/users",
    // },
    {
        text: "Users & Accounts",
        itemName: "manage_accounts",
        icon: <UserCog className="w-5 h-5 text-slate-600" />,
        subItems: [
            {
                text: "Scholars",
                navigate: "/admin/scholar-account-management",
            },
            {
                text: "Staff",
                navigate: "/admin/staff-account-management",
            },
        ],
    },
    {
        text: "Logout",
        style: "mt-auto",
        itemName: "logout",
        icon: <LogOut className="w-5 h-5 text-slate-600" />,
        iconStyle: "text-[1.1rem]",
        navigate: "/",
    },
];
