import React, { Suspense, useEffect, useState } from "react";
const AdminLayout = React.lazy(() => import("./components/Layout/AdminLayout"));
const ScholarLayout = React.lazy(
    () => import("./components/Layout/ScholarLayout"),
);
const StaffLayout = React.lazy(() => import("./components/Layout/StaffLayout"));
const HomePageLayout = React.lazy(
    () => import("./components/Layout/HomePageLayout"),
);
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Home = React.lazy(() => import("./pages/Home/Home"));
import {
    ApplicationSection,
    RenewalApplicationSection,
} from "./pages/Home/ApplicationSection";
const LoginForm = React.lazy(() => import("./components/LoginForm"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const EventsPage = React.lazy(() => import("./pages/Staff/Event/EventsPage"));
const NotFound = React.lazy(() => import("./components/NotFound"));
const HomeVisitation = React.lazy(
    () => import("./pages/Staff/HomeVisitation/HomeVisitation"),
);

import ProtectedRoute from "./routes/ProtectedRoute";
import "./services/axiosConfig";
import PageLoader from "./components/PageLoader";

const Applications = React.lazy(
    () => import("./pages/Staff/Application/Applications"),
);
const Examination = React.lazy(
    () => import("./pages/Staff/Examination/Examination"),
);
const ArchivedActivities = React.lazy(
    () => import("./pages/Scholar/ArchivedActivities/ArchivedActivities"),
);
const ScholarAccounts = React.lazy(
    () => import("./pages/Admin/ScholarAccounts/ScholarAccounts"),
);
const CommunityServicePage = React.lazy(
    () => import("./pages/Staff/CommunityServices/CommunityServicePage"),
);
const ScholarshipCriteria = React.lazy(
    () => import("./pages/Staff/ScholarshipCriteria/ScholarshipCriteria"),
);
const ApplicationPeriod = React.lazy(
    () => import("./pages/Staff/ApplicationPeriod/ApplicationPeriod"),
);
const Scholars = React.lazy(() => import("./pages/Staff/Scholars/Scholars"));
const ApplicationRecordsPage = React.lazy(
    () => import("./pages/Staff/ApplicationRecords/ApplicationRecordsPage"),
);
const StaffAccounts = React.lazy(
    () => import("./pages/Admin/StaffAccounts/StaffAccounts"),
);
const ReviewedApplications = React.lazy(
    () => import("./pages/Staff/ReviewedApplications/ReviewedApplications"),
);
const UserAccountPage = React.lazy(
    () => import("./components/UserAccountPage"),
);
const CommunityServices = React.lazy(
    () => import("./pages/Scholar/CommunityServices/CommunityServices"),
);
const Events = React.lazy(() => import("./pages/Scholar/Events/Events"));
const InitialInterview = React.lazy(
    () => import("./pages/Staff/InitialInterview/InitialInterview"),
);
const FinalInterview = React.lazy(
    () => import("./pages/Staff/FinalInterview/FinalInterview"),
);
const ResetPasswordForm = React.lazy(
    () => import("./components/ResetPasswordForm"),
);
const CollegeUniversityManagement = React.lazy(
    () =>
        import(
            "./pages/Staff/CollegeUniversityManagement/CollegeUniversityManagement"
        ),
);
const OrientationAndAwarding = React.lazy(
    () => import("./pages/Staff/OrientationAndAwarding/OrientationAndAwarding"),
);
const MonthlyAllowanceSummaryPage = React.lazy(
    () =>
        import(
            "./pages/Staff/MonthlyAllowanceSummary/MonthlyAllowanceSummaryPage"
        ),
);
const StaffAccount = React.lazy(() => import("./components/StaffAccountPage"));
const AdminAccount = React.lazy(() => import("./components/AdminAccountPage"));
const AboutSection = React.lazy(() => import("./pages/Home/About"));
const OurMission = React.lazy(() => import("./pages/Home/OurMission"));
const ScholarsAndAllowances = React.lazy(
    () => import("./pages/Staff/ScholarsAndAllowances/ScholarsAndAllowances"),
);
const CoeGrades = React.lazy(
    () => import("./pages/Scholar/COEAndGrades/COEAndGrades"),
);
const SchoolYears = React.lazy(
    () => import("./pages/Admin/SchoolYears/SchoolYears"),
);
const AuditLogs = React.lazy(() => import("./pages/Admin/AuditLog/AuditLogs"));

// Component for role-specific login forms
const RoleSpecificLoginForm = ({ role }) => {
    return <LoginForm defaultRole={role} />;
};

export function App() {
    // const [devtoolsOpen, setDevtoolsOpen] = useState(false);

    // useEffect(() => {
    //     const handleContextMenu = (e) => {
    //         e.preventDefault();
    //     };

    //     const handleKeyDown = (e) => {
    //         const key = e.key.toUpperCase();

    //         if (
    //             key === "F12" ||
    //             (e.ctrlKey &&
    //                 e.shiftKey &&
    //                 ["I", "J", "C", "K"].includes(key)) ||
    //             (e.ctrlKey && ["U", "S"].includes(key))
    //         ) {
    //             e.preventDefault();
    //             e.stopPropagation();
    //         }
    //     };

    //     const detectDevTools = () => {
    //         const widthThreshold = window.outerWidth - window.innerWidth > 160;

    //         const heightThreshold =
    //             window.outerHeight - window.innerHeight > 160;

    //         setDevtoolsOpen(widthThreshold || heightThreshold);
    //     };

    //     document.addEventListener("contextmenu", handleContextMenu);
    //     document.addEventListener("keydown", handleKeyDown);

    //     const interval = setInterval(detectDevTools, 1000);

    //     return () => {
    //         document.removeEventListener("contextmenu", handleContextMenu);

    //         document.removeEventListener("keydown", handleKeyDown);

    //         clearInterval(interval);
    //     };
    // }, []);

    // if (devtoolsOpen) {
    //     return (
    //         <div
    //             style={{
    //                 height: "100vh",
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 background: "#111",
    //                 color: "#fff",
    //                 fontSize: "24px",
    //             }}
    //         >
    //             Developer tools detected
    //         </div>
    //     );
    // }

    return (
        <Router>
            <Routes>
                {/* Public Routes - HomePageLayout */}
                <Route
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <HomePageLayout />
                        </Suspense>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutSection />} />
                    <Route path="/our-mission" element={<OurMission />} />

                    {/* Role-specific login routes */}
                    <Route
                        path="/login/scholar"
                        element={<LoginForm role="scholar" />}
                    />
                    <Route
                        path="/login/staff"
                        element={<LoginForm role="staff" />}
                    />
                    <Route
                        path="/login/admin"
                        element={<LoginForm role="admin" />}
                    />
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordForm />}
                    />
                    <Route
                        path="/application"
                        element={<ApplicationSection />}
                    />
                </Route>

                {/* Protected Routes - ScholarLayout */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["scholar"]}>
                            <Suspense fallback={<PageLoader />}>
                                <ScholarLayout />
                            </Suspense>
                        </ProtectedRoute>
                    }
                >
                    <Route path="/scholar/dashboard" element={<Dashboard />} />
                    <Route
                        path="/scholar/my-account"
                        element={<UserAccountPage />}
                    />
                    <Route
                        path="/scholar/renew"
                        element={<RenewalApplicationSection />}
                    />
                    <Route
                        path="/scholar/duty-reports"
                        element={<CommunityServices />}
                    />
                    <Route path="/scholar/coe-grades" element={<CoeGrades />} />
                    <Route path="/scholar/events" element={<Events />} />
                    <Route
                        path="/scholar/archived-activities"
                        element={<ArchivedActivities />}
                    />
                </Route>

                {/* Protected Routes - StaffLayout */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["staff"]}>
                            <Suspense fallback={<PageLoader />}>
                                <StaffLayout />
                            </Suspense>
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/staff/my-account"
                        element={<StaffAccount />}
                    />
                    <Route
                        path="/staff/records/monthly-allowance-summary"
                        element={<MonthlyAllowanceSummaryPage />}
                    />
                    <Route path="/staff/dashboard" element={<Dashboard />} />
                    <Route
                        path="/staff/scholarship/scholarship-criteria"
                        element={<ScholarshipCriteria />}
                    />
                    <Route
                        path="/staff/scholarship/college-university"
                        element={<CollegeUniversityManagement />}
                    />
                    <Route
                        path="/staff/records/scholars"
                        element={<Scholars />}
                    />
                    <Route
                        path="/staff/records/scholars-and-allowances"
                        element={<ScholarsAndAllowances />}
                    />
                    <Route
                        path="/staff/records/applications"
                        element={<ApplicationRecordsPage />}
                    />
                    <Route
                        path="/staff/applications/applications-submitted"
                        element={<Applications />}
                    />
                    <Route
                        path="/staff/applications/reviewed-applications"
                        element={<ReviewedApplications />}
                    />
                    <Route
                        path="/staff/applications/entrance-examination"
                        element={<Examination />}
                    />
                    <Route
                        path="/staff/scholarship/application-period"
                        element={<ApplicationPeriod />}
                    />
                    <Route
                        path="/staff/applications/initial-interview"
                        element={<InitialInterview />}
                    />
                    <Route
                        path="/staff/applications/home-visitation"
                        element={<HomeVisitation />}
                    />
                    <Route
                        path="/staff/applications/final-interview"
                        element={<FinalInterview />}
                    />
                    <Route
                        path="/staff/applications/orientation-awarding-attendance"
                        element={<OrientationAndAwarding />}
                    />
                    <Route
                        path="/staff/events-duty/events"
                        element={<EventsPage />}
                    />
                    <Route
                        path="/staff/events-duty/duty-reports"
                        element={<CommunityServicePage />}
                    />
                </Route>

                {/* Protected Routes - AdminLayout */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Suspense fallback={<PageLoader />}>
                                <AdminLayout />
                            </Suspense>
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/admin/my-account"
                        element={<AdminAccount />}
                    />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route
                        path="/admin/users-accounts/scholar-account-management"
                        element={<ScholarAccounts />}
                    />
                    <Route
                        path="/admin/users-accounts/staff-account-management"
                        element={<StaffAccounts />}
                    />
                    <Route
                        path="/admin/school-years"
                        element={<SchoolYears />}
                    />
                    <Route path="/admin/audit-logs" element={<AuditLogs />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer
                toastClassName={"md:text-xs text-xs text-gray-700 text-center"}
                position="top-center"
                autoClose={3000}
            />
        </Router>
    );
}
