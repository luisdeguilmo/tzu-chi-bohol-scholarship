import { Outlet } from "react-router-dom";
import TopBar from "../TopBar";
import SideBarWithDropdown from "../SideBarWithDropdown";

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
            { text: "Staff Accounts", navigate: "/admin/staff-account-management" },
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
