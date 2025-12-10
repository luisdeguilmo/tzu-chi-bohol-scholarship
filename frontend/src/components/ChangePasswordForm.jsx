import axios from "axios";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

const ChangePasswordForm = ({ userId }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isPasswordShowed, setIsPasswordShowed] = useState({
        current_password: false,
        new_password: false,
        confirm_password: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = new URLSearchParams();
            data.append("account_id", userId);
            data.append("current_password", currentPassword);
            data.append("new_password", newPassword);
            data.append("confirm_password", confirmNewPassword);

            const response = await axios.post(
                `${BASE_URL}app/views/password-reset.php?action=change_password`,
                data,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Password changed successfully!");
                setError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                setError(response.data.message || "Failed to reset password");
                toast.error(error);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error sending reset link:", err);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Start Date Input */}
            <div className="block mb-2 relative">
                <label className="block mb-1 text-gray-600 text-xs">
                    Current Password
                </label>
                <div className="w-full sm:w-[50%] lg:w-[40%] relative">
                    <input
                        type={
                            isPasswordShowed.current_password
                                ? "text"
                                : "password"
                        }
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                        // disabled={disabled}
                    />
                    <span
                        onClick={() =>
                            setIsPasswordShowed((prevState) => ({
                                ...prevState,
                                current_password: !prevState.current_password,
                            }))
                        }
                        className="p-1 rounded-full cursor-pointer absolute top-[50%] right-2 translate-y-[-50%] hover:bg-gray-100"
                    >
                        {isPasswordShowed.current_password ? (
                            <EyeIcon className="w-4 h-4  text-gray-600" />
                        ) : (
                            <EyeClosed className="w-4 h-4  text-gray-600" />
                        )}
                    </span>
                </div>
            </div>

            <div className="flex-1 block mb relative">
                <label className="block mb-1 text-gray-600 text-xs">
                    New Password
                </label>
                <div className="w-full sm:w-[50%] lg:w-[40%] relative">
                    <input
                        type={
                            isPasswordShowed.new_password ? "text" : "password"
                        }
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                        // disabled={disabled}
                    />
                    <span
                        onClick={() =>
                            setIsPasswordShowed((prevState) => ({
                                ...prevState,
                                new_password: !prevState.new_password,
                            }))
                        }
                        className="p-1 rounded-full cursor-pointer absolute top-[50%] right-2 translate-y-[-50%] hover:bg-gray-100"
                    >
                        {isPasswordShowed.new_password ? (
                            <EyeIcon className="w-4 h-4  text-gray-600" />
                        ) : (
                            <EyeClosed className="w-4 h-4  text-gray-600" />
                        )}
                    </span>
                </div>
            </div>

            <div className="flex-1 block mb relative">
                <label className="block mb-1 text-gray-600 text-xs">
                    Confirm New Password
                </label>
                <div className="w-full sm:w-[50%] lg:w-[40%] relative">
                    <input
                        type={
                            isPasswordShowed.confirm_password
                                ? "text"
                                : "password"
                        }
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                        // disabled={disabled}
                    />
                    <span
                        onClick={() =>
                            setIsPasswordShowed((prevState) => ({
                                ...prevState,
                                confirm_password: !prevState.confirm_password,
                            }))
                        }
                        className="p-1 rounded-full cursor-pointer absolute top-[50%] right-2 translate-y-[-50%] hover:bg-gray-100"
                    >
                        {isPasswordShowed.confirm_password ? (
                            <EyeIcon className="w-4 h-4  text-gray-600" />
                        ) : (
                            <EyeClosed className="w-4 h-4  text-gray-600" />
                        )}
                    </span>
                </div>
            </div>

            <button
                type="submit"
                className="inline-flex items-center text-sm px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
                {loading ? "Processing..." : "Change Password"}
            </button>
        </form>
    );
};

export default ChangePasswordForm;