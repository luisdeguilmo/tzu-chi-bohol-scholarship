import React, { useRef, useState, useEffect } from "react";
import { date } from "../utils/getDateAndTime";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { dashboardOverviewData } from "../config/dashboardOverviewData";
import { useRecentActivities } from "../hooks/useRecentActivities";
import { useRecentAndUpcomingEvents } from "../hooks/useRecentAndUpcomingEvents";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const RecentActivities = React.lazy(() => import("./RecentActivities"));
const UpcomingEvents = React.lazy(() => import("./UpcomingEvents"));

function ScholarDashboard() {
    const { user } = useAuth();
    const { dashboardData } = useDashboardOverviewData(user.type);
    const { scholarOverviewData } = dashboardOverviewData(dashboardData);
    const { events } = useRecentAndUpcomingEvents("upcoming");
    const { recentActivities } = useRecentActivities();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [ModalComponent, setModalComponent] = useState(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (
            !hasInitialized.current &&
            dashboardData.hasSubmittedLivingInfo !== undefined
        ) {
            hasInitialized.current = true;

            if (!dashboardData.hasSubmittedLivingInfo) {
                import("./LivingInfoFormModal").then((mod) => {
                    setModalComponent(() => mod.default);
                    setIsFormModalOpen(true);
                });
            }
        }
    }, [dashboardData.hasSubmittedLivingInfo]);

    const filtered = scholarOverviewData.filter((item) => {
        if (user?.scholar_type === "New") {
            return item.title !== "Renewal Application";
        }
        return true;
    });

    return (
        <>
            <div className="w-full p-4 sm:p-6">
                <WelcomeBanner user={user} />

                <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <OverviewDataCards overviewData={filtered} userType={user.type} />
                </div>

                <UpcomingEvents events={events} />
                <RecentActivities
                    activities={recentActivities}
                    initialDisplayCount={3}
                />
            </div>

            {isFormModalOpen && ModalComponent && (
                <ModalComponent
                    label="Scholar Information Form"
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                />
            )}
        </>
    );
}

export function WelcomeBanner({ user }) {
    return (
        <div className="p-6 sm:p-6 mb-4 shadow-lg bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
            <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                        Welcome back,{" "}
                        {user.type === "admin" ? user.name : user.first_name}!
                    </h2>
                    <p className="text-[10px] md:text-xs text-white">
                        Today is {date.getCurrentDay()},{" "}
                        {formatDate(date.getCurrentDateAndTime())}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function OverviewDataCards({ overviewData, userType }) {
    const navigate = useNavigate();
    const { setActiveTab } = useSidebar();

    return (
        <>
            {overviewData?.map((item, index) => (
                <div
                    key={index}
                    className="flex p-6 sm:p-6 rounded-lg shadow-sm border relative bg-white"
                >
                    <div className="w-full">
                        <div className="flex flex-col">
                            <h2 className="text-[10px] md:text-xs text-slate-500">
                                {item.title}
                            </h2>
                            <div className="mt-3 text-xl text-slate-600 font-bold">
                                {item.status}
                                <span className="text-sm font-normal ml-1">
                                    {item.title === "Rendered Hours" &&
                                        (item.status > 1 ? " hours" : " hour")}
                                </span>
                                {item.dateSubmitted && (
                                    <p className="-mt-1 -mb-2 text-[10px] text-gray-500 font-normal truncate">
                                        Date Submitted: {item.dateSubmitted}
                                    </p>
                                )}
                            </div>
                        </div>

                        {(userType === "staff" || userType === "admin") &&
                            item.navigate &&
                            item.sidebarTabName && (
                                <div className="mt-1">
                                    <button
                                        onClick={() => {
                                            navigate(item.navigate);
                                            setActiveTab(item.sidebarTabName);
                                        }}
                                        className="text-[10px] text-blue-500 hover:text-blue-600 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </div>
                            )}
                    </div>
                    <div className="flex items-center space-x-3 absolute top-3.5 right-3.5">
                        <span
                            className={`text-2xl ${item.iconColor} ${item.iconBackground} px-3 py-2 rounded-full`}
                        >
                            {item.icon}
                        </span>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ScholarDashboard;