import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";

export default function EmailVerification() {
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        verifyEmail();
    }, []);

    const verifyEmail = async () => {
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }

        try {
            // Simulate API call - replace with your actual API endpoint
            const response = await fetch("/api/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus("success");
                setMessage("Your email has been verified successfully!");
            } else {
                setStatus("error");
                setMessage(
                    data.message ||
                        "Verification failed. The link may be invalid or expired."
                );
            }
        } catch (error) {
            setStatus("error");
            setMessage(
                "Network error. Please check your connection and try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Loading State */}
                    {status === "loading" && (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Mail className="w-16 h-16 text-indigo-600" />
                                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin absolute -top-1 -right-1" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Verifying Your Email
                            </h1>
                            <p className="text-gray-600">
                                Please wait while we verify your email
                                address...
                            </p>
                            <div className="flex justify-center space-x-2 pt-4">
                                <div
                                    className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full animate-ping opacity-20"></div>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Email Verified!
                            </h1>
                            <p className="text-gray-600">{message}</p>
                            <p className="text-sm text-gray-500">
                                You can now access all features of your Tzu Chi
                                Scholarship account.
                            </p>
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() =>
                                        (window.location.href = "/login")
                                    }
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>Go to Login</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => (window.location.href = "/")}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {status === "error" && (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle className="w-12 h-12 text-red-600" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600">{message}</p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-left">
                                <p className="text-red-800 font-semibold mb-2">
                                    Common reasons:
                                </p>
                                <ul className="text-red-700 space-y-1 list-disc list-inside">
                                    <li>
                                        The verification link has expired (24
                                        hours)
                                    </li>
                                    <li>The link has already been used</li>
                                    <li>The link was copied incorrectly</li>
                                </ul>
                            </div>
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            "/resend-verification")
                                    }
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Resend Verification Email
                                </button>
                                <button
                                    onClick={() => (window.location.href = "/")}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Need help? Contact us at</p>
                    <a
                        href="mailto:support@tzuchi.com"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        support@tzuchi.com
                    </a>
                </div>
            </div>
        </div>
    );
}
