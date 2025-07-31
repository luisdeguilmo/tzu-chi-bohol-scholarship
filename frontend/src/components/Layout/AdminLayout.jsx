import { Outlet } from "react-router-dom";
import TopBar from "../TopBar";
import SideBar from "../SideBar";
import { adminSidebarItems } from "../../constant/sidebar/sidebarItems";

export default function AdminLayout() {
    return (
        <div className="">
            <TopBar />
            <div className="flex justify-center">
                <SideBar items={adminSidebarItems} />
                <div className="w-full h-[91.5vh] overflow-y-scroll scroll-smooth">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
