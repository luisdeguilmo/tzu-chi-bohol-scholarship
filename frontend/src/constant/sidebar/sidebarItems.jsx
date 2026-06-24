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
    FileText,
    FileSpreadsheet,
    CalendarRange,
    Files,
} from "lucide-react";

export const scholarSidebarItems = [
    {
        itemName: "dashboard",
        text: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/dashboard",
    },
    {
        itemName: "coe-grades",
        text: "COE and Grades",
        icon: <Files className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/coe-grades",
    },
    {
        itemName: "duty-reports",
        text: "Duty Reports",
        icon: <FileText className="w-5 h-5 text-slate-600" />,
        navigate: "/scholar/duty-reports",
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
                navigate: "/staff/scholarship/college-university",
                itemName: "college-university",
            },
            {
                text: "Scholarship Criteria",
                navigate: "/staff/scholarship/scholarship-criteria",
                itemName: "scholarship-criteria",
            },
            {
                text: "Application Period",
                navigate: "/staff/scholarship/application-period",
                itemName: "application-period",
            },
        ],
    },
    {
        text: "Records",
        itemName: "records",
        icon: <Layers className="w-5 h-5 text-slate-600" />,
        subItems: [
            {
                text: "Scholars and Allowances",
                navigate: "/staff/records/scholars-and-allowances",
                itemName: "scholars-and-allowances",
            },
            {
                text: "Monthly Allowance Summary",
                navigate: "/staff/records/monthly-allowance-summary",
                itemName: "monthly-allowance-summary",
            },
            {
                text: "Scholars",
                navigate: "/staff/records/scholars",
                itemName: "scholars",
            },
            {
                text: "Applications",
                navigate: "/staff/records/applications",
                itemName: "applications",
            },
        ],
    },
    {
        text: "Applications",
        itemName: "applications",
        icon: <ScrollText className="w-5 h-5 text-slate-600" />,
        subItems: [
            {
                text: "Applications",
                navigate: "/staff/applications/applications-submitted",
                itemName: "applications-submitted",
            },
            {
                text: "Reviewed Applications",
                navigate: "/staff/applications/reviewed-applications",
                itemName: "reviewed-applications",
            },
            {
                text: "Entrance Examination",
                navigate: "/staff/applications/entrance-examination",
                itemName: "entrance-examination",
            },
            {
                text: "Initial Interview",
                navigate: "/staff/applications/initial-interview",
                itemName: "initial-interview",
            },
            {
                text: "Home Visitation",
                navigate: "/staff/applications/home-visitation",
                itemName: "home-visitation",
            },
            {
                text: "Final Interview",
                navigate: "/staff/applications/final-interview",
                itemName: "final-interview",
            },
            {
                text: "Orientation & Awarding Attendance",
                navigate: "/staff/applications/orientation-awarding-attendance",
                itemName: "orientation-awarding-attendance",
            },
        ],
    },
    {
        text: "Events & Duty",
        itemName: "events-duty",
        icon: <Calendar className="w-5 h-5 text-slate-600" />,
        subItems: [
            {
                text: "Events",
                navigate: "/staff/events-duty/events",
                itemName: "events",
            },
            {
                text: "Duty Reports",
                navigate: "/staff/events-duty/duty-reports",
                itemName: "duty-reports",
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
        itemName: "users-accounts",
        icon: <UserCog className="w-5 h-5 text-slate-600" />,
        subItems: [
            {
                text: "Scholars",
                navigate: "/admin/users-accounts/scholar-account-management",
                itemName: "scholar-account-management",
            },
            {
                text: "Staff",
                navigate: "/admin/users-accounts/staff-account-management",
                itemName: "staff-account-management",
            },
        ],
    },
    {
        text: "School Years",
        itemName: "school-years",
        icon: <CalendarRange className="w-5 h-5 text-slate-600" />,
        navigate: "/admin/school-years",
    },
    {
        text: "Audit logs",
        itemName: "audit-logs",
        icon: <FileSpreadsheet className="w-5 h-5 text-slate-600" />,
        navigate: "/admin/audit-logs",
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
