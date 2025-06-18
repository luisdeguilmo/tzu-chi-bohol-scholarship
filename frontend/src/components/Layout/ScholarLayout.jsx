import { Outlet } from "react-router-dom";
import SideBar from "../../pages/Scholar/SideBar";
import TopBar from "../TopBar";

const items = [
    {
        text: "Dashboard",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h7v7H3V3zm11 0h7v4h-7V3zM3 14h5v7H3v-7zm8 0h10v7H11v-7z"
                />
            </svg>
        ),
        navigate: "/scholar/dashboard",
    },
    {
        text: "Volunteer Activities",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.5 11.5V6.75a1.25 1.25 0 112.5 0V11m0 0V4.75a1.25 1.25 0 112.5 0V11m0 0V7.75a1.25 1.25 0 112.5 0v6a5 5 0 01-5 5h-.5a5.5 5.5 0 01-5.5-5.5V12m7 0h2.25"
                />
            </svg>
        ),
        navigate: "/scholar/coa",
    },
    {
        text: "Events",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3M3.75 9h16.5M4.5 5.25h15a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z"
                />
            </svg>
        ),
        navigate: "/scholar/events",
    },
    {
        text: "Rendered Hours",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
        navigate: "/scholar/rendered-hours",
    },
    {
        text: "Archive",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4.5h18M5.25 6h13.5c.414 0 .75.336.75.75v11.25a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V6.75c0-.414.336-.75.75-.75zM9 12h6"
                />
            </svg>
        ),
        navigate: "/scholar/archive",
    },
    {
        text: "Renew",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 0113.37-4.35M19.5 4.5v5h-5"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12a7.5 7.5 0 01-13.37 4.35M4.5 19.5v-5h5"
                />
            </svg>
        ),
        navigate: "/scholar/renew",
    },
];

// const items = [
//     {
//         text: "Dashboard",
//         iconName: "dashboard",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/scholar/dashboard",
//     },
//     // {
//     //     text: "Documents",
//     //     iconName: "post_add",
//     //     iconStyle: "text-[1.1rem]",
//     //     navigate: "/scholar/documents",
//     // },
//     {
//         text: "Volunteer Activities",
//         iconName: "post_add",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/scholar/coa",
//     },
//     // {
//     //     text: "COE & Grades",
//     //     iconName: "upload_file",
//     //     iconStyle: "text-[1.1rem]",
//     //     navigate: "/coegrades",
//     // },
//     {
//         text: "Events",
//         iconName: "event",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/scholar/events",
//     },
//     {
//         text: "Hours Log",
//         iconName: "schedule",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/scholar/rendered-hours",
//     },
//     {
//         text: "Archive",
//         iconName: "archive",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/scholar/archive",
//     },
//     {
//         text: "Renew",
//         iconName: "refresh",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/scholar/renew",
//     },
//     {
//         text: "Logout",
//         style: "mt-auto",
//         iconName: "logout",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/",
//     },
// ];

const overviewData = [
    {
        title: "COA Upload Status",
        status: "Pending",
        color: "bg-green-400 text-gray-900",
        icon: "post_add",
        iconColor: "text-green-600",
        iconBackground: "bg-green-100",
    },
    {
        title: "COE & Grades",
        status: "Upload Required",
        color: "bg-yellow-400 text-gray-900",
        icon: "upload_file",
        iconColor: "text-yellow-600",
        iconBackground: "bg-yellow-100",
    },
    {
        title: "Duty Hours Rendered",
        status: "20 / 20 Hours Completed",
        color: "bg-blue-400 text-gray-900",
        icon: "schedule",
        iconColor: "text-blue-600",
        iconBackground: "bg-blue-100",
    },
    {
        title: "Upcoming Events",
        status: "Orientation (March 15, 2025)",
        color: "bg-orange-400 text-gray-900",
        icon: "event",
        iconColor: "text-orange-600",
        iconBackground: "bg-orange-100",
    },
];

export default function ScholarLayout() {
    return (
        <div className="">
            <TopBar />
            <div className="flex justify-center">
                <SideBar items={items} />
                <div className="w-full h-[91.5vh] overflow-y-scroll scroll-smooth">
                    <Outlet />
                    {/* <Dashboard overviewData={overviewData} /> */}
                </div>
            </div>
        </div>
    );
}
