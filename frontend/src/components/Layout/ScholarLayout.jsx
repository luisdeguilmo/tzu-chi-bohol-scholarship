import { Outlet } from "react-router-dom";
import TopBar from "../TopBar";
import SideBar from "../SideBar";
import { scholarSidebarItems } from "../../constant/sidebar/sidebarItems";

export default function ScholarLayout() {
    return (
        <div className="">
            <TopBar />
            <div className="flex justify-center">
                <SideBar items={scholarSidebarItems} />
                <div className="w-full h-[91.5vh] overflow-y-auto scroll-smooth">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
