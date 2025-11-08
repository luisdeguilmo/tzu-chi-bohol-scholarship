import AdminLayout from "./components/Layout/AdminLayout";
import ScholarLayout from "./components/Layout/ScholarLayout";
import StaffLayout from "./components/Layout/StaffLayout";
import HomePageLayout from "./components/Layout/HomePageLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import {
    ApplicationSection,
    RenewalApplicationSection,
} from "./pages/Home/ApplicationSection";
import LoginForm from "./components/LoginForm";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import EventsPage from "./pages/Staff/Event/EventsPage";
import HomeVisitation from "./pages/Staff/HomeVisitation/HomeVisitation";

// Import JWT components
import ProtectedRoute from "./routes/ProtectedRoute";
import "./services/axiosConfig";
import Applications from "./pages/Staff/Application/Applications";
import Examination from "./pages/Staff/Examination/Examination";
import ArchivedActivities from "./pages/Scholar/ArchivedActivities/ArchivedActivities";
import ScholarAccounts from "./pages/Admin/ScholarAccounts/ScholarAccounts";
import CommunityServicePage from "./pages/Staff/CommunityServices/CommunityServicePage";
import ScholarshipCriteria from "./pages/Staff/ScholarshipCriteria/ScholarshipCriteria";
import ApplicationPeriod from "./pages/Staff/ApplicationPeriod/ApplicationPeriod";
import Scholars from "./pages/Staff/Scholars/Scholars";
import ApplicationRecordsPage from "./pages/Staff/ApplicationRecords/ApplicationRecordsPage";
import StaffAccounts from "./pages/Admin/StaffAccounts/StaffAccounts";
import ReviewedApplications from "./pages/Staff/ReviewedApplications/ReviewedApplications";
import ReviewPage from "./pages/Home/ApplicationForm/ReviewPage";
import UserAccountPage from "./components/UserAccountPage";
import CommunityServices from "./pages/Scholar/CommunityServices/CommunityServices";
import Events from "./pages/Scholar/Events/Events";
import InitialInterview from "./pages/Staff/InitialInterview/InitialInterview";
import FinalInterview from "./pages/Staff/FinalInterview/FinalInterview";
import ResetPasswordForm from "./components/ResetPasswordForm";
import CollegeUniversityManagement from "./pages/Staff/CollegeUniversityManagement/CollegeUniversityManagement";
import OrientationAndAwarding from "./pages/Staff/OrientationAndAwarding/OrientationAndAwarding";
import MonthlyAllowanceSummaryPage from "./pages/Staff/MonthlyAllowanceSummary/MonthlyAllowanceSummaryPage";
import StaffAccount from "./components/StaffAccountPage";
import AdminAccount from "./components/AdminAccountPage";

// Component for role-specific login forms
const RoleSpecificLoginForm = ({ role }) => {
    return <LoginForm defaultRole={role} />;
};

export function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes - HomePageLayout */}
                <Route element={<HomePageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<ReviewPage />} />

                    {/* Generic login route */}
                    {/* <Route path="/login" element={<LoginForm />} /> */}

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
                            <ScholarLayout />
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
                        path="/scholar/community-services"
                        element={<CommunityServices />}
                    />
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
                            <StaffLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/staff/my-account"
                        element={<StaffAccount />}
                    />
                    <Route
                        path="/staff/monthly-allowance-summary"
                        element={<MonthlyAllowanceSummaryPage />}
                    />
                    <Route path="/staff/dashboard" element={<Dashboard />} />
                    <Route
                        path="/staff/scholarship-criteria"
                        element={<ScholarshipCriteria />}
                    />
                    <Route
                        path="/staff/college-university"
                        element={<CollegeUniversityManagement />}
                    />
                    <Route path="/staff/scholars" element={<Scholars />} />
                    <Route
                        path="/staff/application-records"
                        element={<ApplicationRecordsPage />}
                    />
                    <Route
                        path="/staff/applications"
                        element={<Applications />}
                    />
                    <Route
                        path="/staff/reviewed-applications"
                        element={<ReviewedApplications />}
                    />
                    <Route
                        path="/staff/entrance-examination"
                        element={<Examination />}
                    />
                    <Route
                        path="/staff/application-period"
                        element={<ApplicationPeriod />}
                    />
                    <Route
                        path="/staff/initial-interview"
                        element={<InitialInterview />}
                    />
                    <Route
                        path="/staff/home-visitation"
                        element={<HomeVisitation />}
                    />
                    <Route
                        path="/staff/final-interview"
                        element={<FinalInterview />}
                    />
                    <Route
                        path="/staff/orientation-awarding-attendance"
                        element={<OrientationAndAwarding />}
                    />
                    <Route path="/staff/events" element={<EventsPage />} />
                    <Route
                        path="/staff/community-services"
                        element={<CommunityServicePage />}
                    />
                </Route>

                {/* Protected Routes - AdminLayout */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/admin/my-account"
                        element={<AdminAccount />}
                    />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route
                        path="/admin/scholar-account-management"
                        element={<ScholarAccounts />}
                    />
                    <Route
                        path="/admin/staff-account-management"
                        element={<StaffAccounts />}
                    />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer
                toastClassName={"md:text-sm text-xs text-gray-700 text-center"}
                position="top-center"
                autoClose={3000}
            />
        </Router>
    );
}
