import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARDS = {
    scholar : "/scholar/dashboard",
    staff   : "/staff/dashboard",
    admin   : "/admin/dashboard",
};

const LOGIN_PATHS = {
    scholar : "/login/scholar",
    staff   : "/login/staff",
    admin   : "/login/admin",
};

function loginPathForRoute(pathname) {
    for (const [role, path] of Object.entries(LOGIN_PATHS)) {
        if (pathname.startsWith(`/${role}`)) return path;
    }
    return LOGIN_PATHS.scholar;
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const location = useLocation();

    // Listen for token expiry events fired by axiosConfig
    useEffect(() => {
        const handleExpiry = () => logout();
        window.addEventListener("auth:expired", handleExpiry);
        return () => window.removeEventListener("auth:expired", handleExpiry);
    }, [logout]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /> */}
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={loginPathForRoute(location.pathname)}
                state={{ from: location }}
                replace
            />
        );
    }

    // Authenticated but wrong role — send to their own dashboard
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.type)) {
        return <Navigate to={ROLE_DASHBOARDS[user.type] ?? "/"} replace />;
    }

    return children;
};

export default ProtectedRoute;



// // ProtectedRoute.jsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//     const { isAuthenticated, user, loading } = useAuth();
//     const location = useLocation();

//     // Show loading spinner while checking authentication
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     // If not authenticated, redirect to login with current location
//     if (!isAuthenticated) {
//         // Determine which login page to redirect to based on the attempted route
//         let loginPath = "/login/scholar"; // default
        
//         if (location.pathname.startsWith("/staff")) {
//             loginPath = "/login/staff";
//         } else if (location.pathname.startsWith("/admin")) {
//             loginPath = "/login/admin";
//         } else if (location.pathname.startsWith("/scholar")) {
//             loginPath = "/login/scholar";
//         }

//         return (
//             <Navigate 
//                 to={loginPath} 
//                 state={{ from: location }} 
//                 replace 
//             />
//         );
//     }

//     // If authenticated but user doesn't have required role
//     if (allowedRoles.length > 0 && !allowedRoles.includes(user?.type)) {
//         // Redirect to their appropriate dashboard
//         const userDashboard = `/${user.type}/dashboard`;
//         return <Navigate to={userDashboard} replace />;
//     }

//     // If all checks pass, render the protected component
//     return children;
// };

// export default ProtectedRoute;
