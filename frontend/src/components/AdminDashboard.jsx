import React from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { dashboardOverviewData } from "../config/dashboardOverviewData";
import { WelcomeBanner, OverviewDataCards } from "./ScholarDashboard";

const ScholarsByProgramChart = React.lazy(
    () => import("./ScholarsByProgramChart"),
);
const ApplicationTrendsChart = React.lazy(
    () => import("./ApplicationTrendsChart"),
);
const ApprovalRejectionChart = React.lazy(
    () => import("./ApprovalRejectionChart"),
);
const ScholarEngagementChart = React.lazy(
    () => import("./ScholarEngagementChart"),
);

function AdminDashboard() {
    const { user } = useAuth();
    const { dashboardData } = useDashboardOverviewData(user.type);
    const { adminOverviewData } = dashboardOverviewData(dashboardData);

    return (
        <div className="w-full p-4 sm:p-6">
            <WelcomeBanner user={user} />

            <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <OverviewDataCards
                    overviewData={adminOverviewData}
                    userType={user.type}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="col-span-2 p-6 border bg-white rounded-lg">
                    <h2 className="font-bold text-gray-700">Scholars by Program</h2>
                    <ScholarsByProgramChart
                        scholarData={dashboardData?.scholarsByProgram}
                    />
                </div>

                <div className="col-span-3 p-6 border bg-white rounded-lg">
                    <h2 className="font-bold text-gray-700">Application Trends</h2>
                    <ApplicationTrendsChart
                        trendData={
                            dashboardData?.applicationsSubmittedAndApplicationsApproved
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="col-span-2 mt-6 p-6 border bg-white rounded-lg">
                    <h2 className="font-bold text-gray-700">
                        Approval vs Rejection by Stage
                    </h2>
                    <ApprovalRejectionChart
                        stageData={dashboardData?.approvedAndRejectedByStage}
                    />
                </div>

                <div className="col-span-3 mt-6 p-6 border bg-white rounded-lg">
                    <h2 className="mb-4 font-bold text-gray-700">
                        Scholar Engagement Trends
                    </h2>
                    <ScholarEngagementChart
                        eventAttendanceData={dashboardData?.eventAttendanceData}
                        communityServiceHoursCompletionData={
                            dashboardData?.communityServiceHoursCompletionData
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
