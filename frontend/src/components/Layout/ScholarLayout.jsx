import { Outlet } from "react-router-dom";
import SideBar from "../../pages/Scholar/SideBar";
import TopBar from "../TopBar";

const items = [
    {
        text: "Dashboard",
        iconName: "dashboard",
        iconStyle: "text-[1.1rem]",
        navigate: "/scholar/dashboard",
    },
    {
        text: "Documents",
        iconName: "post_add",
        iconStyle: "text-[1.1rem]",
        navigate: "/scholar/documents",
    },
    // {
    //     text: "COA",
    //     iconName: "post_add",
    //     iconStyle: "text-[1.1rem]",
    //     navigate: "/coa",
    // },
    // {
    //     text: "COE & Grades",
    //     iconName: "upload_file",
    //     iconStyle: "text-[1.1rem]",
    //     navigate: "/coegrades",
    // },
    {
        text: "Hours Log",
        iconName: "schedule",
        iconStyle: "text-[1.1rem]",
        navigate: "/scholar/rendered-hours",
    },
    {
        text: "Events",
        iconName: "event",
        iconStyle: "text-[1.1rem]",
        navigate: "/scholar/events",
    },
    {
        text: "Archive",
        iconName: "archive",
        iconStyle: "text-[1.1rem]",
        navigate: "/scholar/archive",
    },
    {
        text: "Renew",
        iconName: "refresh",
        iconStyle: "text-[1.1rem]",
        navigate: "/scholar/renew",
    }, 
    {
        text: "Logout",
        style: "mt-auto",
        iconName: "logout",
        iconStyle: "text-[1.1rem]",
        navigate: "/",
    },
];

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
