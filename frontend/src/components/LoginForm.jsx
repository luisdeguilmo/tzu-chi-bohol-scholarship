import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../services/axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, EyeClosed, EyeIcon } from "lucide-react";
import BASE_URL from "../config";

const LoginForm = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, isAuthenticated } = useAuth();

    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    // Get the intended destination from location state, or use default based on role
    const from =
        location.state?.from?.pathname || getDefaultDestination(role, user);

    // Function to get default destination based on role and user type
    function getDefaultDestination(loginRole, currentUser) {
        if (currentUser && currentUser.type) {
            // If user is already logged in, redirect to their dashboard
            switch (currentUser.type) {
                case "scholar":
                    return "/scholar/dashboard";
                case "staff":
                    return "/staff/dashboard";
                case "admin":
                    return "/admin/dashboard";
                default:
                    return "/";
            }
        }

        // If no user, use the login role to determine default destination
        switch (loginRole) {
            case "scholar":
                return "/scholar/dashboard";
            case "staff":
                return "/staff/dashboard";
            case "admin":
                return "/admin/dashboard";
            default:
                return "/";
        }
    }

    // Redirect if already authenticated and user type matches the login role
    useEffect(() => {
        if (isAuthenticated && user) {
            // Check if user is trying to login with a different role than their account type
            if (user.type !== role) {
                toast.warning(
                    `You are already logged in as ${user.type}. Please logout first to switch roles.`
                );
                return;
            }

            // If user type matches the login role, redirect to appropriate dashboard
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, role, from, navigate]);

    // If already authenticated with matching role, redirect immediately
    if (isAuthenticated && user && user.type === role) {
        return <Navigate to={from} replace />;
    }

    // If authenticated but with different role, show warning
    if (isAuthenticated && user && user.type !== role) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-10 rounded-xl shadow-lg w-[90%] sm:max-w-[450px] border border-gray-200">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Already Logged In
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You are currently logged in as{" "}
                            <strong>{user.type}</strong>. Please logout first to
                            access the {role} login.
                        </p>
                        <button
                            onClick={() => navigate(`/${user.type}/dashboard`)}
                            className="w-full p-3 text-white text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium mr-2"
                        >
                            Go to {user.type} Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
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
                type: role,
                email: email.trim(),
                password: password,
            };

            console.log(data);

            const response = await axios.post(
                `${BASE_URL}app/views/login.php`,
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
                // Verify that the user type matches the login role
                if (result.user.type !== role) {
                    setError(
                        `This account is registered as ${result.user.type}, not ${role}. Please use the correct login page.`
                    );
                    return;
                }

                // Use the auth context login method
                login(result.token, result.user);

                toast.success("Login successful!");

                // Navigate to the intended destination or default dashboard
                const destination =
                    from || getDefaultDestination(role, result.user);
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

    const handleSendResetLink = async (e) => {
        console.log(email);
        e.preventDefault();
        try {
            setLoading(true);

            const data = {
                email: email.trim(),
            };

            const response = await axios.post(
                `${BASE_URL}app/views/password-reset.php?action=request_reset`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message);
                setIsEmailSent(true);
                // setIsResetPassword(false);
            } else {
                console.log(result);
                setError(result.message || "Failed to send reset link.");
            }

            setLoading(false);
        } catch (err) {
            console.error("Error sending reset link:", err);
            setLoading(false);
        }
    };

    const images = [
        "/src/assets/img.jpg",
        "/src/assets/img1.jpg",
        "/src/assets/img3.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev + 1) % images.length);
            setTimeout(() => setIsTransitioning(false), 300);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handlePrevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const handleNextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    return (
        <div className="hero flex items-center justify-center min-h-screen">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-bg ${index === currentIndex ? "visible" : "hidden"}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <div className="bg-white p-10 rounded-md shadow-lg absolute z-30 top-[75%] md:top-[70%] left-[50%] translate-x-[-50%] translate-y-[-100%] w-[80%] sm:max-w-[400px] border border-gray-200">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isResetPassword
                            ? "Forgot Password"
                            : `${role.charAt(0).toUpperCase() + role.slice(1)} Login`}
                    </h2>
                    <p className="mt-2 text-gray-500/90 text-sm">
                        {isResetPassword
                            ? "Enter your email to receive a password reset link."
                            : "Please sign in to your account"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form
                    onSubmit={
                        isResetPassword ? handleSendResetLink : handleLogin
                    }
                    className="space-y-4"
                >
                    {isEmailSent && isResetPassword ? (
                        <p className="mt-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded-md text-sm flex items-start gap-2">
                            <svg
                                className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span>
                                If an account with that email exists, a password
                                reset link has been sent.
                            </span>
                        </p>
                    ) : (
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-1 text-xs font-medium text-gray-700"
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
                                className="w-full p-3 outline-none border border-gray-300 text-[13px] text-gray-700 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                            />
                        </div>
                    )}

                    {!isResetPassword && (
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-1 text-xs font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="w-full p-3 outline-none border border-gray-300 text-[13px] text-gray-700 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                                />
                                <span
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="p-1 rounded-full cursor-pointer absolute top-[50%] right-2 translate-y-[-50%] hover:bg-gray-100"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="w-4 h-4  text-gray-700" />
                                    ) : (
                                        <EyeClosed className="w-4 h-4  text-gray-700" />
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`${isEmailSent ? "hidden" : "block"} w-full p-3 text-white text-xs rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
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
                                {isResetPassword
                                    ? "Sending..."
                                    : "Signing In..."}
                            </span>
                        ) : isResetPassword ? (
                            "Send Reset Link"
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <p className="text-xs text-gray-600">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800  hover:underline font-medium"
                            onClick={() => {
                                setIsResetPassword(!isResetPassword);
                                setIsEmailSent(false);
                                setEmail("");
                                setError("");
                            }}
                        >
                            <ArrowLeft
                                className={`inline w-4 h-4 mr-1 ${isResetPassword ? "block" : "hidden"}`}
                            />
                            {isResetPassword
                                ? "Back to Login"
                                : "Forgot Password?"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
