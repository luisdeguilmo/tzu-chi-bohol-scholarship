import { Outlet } from "react-router-dom";
import SideBar from "../../pages/Scholar/SideBar";
import TopBar from "../../pages/Scholar/TopBar";
import SideBarWithDropdown from "../SideBarWithDropdown";

// const items = [
//     {
//         text: "Dashboard",
//         iconName: "dashboard",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/admin/dashboard"
//     },
//     {
//         text: "User Accounts",
//         iconName: "manage_accounts",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/admin/scholar-account-creator"
//     },
//     {
//         text: "Settings",
//         iconName: "settings",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/"
//     },
//     {
//         text: "Activity",
//         iconName: "upload_file",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/"
//     },
//     {
//         text: "Logout",
//         style: "mt-auto",
//         iconName: "logout",
//         iconStyle: "text-[1.1rem]",
//         navigate: "/"
//     },
// ];

const sidebarItems = [
    {
        text: "Dashboard",
        iconName: "dashboard",
        navigate: "/staff/dashboard",
    },
    {
        text: "Manage Accounts",
        iconName: "manage_accounts",
        subItems: [
            { text: "Scholar Accounts", navigate: "/admin/scholar-account-management" },
            { text: "Staff Accounts", navigate: "/" },
        ],
    },
    {
        text: "Settings",
        iconName: "settings",
        iconStyle: "text-[1.1rem]",
        navigate: "/"
    },
    {
        text: "Activity",
        iconName: "upload_file",
        iconStyle: "text-[1.1rem]",
        navigate: "/"
    },
    {
        text: "Logout",
        style: "mt-auto",
        iconName: "logout",
        iconStyle: "text-[1.1rem]",
        navigate: "/",
    },
];

export default function AdminLayout() {
    return (
        <div className="">
            <TopBar />
            <div className="flex justify-center">
                {/* <SideBar items={items} /> */}
                <SideBarWithDropdown items={sidebarItems} />
                <div className="w-full h-[91.5vh] overflow-y-scroll scroll-smooth">
                    <Outlet />
                {/* <Dashboard overviewData={overviewData} /> */}
                </div>
            </div>
        </div>
    );
}
