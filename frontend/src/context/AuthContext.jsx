import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import BASE_URL from "../config";
import { markAuthReady } from "../services/authReadyState";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

const HEARTBEAT_INTERVAL_MS = 25 * 1000; // 25 seconds
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

    useEffect(() => {
        const controller = new AbortController();

        const verifySession = async () => {
            const stored = localStorage.getItem("token");
            if (!stored) {
                setLoading(false);
                markAuthReady();
                return;
            }

            const payload = decodeToken(stored);
            if (!payload) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setLoading(false);
                markAuthReady();
                return;
            }

            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setLoading(false);
                markAuthReady();
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}app/api/heartbeat.php`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${stored}` },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    // Server explicitly said the session is gone — this IS
                    // a reliable signal, safe to clear.
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
                    setLoading(false);
                    markAuthReady();
                    return;
                }

                try {
                    tokenRef.current = stored;
                    setToken(stored);
                    setUser(JSON.parse(storedUser));
                } catch {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                // AbortError = the request was cancelled (e.g. this page is
                // being torn down by another refresh/navigation). That tells
                // us nothing about whether the session is valid — don't wipe
                // localStorage on a guess. A genuine network failure (e.g.
                // server unreachable) is just as ambiguous, so we also leave
                // storage alone and let the app retry on next load instead
                // of forcing a false logout.
                if (err.name !== "AbortError") {
                    console.error("Session verification failed:", err);
                }
                // Restore optimistically from localStorage rather than
                // clearing it — the next successful check will correct
                // this if the session really is dead.
                try {
                    tokenRef.current = stored;
                    setToken(stored);
                    setUser(JSON.parse(storedUser));
                } catch {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }

            setLoading(false);
            markAuthReady();
        };

        verifySession();

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!token) return;
        resetIdleTimers();

        ACTIVITY_EVENTS.forEach((eventName) => {
            document.addEventListener(eventName, recordActivity, {
                passive: true,
            });
        });

        const onStorage = (event) => {
            /* ...unchanged... */
        };
        window.addEventListener("storage", onStorage);

        const onAuthExpired = () => {
            logout();
        };
        window.addEventListener("auth:expired", onAuthExpired);

        const sendHeartbeat = () => {
            if (!tokenRef.current) return;
            fetch(`${BASE_URL}app/api/heartbeat.php`, {
                method: "POST",
                headers: { Authorization: `Bearer ${tokenRef.current}` },
            }).catch(() => {});
        };

        // Don't call sendHeartbeat() immediately here — verifySession() just
        // confirmed liveness a moment ago. Firing another identical check
        // back-to-back is redundant and, on single-threaded dev servers
        // (php -S), can race with the tail of that just-completed request.
        const heartbeatId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") sendHeartbeat();
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            ACTIVITY_EVENTS.forEach((eventName) => {
                document.removeEventListener(eventName, recordActivity);
            });
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("auth:expired", onAuthExpired);
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange,
            );
            clearInterval(heartbeatId);
            clearTimeout(warningTimerRef.current);
            clearTimeout(logoutTimerRef.current);
        };
    }, [token, recordActivity, resetIdleTimers, logout]);

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
