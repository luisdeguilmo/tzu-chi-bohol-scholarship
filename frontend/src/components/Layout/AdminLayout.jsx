import { Outlet } from "react-router-dom";
import Dashboard from "../../pages/Scholar/Dashboard";
import SideBar from "../../pages/Scholar/SideBar";
import TopBar from "../../pages/Scholar/TopBar";

const items = [
    {
        text: "Dashboard",
        iconName: "dashboard",
        iconStyle: "text-[1.1rem]",
        navigate: "/admin/dashboard"
    },
    {
        text: "User Accounts",
        iconName: "manage_accounts",
        iconStyle: "text-[1.1rem]",
        navigate: "/"
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
        navigate: "/"
    },
];

export default function AdminLayout() {
    return (
        <div className="">
            <TopBar />
            <div className="flex justify-center">
                <SideBar items={items} />
                <div className="w-full h-[90vh] overflow-y-scroll scroll-smooth">
                    <Outlet />
                {/* <Dashboard overviewData={overviewData} /> */}
                </div>
            </div>
        </div>
    );
}
