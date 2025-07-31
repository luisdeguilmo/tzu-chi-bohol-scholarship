import { date } from "../utils/getDateAndTime";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useStaffDashboardOverviewData } from "../hooks/useStaffDashboardOverviewData";
import { staffDashboard } from "../config/staffDashboardItems";

function QuickOverview() {
    const { user } = useAuth();
    const { dashboardData, fetchStaffDashboardData } =
        useStaffDashboardOverviewData(user.user_id, user.type);

    const { staffOverviewData } = staffDashboard(dashboardData);

    console.log(user);
    console.log(dashboardData);

    return (
        <div className="w-full p-6">
            {/* <h2 className="text-xl font-bold text-slate-600 mb-4">Dashboard</h2> */}
            <div className="p-6 mb-6 bg-green-500 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-1">
                    Welcome back, {dashboardData.userName}!
                </h2>
                <p className="text-xs text-white">
                    Today is {date.getCurrentDay()},{" "}
                    {formatDate(date.getCurrentDateAndTime())}
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {staffOverviewData.map((item, index) => (
                    <div
                        key={index}
                        className={`flex p-6 rounded-lg shadow-[0px_2px_6px_rgba(0,0,0,.1)] relative bg-white`}
                    >
                        <div className="flex flex-col">
                            <h2 className="text-xs text-slate-500">
                                {item.title}
                            </h2>
                            <p className="mt-3 text-xl text-slate-600 font-bold">
                                {item.status}
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
            </div>

            {/* {dashboard === "staff" && (
                <div className="mt-[-10] px-3 w-full flex justify-start">
                    <NewApplications />
                </div>
            )} */}
        </div>
    );
}

function Dashboard({ overviewData, dashboard }) {
    return <QuickOverview overviewData={overviewData} dashboard={dashboard} />;
}

export default Dashboard;
