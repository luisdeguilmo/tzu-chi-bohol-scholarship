import { Outlet } from "react-router-dom";
import TopBar from "../TopBar";
import SideBar from "../SideBar";
import { staffSidebarItems } from "../../constant/sidebar/sidebarItems";

export default function StaffLayout() {
    return (
        <>
            <TopBar />
            <div className="flex justify-center">
                <SideBar items={staffSidebarItems} />
                <div className="w-full h-[90vh] overflow-y-scroll scroll-smooth">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
