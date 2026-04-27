import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

// Decodes a JWT payload without verifying signature (verification is server-side)
function decodeToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 <= Date.now()) return null; // expired
        return payload;
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);   // profile data from login response
    const [token, setToken]     = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, restore session from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) {
            const payload = decodeToken(stored);
            if (payload) {
                setToken(stored);
                // Restore user from localStorage too (set at login time)
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try { setUser(JSON.parse(storedUser)); } catch { logout(); }
                } else {
                    logout();
                }
            } else {
                // Token expired — clear storage silently
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback((newToken, userData) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            loading,
            isAuthenticated: !!token && !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
};




// // AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [token, setToken] = useState(localStorage.getItem("token"));

//     useEffect(() => {
//         if (token) {
//             try {
//                 // Decode JWT token to get user info
//                 const payload = JSON.parse(atob(token.split(".")[1]));

//                 // Check if token is expired
//                 if (payload.exp * 1000 > Date.now()) {
//                     setUser(payload);
//                     // Set default axios header
//                     axios.defaults.headers.common[
//                         "Authorization"
//                     ] = `Bearer ${token}`;
//                 } else {
//                     // Token expired
//                     logout();
//                 }
//             } catch (error) {
//                 console.error("Invalid token:", error);
//                 logout();
//             }
//         }
//         setLoading(false);
//     }, [token]);

//     const login = (token, userData) => {
//         localStorage.setItem("token", token);
//         setToken(token);
//         setUser(userData);
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setToken(null);
//         setUser(null);
//         delete axios.defaults.headers.common["Authorization"];
//     };

//     const value = {
//         user,
//         token,
//         login,
//         logout,
//         loading,
//         isAuthenticated: !!user,
//     };

//     return (
//         <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//     );
// };





// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "../services/axiosConfig";
// import BASE_URL from "../config";

// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Check session on mount and periodically
//     useEffect(() => {
//         checkSession();

//         // Optional: Check session every 5 minutes to keep it alive
//         const interval = setInterval(() => {
//             checkSession();
//         }, 5 * 60 * 1000);

//         return () => clearInterval(interval);
//     }, []);

//     const checkSession = async () => {
//         try {
//             const response = await axios.get(
//                 `${BASE_URL}app/views/check-session.php`,
//                 {
//                     withCredentials: true // Important for sending cookies
//                 }
//             );

//             if (response.data.authenticated && response.data.user) {
//                 setUser(response.data.user);
//             } else {
//                 setUser(null);
//             }
//         } catch (error) {
//             console.error("Session check failed:", error);
//             setUser(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (userData) => {
//         // No need to store token - session is managed by server
//         setUser(userData);
//         // Optionally recheck session to ensure sync
//         await checkSession();
//     };

//     const logout = async () => {
//         try {
//             await axios.post(
//                 `${BASE_URL}app/views/logout.php`,
//                 {},
//                 {
//                     withCredentials: true
//                 }
//             );
//         } catch (error) {
//             console.error("Logout error:", error);
//         } finally {
//             setUser(null);
//         }
//     };

//     const value = {
//         user,
//         login,
//         logout,
//         loading,
//         isAuthenticated: !!user,
//         checkSession,
//     };

//     return (
//         <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//     );
// };