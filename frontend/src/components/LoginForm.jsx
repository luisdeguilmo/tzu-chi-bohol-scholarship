import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../services/axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // const userType = location.state;
    // Get user type from location state or URL params
    let userType = location.state?.type || "scholar";

    // ||
    // new URLSearchParams(location.search).get("type") ||
    // "User";

    // Get the intended destination after login
    // const from = location.state?.from?.pathname || "/scholar/dashboard";
    // const from = location.state?.from?.pathname || "/scholar/dashboard";

    // console.log('Check from variable: ', typeof from);

    let from = null;

    if (location.state?.from?.pathname) {
        const path = location.state?.from?.pathname;
        from = path
            .substring(path.indexOf("/"), path.lastIndexOf("/"))
            .concat("/dashboard");
    } else if (userType === "scholar") {
        from = "/scholar/dashboard";
    } else if (userType === "staff") {
        from = "/staff/dashboard";
    } else if (userType === "admin") {
        from = "/admin/dashboard";
    }

    console.log("User Type:", userType);
    console.log("Intended Destination:", from);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            const data = {
                type: userType,
                email: email.trim(),
                password: password,
            };

            console.log(data);

            const response = await axios.post(
                "http://localhost:8000/app/views/loginx.php",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            console.log("Login response:", result);

            if (result.success && result.token) {
                // Use the auth context login method
                login(result.token, result.user);

                toast.success("Login successful!");

                // Navigate based on user type or intended destination
                const destination =
                    from !== "/dashboard"
                        ? from
                        : result.user.type === "scholar"
                        ? "/scholar/dashboard"
                        : result.user.type === "staff"
                        ? "/staff/dashboard"
                        : result.user.type === "admin"
                        ? "/admin/dashboard"
                        : "/";

                navigate(destination, { replace: true });
                console.log("Navigating to:", destination);
            } else {
                setError(
                    result.message || "Invalid credentials. Please try again."
                );
            }
        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError("Invalid credentials. Please try again.");
            } else if (err.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(
                    "Login failed. Please check your connection and try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-10 rounded-xl shadow-lg w-[90%] sm:max-w-[450px] border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {userType} Login
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Please sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 outline-none border border-gray-300 text-sm rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 outline-none border border-gray-300 text-sm rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 text-white text-sm rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Forgot your password?{" "}
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() =>
                                toast.info("Please contact your administrator")
                            }
                        >
                            Contact Admin
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
