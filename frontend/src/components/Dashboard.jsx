import React, { useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "./PageLoader";

const ScholarDashboard = React.lazy(() => import("./ScholarDashboard"));
const StaffDashboard = React.lazy(() => import("./StaffDashboard"));
const AdminDashboard = React.lazy(() => import("./AdminDashboard"));

function Dashboard() {
    const { pathname } = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <Suspense fallback={null}>
            {user.type === "scholar" && <ScholarDashboard />}
            {user.type === "staff" && <StaffDashboard />}
            {user.type === "admin" && <AdminDashboard />}
        </Suspense>
    );
}

export default Dashboard;
