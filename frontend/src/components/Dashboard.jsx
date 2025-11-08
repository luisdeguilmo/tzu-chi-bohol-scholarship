import { date } from "../utils/getDateAndTime";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { dashboardOverviewData } from "../config/dashboardOverviewData";
import UpcomingEvents from "./UpcomingEvents";
import { useEvents } from "../hooks/useEvents";
import RecentActivities from "./RecentActivities";
import { useRecentActivities } from "../hooks/useRecentActivities";
import RecentEvents from "./RecentEvents";
import LivingInfoFormModal from "./LivingInfoFormModal";
import { useEffect, useRef, useState } from "react";
import { getCurrentSchoolYear } from "../utils/getCurrentSchoolYear";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

function QuickOverview() {
    const { user } = useAuth();
    const { dashboardData } = useDashboardOverviewData(
        user.user_id,
        user.type,
        getCurrentSchoolYear()
    );
    const { scholarOverviewData, staffOverviewData, adminOverviewData } =
        dashboardOverviewData(dashboardData);
    const { events } = useEvents("upcoming", user.user_id);
    const { events: recentEvents } = useEvents("recent", user.user_id);
    const { recentActivities } = useRecentActivities(
        user.type === "scholar" ? user.user_id : null
    );
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (
            !hasInitialized.current &&
            dashboardData.hasSubmittedLivingInfo !== undefined
        ) {
            setIsFormModalOpen(!dashboardData.hasSubmittedLivingInfo);
            hasInitialized.current = true;
        }
    }, [dashboardData.hasSubmittedLivingInfo]);

    console.log(dashboardData);

    return (
        <>
            <div className="w-full p-6">
                {/* <h2 className="text-xl font-bold text-slate-600 mb-4">Dashboard</h2> */}
                <div className="p-6 mb-6 shadow-lg bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Welcome back,{" "}
                        {user.type === "admin"
                            ? "Admin"
                            : dashboardData.userName}
                        !
                    </h2>
                    <p className="text-xs text-white">
                        Today is {date.getCurrentDay()},{" "}
                        {formatDate(date.getCurrentDateAndTime())}
                    </p>
                </div>
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <OverviewDataCard
                        overviewData={
                            user.type === "staff"
                                ? staffOverviewData
                                : user.type === "admin"
                                  ? adminOverviewData
                                  : scholarOverviewData
                        }
                        userType={user.type}
                    />
                </div>
                {user.type === "scholar" && (
                    <div>
                        <UpcomingEvents events={events} />
                        <RecentActivities
                            activities={recentActivities}
                            initialDisplayCount={3}
                        />
                    </div>
                )}

                {user.type === "staff" && (
                    <div>
                        <UpcomingEvents events={events} />
                        <RecentEvents events={recentEvents} />
                    </div>
                )}
            </div>

            {!dashboardData.hasSubmittedLivingInfo && (
                <LivingInfoFormModal
                    label={`🎉 Congratulations, ${dashboardData.userName}!`}
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                />
            )}
        </>
    );
}

function OverviewDataCard({ overviewData, userType }) {
    const navigate = useNavigate();
    const { setActiveTab } = useSidebar();

    return (
        <>
            {overviewData?.map((item, index) => (
                <div
                    key={index}
                    className={`flex p-6 rounded-lg shadow-sm border relative bg-white`}
                >
                    <div className="w-full">
                        <div className="flex flex-col">
                            <h2 className="text-xs text-slate-500">
                                {item.title}
                            </h2>
                            <div
                                className={`mt-3 text-xl text-slate-600 font-bold  ${item.title === "Renewal Application" ? "" : ""} `}
                            >
                                {item.status}
                                <span className={`text-sm font-normal ml-1`}>
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

function Dashboard() {
    return <QuickOverview />;
}

export default Dashboard;
