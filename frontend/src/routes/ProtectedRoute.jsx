// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//     const { user, loading } = useAuth();
//     const location = useLocation();

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-xl">Loading...</div>
//             </div>
//         );
//     }

//     // if (!user) {
//     //     // Redirect to login with the attempted location
//     //     return <Navigate to="/login/scholar" state={{ from: location }} replace />;
//     // }

//     // Check if user has required role
//     if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-xl text-red-500">
//                     Access Denied. Insufficient permissions.
//                 </div>
//             </div>
//         );
//     }

//     return children;
// };

// export default ProtectedRoute;


import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login with current location
    if (!isAuthenticated) {
        // Determine which login page to redirect to based on the attempted route
        let loginPath = "/login/scholar"; // default
        
        if (location.pathname.startsWith("/staff")) {
            loginPath = "/login/staff";
        } else if (location.pathname.startsWith("/admin")) {
            loginPath = "/login/admin";
        } else if (location.pathname.startsWith("/scholar")) {
            loginPath = "/login/scholar";
        }

        return (
            <Navigate 
                to={loginPath} 
                state={{ from: location }} 
                replace 
            />
        );
    }

    // If authenticated but user doesn't have required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.type)) {
        // Redirect to their appropriate dashboard
        const userDashboard = `/${user.type}/dashboard`;
        return <Navigate to={userDashboard} replace />;
    }

    // If all checks pass, render the protected component
    return children;
};

export default ProtectedRoute;