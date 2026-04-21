import { useState } from "react";
import InputModal from "./InputModal";
import { toast } from "react-toastify";
import { EyeClosed, EyeIcon } from "lucide-react";
import axios from "axios";
import BASE_URL from "../config";

const ChangePasswordModal = ({ isOpen, onClose, userId }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordShowed, setIsPasswordShowed] = useState({
        new_password: false,
        confirm_password: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const data = new URLSearchParams();
            data.append("account_id", userId);
            data.append("new_password", newPassword);
            data.append("confirm_password", confirmPassword);

            const response = await axios.post(
                `${BASE_URL}app/api/password-reset.php?action=reset_password`,
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
                setNewPassword("");
                setConfirmPassword("");
                onClose(false);
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

    const resetFields = () => {
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleCancel = () => {
        resetFields();
        onClose(false);
    };

    return (
        <InputModal
            label={"Reset Password"}
            isOpen={isOpen}
            onClose={onClose}
            resetFields={resetFields}
            buttonLabel={"Confirm"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={loading}
        >
            <div className="p-6 space-y-4">
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Password
                    </label>
                    <div className="w-full relative">
                        <input
                            type={
                                isPasswordShowed.new_password
                                    ? "text"
                                    : "password"
                            }
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
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

                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Confirm Password
                    </label>
                    <div className="w-full relative">
                        <input
                            type={
                                isPasswordShowed.confirm_password
                                    ? "text"
                                    : "password"
                            }
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                        />
                        <span
                            onClick={() =>
                                setIsPasswordShowed((prevState) => ({
                                    ...prevState,
                                    confirm_password:
                                        !prevState.confirm_password,
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
            </div>
        </InputModal>
    );
};

export default ChangePasswordModal;
