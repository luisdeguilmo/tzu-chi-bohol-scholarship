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
        <Suspense
            fallback={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                    <div className="flex items-end gap-1 h-10">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 bg-emerald-500 rounded-full animate-bounce"
                                style={{
                                    height: "10px",
                                    animationDelay: `${i * 100}ms`,
                                }}
                            />
                        ))}
                    </div>

                    <p className="text-sm text-slate-500">Loading data...</p>
                </div>
            }
        >
            {user.type === "scholar" && <ScholarDashboard />}
            {user.type === "staff" && <StaffDashboard />}
            {user.type === "admin" && <AdminDashboard />}
        </Suspense>
    );
}

export default Dashboard;
