import React, { useState, useEffect } from "react";
import axios from "../services/axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, EyeOff, EyeIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import BASE_URL from "../config";
import img from "../assets/img.jpg";
import img1 from "../assets/img1.jpg";
import img3 from "../assets/img3.jpg";

const ResetPasswordForm = () => {
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState({
        new_password: false,
        confirm_password: false,
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [userType, setUserType] = useState("");
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromURL = queryParams.get("token");
        setToken(tokenFromURL);
    }, [location.search]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const data = new URLSearchParams();
            data.append("token", token);
            data.append("new_password", password);
            data.append("confirm_password", confirmPassword);

            const response = await axios.post(
                `${BASE_URL}app/api/password-reset.php?action=update_password`,
                data,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            if (response.data.success) {
                toast.success("Password reset successfully!");
                setUserType(response.data.data.type);
                setIsResetSuccessful(true);
                setError("");
                setPassword("");
                setConfirmPassword("");
                // navigate("/login");
            } else {
                setError(response.data.message || "Failed to reset password");
            }

            setLoading(false);
        } catch (err) {
            console.error("Error sending reset link:", err);
            setLoading(false);
        }
    };

    const handleProceedToLogin = () => {
        if (userType === "scholar") {
            window.location.href = "/login/scholar";
        } else if (userType === "staff") {
            window.location.href = "/login/staff";
        }
    };

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

    const images = [img, img1, img3];

    return (
        <div className="hero flex items-center justify-center min-h-screen">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-bg ${index === currentIndex ? "visible" : "hidden"}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <div className="bg-white px-6 py-10 rounded-md shadow-lg absolute top-[70%] left-[50%] translate-x-[-50%] translate-y-[-100%] z-20 w-[90%] sm:max-w-[400px] border border-gray-200">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-gray-500/90 text-sm">
                        Set a new password for your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form className="space-y-4">
                    {isResetSuccessful ? (
                        <p className="mt-4 p-4 text-green-700 text-justify bg-green-100 border border-green-300 rounded-md text-xs">
                            Your password has been reset successfully. You can
                            now log in with your new password.
                        </p>
                    ) : (
                        <>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-1 text-xs font-medium text-gray-700"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            isShowPassword.new_password
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        className="w-full p-3 outline-none border border-gray-300 text-[13px] text-gray-700 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                                    />
                                    <span
                                        onClick={() =>
                                            setIsShowPassword((prevState) => ({
                                                ...prevState,
                                                new_password:
                                                    !prevState.new_password,
                                            }))
                                        }
                                        className="p-1 rounded-full cursor-pointer absolute top-[50%] right-2 translate-y-[-50%] hover:bg-gray-100"
                                    >
                                        {isShowPassword.new_password ? (
                                            <EyeIcon className="w-4 h-4  text-gray-700" />
                                        ) : (
                                            <EyeOff className="w-4 h-4  text-gray-700" />
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm_password"
                                    className="block mb-1 text-xs font-medium text-gray-700"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm_password"
                                        type={
                                            isShowPassword.confirm_password
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                        className="w-full p-3 outline-none border border-gray-300 text-[13px] text-gray-700 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-200"
                                    />
                                    <span
                                        onClick={() =>
                                            setIsShowPassword((prevState) => ({
                                                ...prevState,
                                                confirm_password:
                                                    !prevState.confirm_password,
                                            }))
                                        }
                                        className="p-1 rounded-full cursor-pointer absolute top-[50%] right-2 translate-y-[-50%] hover:bg-gray-100"
                                    >
                                        {isShowPassword.confirm_password ? (
                                            <EyeIcon className="w-4 h-4  text-gray-700" />
                                        ) : (
                                            <EyeOff className="w-4 h-4  text-gray-700" />
                                        )}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className="w-full p-3 text-white text-xs rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        Processing...
                                    </span>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </>
                    )}
                </form>

                {isResetSuccessful && (
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-600">
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800  hover:underline font-medium"
                                onClick={handleProceedToLogin}
                            >
                                <ArrowLeft className={`inline w-4 h-4 mr-1`} />
                                Proceed to Login
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordForm;
