import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login with the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-500">
                    Access Denied. Insufficient permissions.
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
