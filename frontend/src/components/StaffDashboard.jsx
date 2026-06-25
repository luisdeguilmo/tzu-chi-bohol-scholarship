import React from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { dashboardOverviewData } from "../config/dashboardOverviewData";
import { WelcomeBanner, OverviewDataCards } from "./ScholarDashboard";

const FunnelChart = React.lazy(() => import("./FunnelChart"));
const DutyHoursChart = React.lazy(() => import("./DutyHoursChart"));
const AllowanceChart = React.lazy(() => import("./AllowanceChart"));
const ScholarEngagementChart = React.lazy(
    () => import("./ScholarEngagementChart"),
);

function StaffDashboard() {
    const { user } = useAuth();
    const { dashboardData } = useDashboardOverviewData(user.type);
    const { staffOverviewData } = dashboardOverviewData(dashboardData);

    return (
        <div className="w-full p-4 sm:p-6">
            <WelcomeBanner user={user} />

            <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <OverviewDataCards
                    overviewData={staffOverviewData}
                    userType={user.type}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="col-span-5 p-6 border bg-white rounded-lg">
                    <h2 className="mb-4 font-bold text-gray-700">Application Funnel</h2>
                    <FunnelChart
                        applicationData={dashboardData?.applicationData}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="col-span-3 lg:col-span-2 mt-6 p-6 border bg-white rounded-lg">
                    <h2 className="mb-4 font-bold text-gray-700">
                        Rendered Hours Chart (Top 10)
                    </h2>
                    <DutyHoursChart
                        scholars={dashboardData?.tenScholarsByHighestDutyHours}
                    />
                </div>

                <div className="col-span-3 lg:mt-6 p-6 border bg-white rounded-lg">
                    <h2 className="mb-4 font-bold text-gray-700">
                        Monthly Allowance Distribution
                    </h2>
                    <AllowanceChart
                        monthlyAllowanceDistributionData={
                            dashboardData?.monthlyAllowanceDistributionData
                        }
                    />
                </div>
            </div>

            <div className="w-full mt-6 p-6 border bg-white rounded-lg">
                <h2 className="mb-4 font-bold text-gray-700">Scholar Engagement Trends</h2>
                <ScholarEngagementChart
                    eventAttendanceData={dashboardData?.eventAttendanceData}
                    communityServiceHoursCompletionData={
                        dashboardData?.communityServiceHoursCompletionData
                    }
                />
            </div>
        </div>
    );
}

export default StaffDashboard;
