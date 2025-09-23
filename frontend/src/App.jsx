// import AdminLayout from "./components/Layout/AdminLayout";
// import ScholarLayout from "./components/Layout/ScholarLayout";
// import StaffLayout from "./components/Layout/StaffLayout";
// import HomePageLayout from "./components/Layout/HomePageLayout";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home/Home";
// import {
//     ApplicationSection,
//     RenewalApplicationSection,
// } from "./pages/Home/ApplicationSection";
// // import ViewRenderedHours from "./pages/Scholar/ViewDutyHoursCopy";
// import LoginForm from "./components/LoginForm"; // Your updated LoginForm
// import NotFound from "./components/NotFound";
// import Dashboard from "./components/Dashboard";
// import InitialInterviewPage from "./pages/Staff/InitialInterview/InitialInterviewPage";
// import EventsPage from "./pages/Staff/Event/EventsPage";
// import HoursLog from "./pages/Scholar/HoursLog";
// import HomeVisitation from "./pages/Staff/HomeVisitation/HomeVisitation";

// // Import JWT components
// import ProtectedRoute from "./routes/ProtectedRoute";
// import "./services/axiosConfig"; // Import axios configuration
// import Applications from "./pages/Staff/Application/Applications";
// import Examination from "./pages/Staff/Examination/Examination";
// import ArchivedActivities from "./pages/Scholar/ArchivedActivities";
// import ScholarAccounts from "./pages/Admin/ScholarAccounts/ScholarAccounts";
// import CommunityServicePage from "./pages/Staff/CommunityServices/CommunityServicePage";
// import CommunityServices from "./pages/Scholar/CommunityServices";
// import ScholarshipCriteria from "./pages/Staff/ScholarshipCriteria/ScholarshipCriteria";
// import ApplicationPeriod from "./pages/Staff/ApplicationPeriod/ApplicationPeriod";
// import Scholars from "./pages/Staff/Scholars/Scholars";
// import ApplicationRecordsPage from "./pages/Staff/ApplicationRecords/ApplicationRecordsPage";
// import StaffAccounts from "./pages/Admin/StaffAccounts/StaffAccounts";
// import {
//     Calendar1,
//     CheckCircle,
//     HandHeartIcon,
//     HandHelping,
//     ScrollText,
//     User,
//     Users,
//     XCircleIcon,
// } from "lucide-react";
// import ReviewedApplications from "./pages/Staff/ReviewedApplications/ReviewedApplications";
// import ReviewPage from "./pages/Home/ApplicationForm/ReviewPage";
// import UserAccount from "./components/UserAccount";

// const overviewData = [
//     {
//         title: "COA Upload Status",
//         status: "Pending",
//         color: "bg-green-400 text-gray-900",
//         icon: "post_add",
//         iconColor: "text-green-600",
//         iconBackground: "bg-green-100",
//     },
//     {
//         title: "COE & Grades",
//         status: "Upload Required",
//         color: "bg-yellow-400 text-gray-900",
//         icon: "upload_file",
//         iconColor: "text-yellow-600",
//         iconBackground: "bg-yellow-100",
//     },
//     {
//         title: "Duty Hours Rendered",
//         status: "20 / 20 Hours Completed",
//         color: "bg-blue-400 text-gray-900",
//         icon: "schedule",
//         iconColor: "text-blue-600",
//         iconBackground: "bg-blue-100",
//     },
//     {
//         title: "Upcoming Events",
//         status: "Orientation (March 15, 2025)",
//         color: "bg-orange-400 text-gray-900",
//         icon: "event",
//         iconColor: "text-orange-600",
//         iconBackground: "bg-orange-100",
//     },
// ];

// const staffOverviewData = [
//     {
//         title: "All Applications",
//         status: "4",
//         color: "bg-green-300 text-gray-900",
//         icon: <ScrollText className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-green-600",
//     },
//     {
//         title: "New Applicants",
//         status: "6",
//         color: "bg-yellow-300 text-gray-900",
//         icon: <Users className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-yellow-600",
//     },
//     {
//         title: "Renewal Applicants",
//         status: "6",
//         color: "bg-blue-300 text-gray-900",
//         icon: <Users className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-blue-600",
//     },
//     {
//         title: "Approved Applications",
//         status: "6",
//         color: "bg-orange-300 text-gray-900",
//         icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
//     {
//         title: "Rejected Applications",
//         status: "2",
//         color: "bg-orange-300 text-gray-900",
//         icon: <XCircleIcon className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
//     {
//         title: "All Scholars",
//         status: "100",
//         color: "bg-orange-300 text-gray-900",
//         icon: <Users className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
//     {
//         title: "New Scholars",
//         status: "40",
//         color: "bg-orange-300 text-gray-900",
//         icon: <Users className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
//     {
//         title: "Old Scholars",
//         status: "60",
//         color: "bg-orange-300 text-gray-900",
//         icon: <Users className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
//     {
//         title: "Upcoming Events",
//         status: "3",
//         color: "bg-orange-300 text-gray-900",
//         icon: <Calendar1 className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
//     {
//         title: "New Community Services",
//         status: "16",
//         color: "bg-orange-300 text-gray-900",
//         icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
//         iconColor: "text-orange-600",
//     },
// ];

// const adminOverviewData = [
//     {
//         title: "Active Accounts",
//         status: "300",
//         color: "bg-green-400 text-gray-900",
//         icon: "person",
//         iconColor: "text-green-600",
//         iconBackground: "bg-green-100",
//     },
//     {
//         title: "Deactivated Accounts",
//         status: "6",
//         color: "bg-yellow-400 text-gray-900",
//         icon: "person_off",
//         iconColor: "text-yellow-600",
//         iconBackground: "bg-yellow-100",
//     },
// ];

// export function App() {
//     return (
//         <Router>
//             <Routes>
//                 {/* Public Routes - HomePageLayout */}
//                 <Route element={<HomePageLayout />}>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/about" element={<ReviewPage />} />
//                     <Route path="/login" element={<LoginForm />} />
//                     <Route
//                         path="/application"
//                         element={<ApplicationSection />}
//                     />
//                 </Route>

//                 {/* Protected Routes - ScholarLayout */}
//                 <Route
//                     element={
//                         <ProtectedRoute allowedRoles={["scholar"]}>
//                             <ScholarLayout />
//                         </ProtectedRoute>
//                     }
//                 >
//                     <Route
//                         path="/scholar/dashboard"
//                         element={<Dashboard overviewData={overviewData} />}
//                     />
//                     <Route
//                         path="/scholar/my-account"
//                         element={<UserAccount />}
//                     />
//                     <Route
//                         path="/scholar/renew"
//                         element={<RenewalApplicationSection />}
//                     />
//                     <Route
//                         path="/scholar/documents"
//                         element={<DocumentsPage />}
//                     />
//                     <Route
//                         path="/scholar/community-services"
//                         element={<CommunityServices />}
//                     />
//                     <Route
//                         path="/scholar/rendered-hours"
//                         element={<HoursLog />}
//                     />
//                     <Route path="/scholar/events" element={<Events />} />
//                     <Route
//                         path="/scholar/archived-activities"
//                         element={<ArchivedActivities />}
//                     />
//                 </Route>

//                 {/* Protected Routes - StaffLayout */}
//                 <Route
//                     element={
//                         <ProtectedRoute allowedRoles={["staff"]}>
//                             <StaffLayout />
//                         </ProtectedRoute>
//                     }
//                 >
//                     <Route
//                         path="/staff/dashboard"
//                         element={
//                             <Dashboard
//                                 overviewData={staffOverviewData}
//                                 dashboard={"staff"}
//                             />
//                         }
//                     />
//                     <Route
//                         path="/staff/scholarship-criteria"
//                         element={<ScholarshipCriteria />}
//                     />
//                     <Route path="/staff/scholars" element={<Scholars />} />
//                     <Route
//                         path="/staff/application-records"
//                         element={<ApplicationRecordsPage />}
//                     />
//                     <Route
//                         path="/staff/applications"
//                         element={<Applications />}
//                     />
//                     <Route
//                         path="/staff/reviewed-applications"
//                         element={<ReviewedApplications />}
//                     />
//                     <Route
//                         path="/staff/examination-list"
//                         element={<Examination />}
//                     />
//                     <Route
//                         path="/staff/application-period"
//                         element={<ApplicationPeriod />}
//                     />
//                     <Route
//                         path="/staff/initial-interview"
//                         element={<InitialInterviewPage />}
//                     />
//                     <Route
//                         path="/staff/home-visitation"
//                         element={<HomeVisitation />}
//                     />
//                     <Route path="/staff/set-events" element={<EventsPage />} />
//                     <Route
//                         path="/staff/community-services"
//                         element={<CommunityServicePage />}
//                     />
//                 </Route>

//                 {/* Protected Routes - AdminLayout */}
//                 <Route
//                     element={
//                         <ProtectedRoute allowedRoles={["admin"]}>
//                             <AdminLayout />
//                         </ProtectedRoute>
//                     }
//                 >
//                     <Route
//                         path="/admin/dashboard"
//                         element={<Dashboard overviewData={adminOverviewData} />}
//                     />
//                     <Route
//                         path="/admin/scholar-account-management"
//                         element={<ScholarAccounts />}
//                     />
//                     <Route
//                         path="/admin/staff-account-management"
//                         element={<StaffAccounts />}
//                     />
//                 </Route>

//                 {/* 404 Route */}
//                 <Route path="*" element={<NotFound />} />
//             </Routes>

//             <ToastContainer position="top-center" autoClose={3000} />
//         </Router>
//     );

//     // return (
//     //     <BatchProvider>
//     //         <Router>
//     //             <Routes>
//     //                 {/* HomePageLayout */}
//     //                 <Route element={<HomePageLayout />}>
//     //                     <Route path="/" element={<Home />} />
//     //                     <Route path="/login" element={<LoginForm />} />
//     //                     <Route
//     //                         path="/application"
//     //                         element={<ApplicationSection />}
//     //                     />
//     //                 </Route>

//     //                 {/* ScholarLayout */}
//     //                 <Route element={<ScholarLayout />}>
//     //                     <Route
//     //                         path="/scholar/dashboard"
//     //                         element={<Dashboard overviewData={overviewData} />}
//     //                     />
//     //                     <Route
//     //                         path="/scholar/renew"
//     //                         element={<RenewalApplicationSection />}
//     //                     />
//     //                     {/* <Route path="/scholar/documents" element={<Documents />} /> */}
//     //                     <Route
//     //                         path="/scholar/documents"
//     //                         element={<DocumentsPage />}
//     //                     />
//     //                     <Route
//     //                         path="/scholar/coa"
//     //                         element={<VolunteerActivities />}
//     //                     />
//     //                     <Route
//     //                         path="/scholar/rendered-hours"
//     //                         element={<HoursLog />}
//     //                     />
//     //                     <Route path="/scholar/events" element={<Events />} />
//     //                     <Route path="/scholar/archive" element={<Archive />} />
//     //                 </Route>

//     //                 {/* StaffLayout */}
//     //                 <Route element={<StaffLayout />}>
//     //                     <Route
//     //                         path="/staff/dashboard"
//     //                         element={
//     //                             <Dashboard
//     //                                 overviewData={staffOverviewData}
//     //                                 dashboard={"staff"}
//     //                             />
//     //                         }
//     //                     />
//     //                     {/* <Route path="/staff/scholarship-criteria" element={<ManageScholarshipInfo />} /> */}
//     //                     <Route
//     //                         path="/staff/scholarship-criteria"
//     //                         element={<ScholarshipCriteriaPage />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/applications"
//     //                         element={<Applications />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/approved-applications"
//     //                         element={<NewApprovedApplications />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/examination-list"
//     //                         element={<Examination />}
//     //                     />
//     //                     {/* <Route path="/staff/examination-list" element={<ExaminationPage />} /> */}
//     //                     <Route
//     //                         path="/staff/application-period"
//     //                         element={<ApplicationPeriodPage />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/initial-interview"
//     //                         element={<InitialInterviewPage />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/home-visitation"
//     //                         element={<HomeVisitation />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/set-events"
//     //                         element={<EventsPage />}
//     //                     />
//     //                     <Route
//     //                         path="/staff/volunteer-activities"
//     //                         element={<ActivitiesPage />}
//     //                     />
//     //                 </Route>

//     //                 {/* AdminLayout */}
//     //                 <Route element={<AdminLayout />}>
//     //                     <Route
//     //                         path="/admin/dashboard"
//     //                         element={
//     //                             <Dashboard overviewData={adminOverviewData} />
//     //                         }
//     //                     />
//     //                     <Route
//     //                         path="/admin/scholar-account-management"
//     //                         element={<ScholarAccountManagement />}
//     //                     />
//     //                     <Route
//     //                         path="/admin/staff-account-management"
//     //                         element={<StaffAccountManagement />}
//     //                     />
//     //                 </Route>

//     //                 <Route path="*" element={<NotFound />} />
//     //             </Routes>

//     //             <ToastContainer position="top-center" autoClose={3000} />
//     //         </Router>
//     //     </BatchProvider>
//     // );
// }

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
import {
    Calendar1,
    CheckCircle,
    HandHeartIcon,
    HandHelping,
    ScrollText,
    User,
    Users,
    XCircleIcon,
} from "lucide-react";
import ReviewedApplications from "./pages/Staff/ReviewedApplications/ReviewedApplications";
import ReviewPage from "./pages/Home/ApplicationForm/ReviewPage";
import UserAccountPage from "./components/UserAccountPage";
import CommunityServices from "./pages/Scholar/CommunityServices/CommunityServices";
import Events from "./pages/Scholar/Events/Events";
import InitialInterview from "./pages/Staff/InitialInterview/InitialInterview";
import FinalInterview from "./pages/Staff/FinalInterview/FinalInterview";

// Component for role-specific login forms
const RoleSpecificLoginForm = ({ role }) => {
    return <LoginForm defaultRole={role} />;
};

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
        title: "All Applications",
        status: "4",
        color: "bg-green-300 text-gray-900",
        icon: <ScrollText className="w-5 h-5 text-slate-600" />,
        iconColor: "text-green-600",
    },
    {
        title: "New Applicants",
        status: "6",
        color: "bg-yellow-300 text-gray-900",
        icon: <Users className="w-5 h-5 text-slate-600" />,
        iconColor: "text-yellow-600",
    },
    {
        title: "Renewal Applicants",
        status: "6",
        color: "bg-blue-300 text-gray-900",
        icon: <Users className="w-5 h-5 text-slate-600" />,
        iconColor: "text-blue-600",
    },
    {
        title: "Approved Applications",
        status: "6",
        color: "bg-orange-300 text-gray-900",
        icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
    },
    {
        title: "Rejected Applications",
        status: "2",
        color: "bg-orange-300 text-gray-900",
        icon: <XCircleIcon className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
    },
    {
        title: "All Scholars",
        status: "100",
        color: "bg-orange-300 text-gray-900",
        icon: <Users className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
    },
    {
        title: "New Scholars",
        status: "40",
        color: "bg-orange-300 text-gray-900",
        icon: <Users className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
    },
    {
        title: "Old Scholars",
        status: "60",
        color: "bg-orange-300 text-gray-900",
        icon: <Users className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
    },
    {
        title: "Upcoming Events",
        status: "3",
        color: "bg-orange-300 text-gray-900",
        icon: <Calendar1 className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
    },
    {
        title: "New Community Services",
        status: "16",
        color: "bg-orange-300 text-gray-900",
        icon: <HandHeartIcon className="w-5 h-5 text-slate-600" />,
        iconColor: "text-orange-600",
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
                    <Route
                        path="/scholar/dashboard"
                        element={<Dashboard overviewData={overviewData} />}
                    />
                    <Route
                        path="/scholar/my-account"
                        element={<UserAccountPage />}
                    />
                    <Route
                        path="/scholar/renew"
                        element={<RenewalApplicationSection />}
                    />
                    {/* <Route
                        path="/scholar/documents"
                        element={<DocumentsPage />}
                    /> */}
                    <Route
                        path="/scholar/community-services"
                        element={<CommunityServices />}
                    />
                    {/* <Route
                        path="/scholar/rendered-hours"
                        element={<HoursLog />}
                    /> */}
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
                        path="/staff/dashboard"
                        element={
                            <Dashboard
                                overviewData={staffOverviewData}
                                dashboard={"staff"}
                            />
                        }
                    />
                    <Route
                        path="/staff/scholarship-criteria"
                        element={<ScholarshipCriteria />}
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
                        path="/staff/examination-list"
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
                    <Route path="/staff/set-events" element={<EventsPage />} />
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
                        path="/admin/dashboard"
                        element={<Dashboard overviewData={adminOverviewData} />}
                    />
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

            <ToastContainer position="top-center" autoClose={3000} />
        </Router>
    );
}
