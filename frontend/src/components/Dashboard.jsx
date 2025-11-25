import { date } from "../utils/getDateAndTime";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { dashboardOverviewData } from "../config/dashboardOverviewData";
import UpcomingEvents from "./UpcomingEvents";
import { useEvents } from "../hooks/useEvents";
import RecentActivities from "./RecentActivities";
import { useRecentActivities } from "../hooks/useRecentActivities";
import LivingInfoFormModal from "./LivingInfoFormModal";
import { useEffect, useRef, useState } from "react";
import { getCurrentSchoolYear } from "../utils/getCurrentSchoolYear";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import FunnelChart from "./FunnelChart";
import ScholarEngagementChart from "./ScholarEngagementChart";
import AllowanceChart from "./AllowanceChart";
import DutyHoursChart from "./DutyHoursChart";
import ScholarsByProgramChart from "./ScholarsByProgramChart";
import ApplicationTrendsChart from "./ApplicationTrendsChart";
import ApprovalRejectionChart from "./ApprovalRejectionChart";

function QuickOverview() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const { isAuthenticated, user, loading } = useAuth();
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

    const navigate = useNavigate();

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
            <div className="w-full px-6 pt-6 pb-2">
                {/* <h2 className="text-xl font-bold text-slate-600 mb-4">Dashboard</h2> */}
                <div className="p-6 mb-6 shadow-lg bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
                    <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Welcome back,{" "}
                                {user.type === "admin"
                                    ? user.name
                                    : dashboardData.userName}
                                !
                            </h2>
                            <p className="text-xs text-white">
                                Today is {date.getCurrentDay()},{" "}
                                {formatDate(date.getCurrentDateAndTime())}
                            </p>
                        </div>

                        {/* {user.type !== "scholar" && (
                            <button
                                onClick={() => {
                                    if (user.type === "staff") {
                                        exportStaffDashboardWorkbook(
                                            dashboardData?.applicationData,
                                            dashboardData?.tenScholarsByHighestDutyHours,
                                            dashboardData?.monthlyAllowanceDistributionData,
                                            dashboardData?.eventAttendanceData,
                                            dashboardData?.communityServiceHoursCompletionData
                                        );
                                    } else {
                                        exportAdminDashboardWorkbook(
                                            dashboardData?.scholarsByProgram,
                                            dashboardData?.applicationsSubmittedAndApplicationsApproved,
                                            dashboardData?.approvedAndRejectedByStage,
                                            dashboardData?.eventAttendanceData,
                                            dashboardData?.communityServiceHoursCompletionData
                                        );
                                    }
                                }}
                                className="flex md:m-0 mx-auto items-center gap-2 text-sm text-white 
                                border border-white/40 px-4 py-2 rounded-lg
                                hover:bg-white/20 cursor-pointer transition"
                            >
                                <Download className="w-4 h-4" />
                                Export Dashboard Data
                            </button>
                        )} */}
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            <div className="col-span-5 p-6 border bg-white rounded-lg">
                                <h2 className="mb-4 font-bold">
                                    Application Funnel
                                </h2>
                                <FunnelChart
                                    applicationData={
                                        dashboardData?.applicationData
                                    }
                                />
                            </div>

                            {/* <div className="col-span-3 lg:col-span-2 p-6 border bg-white rounded-lg">
                                <h2 className="mb-4 font-bold">
                                    Orientation & Awarding Attendance
                                </h2>
                                <AttendanceChart />
                            </div> */}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="col-span-3 lg:col-span-2 mt-6 p-6 border bg-white rounded-lg">
                                <h2 className="mb-4 font-bold">
                                    Duty Hours Chart (Top 10)
                                </h2>
                                <DutyHoursChart
                                    scholars={
                                        dashboardData?.tenScholarsByHighestDutyHours
                                    }
                                />
                            </div>

                            <div className="col-span-3 lg:mt-6 p-6 border bg-white rounded-lg">
                                <h2 className="mb-4 font-bold">
                                    Monthly Allowance Distribution
                                </h2>
                                <AllowanceChart
                                    monthlyAllowanceDistributionData={
                                        dashboardData?.monthlyAllowanceDistributionData
                                    }
                                />
                            </div>
                        </div>

                        <div className="w-[100%] mt-6 p-6 border bg-white rounded-lg">
                            <h2 className="mb-4 font-bold">
                                Scholar Engagement Trends
                            </h2>
                            <ScholarEngagementChart
                                eventAttendanceData={
                                    dashboardData?.eventAttendanceData
                                }
                                communityServiceHoursCompletionData={
                                    dashboardData?.communityServiceHoursCompletionData
                                }
                            />
                        </div>

                        {/* <div className="mt-6 border">
                            <UpcomingEvents events={events} />
                            <RecentEvents events={recentEvents} />
                        </div> */}
                    </>
                )}

                {user.type === "admin" && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="col-span-2 p-6 border bg-white rounded-lg">
                                <h2 className="font-bold">
                                    Scholars by Program
                                </h2>
                                <ScholarsByProgramChart
                                    scholarData={
                                        dashboardData?.scholarsByProgram
                                    }
                                />
                            </div>

                            <div className="col-span-3 p-6 border bg-white rounded-lg">
                                <h2 className="font-bold">
                                    Application Trends
                                </h2>
                                <ApplicationTrendsChart
                                    trendData={
                                        dashboardData?.applicationsSubmittedAndApplicationsApproved
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="col-span-2 mt-6 p-6 border bg-white rounded-lg">
                                <h2 className="font-bold">
                                    Approval vs Rejection by Stage
                                </h2>
                                <ApprovalRejectionChart
                                    stageData={
                                        dashboardData?.approvedAndRejectedByStage
                                    }
                                />
                            </div>

                            <div className="col-span-3 mt-6 p-6 border bg-white rounded-lg">
                                <h2 className="mb-4 font-bold">
                                    Scholar Engagement Trends
                                </h2>
                                <ScholarEngagementChart
                                    eventAttendanceData={
                                        dashboardData?.eventAttendanceData
                                    }
                                    communityServiceHoursCompletionData={
                                        dashboardData?.communityServiceHoursCompletionData
                                    }
                                />
                            </div>

                            {/* <div className="col-span-3 lg:mt-6 p-6 border bg-white rounded-lg">
                                <h2 className="mb-4 font-bold">
                                    Monthly Allowance Distribution
                                </h2>
                                <AllowanceChart
                                    monthlyAllowanceDistributionData={
                                        dashboardData?.monthlyAllowanceDistributionData
                                    }
                                />
                            </div> */}
                        </div>

                        {/* <div className="w-[100%] mt-6 p-6 border bg-white rounded-lg">
                            <h2 className="mb-4 font-bold">
                                Scholar Engagement Trends
                            </h2>
                            <ScholarEngagementChart
                                eventAttendanceData={
                                    dashboardData?.eventAttendanceData
                                }
                                communityServiceHoursCompletionData={
                                    dashboardData?.communityServiceHoursCompletionData
                                }
                            />
                        </div> */}
                    </>
                )}
            </div>

            {!dashboardData.hasSubmittedLivingInfo && (
                <LivingInfoFormModal
                    label={`Scholar Information Form`}
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
