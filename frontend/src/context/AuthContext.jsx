import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import BASE_URL from "../config";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 180 * 1000; // warn 3 minute before logout
const ACTIVITY_STORAGE_KEY = "lastActivityAt";
const WRITE_THROTTLE_MS = 5000;
const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
];

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
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [idleWarning, setIdleWarning] = useState(false); // UI can show a "still there?" modal

    // Refs so timers always see current values without re-subscribing effects
    const tokenRef = useRef(null);
    const warningTimerRef = useRef(null);
    const logoutTimerRef = useRef(null);
    const lastWriteRef = useRef(0);
    const idleWarningRef = useRef(false);

    const logout = useCallback((reason) => {
        const currentToken = tokenRef.current;

        if (currentToken) {
            fetch(`${BASE_URL}app/api/logout.php`, {
                method: "POST",
                headers: { Authorization: `Bearer ${currentToken}` },
            }).catch(() => {});
        }

        clearTimeout(warningTimerRef.current);
        clearTimeout(logoutTimerRef.current);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(ACTIVITY_STORAGE_KEY);

        tokenRef.current = null;
        idleWarningRef.current = false;
        setToken(null);
        setUser(null);
        setIdleWarning(false);

        if (reason === "idle") {
            window.dispatchEvent(new CustomEvent("auth:idle-logout"));
        }
    }, []);

    const resetIdleTimers = useCallback(() => {
        clearTimeout(warningTimerRef.current);
        clearTimeout(logoutTimerRef.current);

        if (!tokenRef.current) return;

        warningTimerRef.current = setTimeout(() => {
            idleWarningRef.current = true;
            setIdleWarning(true);
        }, IDLE_LIMIT_MS - WARNING_BEFORE_MS);

        logoutTimerRef.current = setTimeout(() => {
            logout("idle");
        }, IDLE_LIMIT_MS);
    }, [logout]);

    const recordActivity = useCallback(() => {
        if (!tokenRef.current) return;

        // Once the warning is showing, ignore ambient mouse/keyboard/scroll activity.
        // Only the explicit "Stay Logged In" button (stayLoggedIn) should dismiss it.
        if (idleWarningRef.current) return;

        resetIdleTimers();

        // Throttle the cross-tab broadcast, not the timer reset itself
        const now = Date.now();
        if (now - lastWriteRef.current > WRITE_THROTTLE_MS) {
            lastWriteRef.current = now;
            localStorage.setItem(ACTIVITY_STORAGE_KEY, String(now));
        }
    }, [resetIdleTimers]);

    // Explicit "Stay Logged In" action — the only thing that can dismiss
    // the warning once it's showing.
    const stayLoggedIn = useCallback(() => {
        idleWarningRef.current = false;
        setIdleWarning(false);
        resetIdleTimers();

        const now = Date.now();
        lastWriteRef.current = now;
        localStorage.setItem(ACTIVITY_STORAGE_KEY, String(now));
    }, [resetIdleTimers]);

    // On mount, restore session from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) {
            const payload = decodeToken(stored);
            if (payload) {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        tokenRef.current = stored;
                        setToken(stored);
                        setUser(JSON.parse(storedUser));
                    } catch {
                        logout();
                    }
                } else {
                    logout();
                }
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Wire up activity listeners + cross-tab sync whenever we have a session
    useEffect(() => {
        if (!token) return;

        resetIdleTimers();

        ACTIVITY_EVENTS.forEach((eventName) => {
            document.addEventListener(eventName, recordActivity, {
                passive: true,
            });
        });

        const onStorage = (event) => {
            if (event.key === ACTIVITY_STORAGE_KEY && event.newValue) {
                resetIdleTimers();
                setIdleWarning(false);
            }
            // Another tab logged out (token cleared) — mirror it here

            if (event.key === "token" && event.newValue === null) {
                clearTimeout(warningTimerRef.current);
                clearTimeout(logoutTimerRef.current);
                tokenRef.current = null;
                idleWarningRef.current = false;
                setToken(null);
                setUser(null);
                setIdleWarning(false);
            }
        };
        window.addEventListener("storage", onStorage);

        return () => {
            ACTIVITY_EVENTS.forEach((eventName) => {
                document.removeEventListener(eventName, recordActivity);
            });
            window.removeEventListener("storage", onStorage);
            clearTimeout(warningTimerRef.current);
            clearTimeout(logoutTimerRef.current);
        };
    }, [token, recordActivity, resetIdleTimers]);

    const login = useCallback((newToken, userData) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem(ACTIVITY_STORAGE_KEY, String(Date.now()));
        tokenRef.current = newToken;
        setToken(newToken);
        setUser(userData);
        setIdleWarning(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                loading,
                idleWarning, // true when 1 min left — show a "still there?" modal
                stayLoggedIn,
                extendSession: recordActivity,
                isAuthenticated: !!token && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// import {
//     createContext,
//     useContext,
//     useState,
//     useEffect,
//     useCallback,
// } from "react";

// const AuthContext = createContext(null);

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context)
//         throw new Error("useAuth must be used within an AuthProvider");
//     return context;
// };

// // Decodes a JWT payload without verifying signature (verification is server-side)
// function decodeToken(token) {
//     try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         if (payload.exp * 1000 <= Date.now()) return null; // expired
//         return payload;
//     } catch {
//         return null;
//     }
// }

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null); // profile data from login response
//     const [token, setToken] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // On mount, restore session from localStorage
//     useEffect(() => {
//         const stored = localStorage.getItem("token");
//         if (stored) {
//             const payload = decodeToken(stored);
//             if (payload) {
//                 setToken(stored);
//                 // Restore user from localStorage too (set at login time)
//                 const storedUser = localStorage.getItem("user");
//                 if (storedUser) {
//                     try {
//                         setUser(JSON.parse(storedUser));
//                     } catch {
//                         logout();
//                     }
//                 } else {
//                     logout();
//                 }
//             } else {
//                 // Token expired — clear storage silently
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("user");
//             }
//         }
//         setLoading(false);
//     }, []);

//     const login = useCallback((newToken, userData) => {
//         localStorage.setItem("token", newToken);
//         localStorage.setItem("user", JSON.stringify(userData));
//         setToken(newToken);
//         setUser(userData);
//     }, []);

//     const logout = useCallback(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setToken(null);
//         setUser(null);
//     }, []);

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 token,
//                 login,
//                 logout,
//                 loading,
//                 isAuthenticated: !!token && !!user,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

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
