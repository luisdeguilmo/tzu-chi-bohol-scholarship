// utils/logout.js
import { toast } from "react-toastify";

/**
 * Utility function to handle role-specific logout
 * @param {Object} user - The current user object
 * @param {Function} logout - The logout function from AuthContext
 * @param {Function} navigate - The navigate function from react-router-dom
 * @param {string} message - Optional custom logout message
 */
export const handleRoleSpecificLogout = (
    user,
    logout,
    navigate,
    message = "Logged out successfully"
) => {
    // Get the user's role before logout
    const userRole = user?.type || "scholar";

    // Show success message
    toast.success(message);

    // Clear authentication
    logout();

    // Navigate to role-specific login form
    navigate("/login", {
        state: { type: userRole },
        replace: true,
    });
};

/**
 * Alternative function for logout with direct role specification
 * @param {string} role - The user role (scholar, staff, admin)
 * @param {Function} logout - The logout function from AuthContext
 * @param {Function} navigate - The navigate function from react-router-dom
 * @param {string} message - Optional custom logout message
 */
export const logoutWithRole = (
    role,
    logout,
    navigate,
    message = "Logged out successfully"
) => {
    toast.success(message);
    logout();

    navigate("/login", {
        state: { type: role },
        replace: true,
    });
};

/**
 * Get the appropriate dashboard path for a user role
 * @param {string} role - The user role (scholar, staff, admin)
 * @returns {string} The dashboard path for the role
 */
export const getDashboardPath = (role) => {
    switch (role) {
        case "scholar":
            return "/scholar/dashboard";
        case "staff":
            return "/staff/dashboard";
        case "admin":
            return "/admin/dashboard";
        default:
            return "/";
    }
};

/**
 * Get the appropriate login path for a user role
 * @param {string} role - The user role (scholar, staff, admin)
 * @returns {string} The login path for the role
 */
export const getLoginPath = (role) => {
    return `/login/${role}`;
};
