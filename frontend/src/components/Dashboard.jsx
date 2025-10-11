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

function QuickOverview() {
    const { user } = useAuth();
    const { dashboardData } = useDashboardOverviewData(user.user_id, user.type);
    const { scholarOverviewData, staffOverviewData, adminOverviewData } =
        dashboardOverviewData(dashboardData);
    const { events } = useEvents("upcoming", user.user_id);
    const { events: recentEvents } = useEvents("recent", user.user_id);
    const { recentActivities, fetchRecentActivities } = useRecentActivities(
        user.type === "scholar" ? user.user_id : null
    );

    return (
        <div className="w-full p-6">
            {/* <h2 className="text-xl font-bold text-slate-600 mb-4">Dashboard</h2> */}
            <div className="p-6 mb-6 shadow-lg bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-1">
                    Welcome back,{" "}
                    {user.type === "admin" ? "Admin" : dashboardData.userName}!
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
    );
}

function OverviewDataCard({ overviewData }) {
    return (
        <>
            {overviewData?.map((item, index) => (
                <div
                    key={index}
                    className={`flex p-6 rounded-lg shadow-sm border relative bg-white`}
                >
                    <div className="flex flex-col">
                        <h2 className="text-xs text-slate-500">{item.title}</h2>
                        <p className="mt-3 text-xl text-slate-600 font-bold">
                            {item.status}
                            {item.title === "Rendered Hours" &&
                                (item.status > 1
                                    ? "hrs / 20hrs required"
                                    : "hr / 20hrs required")}
                        </p>
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

function Dashboard({ overviewData, dashboard }) {
    return <QuickOverview overviewData={overviewData} dashboard={dashboard} />;
}

export default Dashboard;
