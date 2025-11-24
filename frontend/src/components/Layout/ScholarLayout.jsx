import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../TopBar";
import SideBar from "../SideBar";
import { scholarSidebarItems } from "../../constant/sidebar/sidebarItems";
import { useEffect } from "react";

export default function ScholarLayout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

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
