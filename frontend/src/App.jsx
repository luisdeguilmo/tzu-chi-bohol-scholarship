import AdminLayout from "./components/Layout/AdminLayout";
import ScholarLayout from "./components/Layout/ScholarLayout";
import StaffLayout from "./components/Layout/StaffLayout";
import HomePageLayout from "./components/Layout/HomePageLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ApplicationSection, RenewalApplicationSection } from "./pages/Home/ApplicationSection";
import ViewRenderedHours from "./pages/Scholar/ViewDutyHours";
import Events from "./pages/Scholar/Events";
import Applications from "./pages/Staff/Applications";
import LoginForm from "./components/LoginForm";
import Archive from "./components/Archive";
import ManageScholarshipInfo from "./pages/Staff/ScholarshipCriteriaPage";
import Documents from "./pages/Scholar/Documents";
import NotFound from "./components/NotFound";
import ApprovedApplications from "./pages/Staff/ApprovedApplicationsPage";
import ExaminationPage from "./pages/Staff/ExaminationPage";
import ApplicationPeriod from "./pages/Staff/ApplicationPeriod";
import Dashboard from "./components/Dashboard";
import InitialInterviewPage from "./pages/Staff/InitialInterviewPage";
import ScholarAccountManagement from "./pages/Admin/ScholarAccountManagement";
import StaffAccountManagement from "./pages/Admin/StaffAccountManagement";

const overviewData = [
    {
        title: "COA Upload Status",
        status: "Pending",
        color: "bg-green-400 text-gray-900",
        icon: "post_add",
        iconColor: "text-green-600",
        iconBackground: "bg-green-100",
    },
    {
        title: "COE & Grades",
        status: "Upload Required",
        color: "bg-yellow-400 text-gray-900",
        icon: "upload_file",
        iconColor: "text-yellow-600",
        iconBackground: "bg-yellow-100",
    },
    {
        title: "Duty Hours Rendered",
        status: "20 / 20 Hours Completed",
        color: "bg-blue-400 text-gray-900",
        icon: "schedule",
        iconColor: "text-blue-600",
        iconBackground: "bg-blue-100",
    },
    {
        title: "Upcoming Events",
        status: "Orientation (March 15, 2025)",
        color: "bg-orange-400 text-gray-900",
        icon: "event",
        iconColor: "text-orange-600",
        iconBackground: "bg-orange-100",
    },
];

const staffOverviewData = [
    {
        title: "Applications",
        status: "4",
        color: "bg-green-300 text-gray-900",
        icon: "description",
        iconColor: "text-green-600",
        iconBackground: "bg-green-100",
    },
    {
        title: "New Applicants",
        status: "6",
        color: "bg-yellow-300 text-gray-900",
        icon: "group",
        iconColor: "text-yellow-600",
        iconBackground: "bg-yellow-100",
    },
    {
        title: "Renewal Applicants",
        status: "6",
        color: "bg-blue-300 text-gray-900",
        icon: "group",
        iconColor: "text-blue-600",
        iconBackground: "bg-blue-100",
    },
    {
        title: "Approved Applications",
        status: "6",
        color: "bg-orange-300 text-gray-900",
        icon: "group",
        iconColor: "text-orange-600",
        iconBackground: "bg-orange-100",
    },
];

const adminOverviewData = [
    {
        title: "Active Accounts",
        status: "300",
        color: "bg-green-400 text-gray-900",
        icon: "person",
        iconColor: "text-green-600",
        iconBackground: "bg-green-100",
    },
    {
        title: "Deactivated Accounts",
        status: "6",
        color: "bg-yellow-400 text-gray-900",
        icon: "person_off",
        iconColor: "text-yellow-600",
        iconBackground: "bg-yellow-100",
    },
];

export function App() {
    return (
        <Router>
            <Routes>
                {/* HomePageLayout */}
                <Route element={<HomePageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/application" element={<ApplicationSection />} />
                </Route>

                {/* ScholarLayout */}
                <Route element={<ScholarLayout />}>
                    <Route path="/scholar/dashboard" element={<Dashboard overviewData={overviewData} />} />
                    <Route path="/scholar/renew" element={<RenewalApplicationSection />} />
                    <Route path="/scholar/documents" element={<Documents />} />
                    <Route path="/scholar/rendered-hours" element={<ViewRenderedHours />} />
                    <Route path="/scholar/events" element={<Events />} />
                    <Route path="/scholar/archive" element={<Archive />} />
                </Route>

                {/* StaffLayout */}
                <Route element={<StaffLayout />}>
                    <Route path="/staff/dashboard" element={<Dashboard overviewData={staffOverviewData} />} />
                    <Route path="/staff/scholarship-info" element={<ManageScholarshipInfo />} />
                    <Route path="/staff/applications" element={<Applications />} />
                    <Route path="/staff/approved-applications" element={<ApprovedApplications />} />
                    <Route path="/staff/examination-list" element={<ExaminationPage />} />
                    <Route path="/staff/application-period" element={<ApplicationPeriod />} />
                    <Route path="/staff/initial-interview" element={<InitialInterviewPage />} />
                </Route>

                {/* AdminLayout */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<Dashboard overviewData={adminOverviewData} />} />
                    <Route path="/admin/scholar-account-management" element={<ScholarAccountManagement />} />
                    <Route path="/admin/staff-account-management" element={<StaffAccountManagement />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer position="top-center" autoClose={3000} />
        </Router>
    );
}
