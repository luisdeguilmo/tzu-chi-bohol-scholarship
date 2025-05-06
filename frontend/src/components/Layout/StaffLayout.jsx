import { Outlet } from "react-router-dom";
import SideBar from "../../pages/Scholar/SideBar";
import TopBar from "../../pages/Scholar/TopBar";
import SideBarWithDropdown from "../SideBarWithDropdown";

const sidebarItems = [
    {
        text: "Dashboard",
        iconName: "dashboard",
        navigate: "/staff/dashboard",
    },
    {
        text: "Scholarship",
        iconName: "school",
        subItems: [
            { text: "Scholarship Criteria", navigate: "/staff/scholarship-info" },
            { text: "Application Period", navigate: "/staff/application-period" },
        ],
    },
    {
        text: "Records",
        iconName: "folder_shared",
        subItems: [
            { text: "View Records", navigate: "/" },
            { text: "Manage Info", navigate: "/" },
            { text: "View Applications", navigate: "/staff/applications" },
            { text: "Validate Docs", navigate: "/" },
        ],
    },
    {
        text: "Applications",
        iconName: "checklist",
        subItems: [
            { text: "Applications", navigate: "/staff/applications" },
            { text: "Approved Applications", navigate: "/staff/approved-applications" },
            { text: "Entrance Examination", navigate: "/staff/examination-list" },
            { text: "Initial Interview", navigate: "/staff/initial-interview" },
            { text: "Home Visitation", navigate: "/staff/approved-applications" },
        ],
    },
    {
        text: "Events & Duty",
        iconName: "event",
        subItems: [
            { text: "Set Events", navigate: "/" },
            { text: "Log Duty Hours", navigate: "/" },
        ],
    },
    {
        text: "Logout",
        style: "mt-auto",
        iconName: "logout",
        iconStyle: "text-[1.1rem]",
        navigate: "/",
    },
];

export default function StaffLayout() {
    return (
        <div className="">
            <TopBar />
            <div className="flex justify-center">
                <SideBarWithDropdown items={sidebarItems} />
                <div className="w-full h-[90vh] overflow-y-scroll scroll-smooth">
                    <Outlet />
                    {/* <Dashboard overviewData={overviewData} /> */}
                </div>
            </div>
        </div>
    );
}
