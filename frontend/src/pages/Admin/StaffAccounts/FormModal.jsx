import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";

const FormModal = ({ isOpen, onClose, onSuccess }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { addStaff } = useStaffAccounts();

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Password doesn't match");
            return;
        }

        try {
            const success = await addStaff(
                firstName,
                lastName,
                email,
                password,
                confirmPassword
            );

            if (success) {
                await onSuccess();
                onClose(false);
                resetFields();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const resetFields = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <InputModal label={"New Staff Account"} isOpen={isOpen} onClose={onClose}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="p-6 space-y-4"
            >
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Email Address
                    </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Password
                    </label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Confirm Password
                    </label>
                    <input
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter confirm password"
                        className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 text-sm">
                    <button
                        type="button" // Explicitly set type to prevent form submission
                        // onClick={handleCancel}
                        className="w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-green-600 text-white hover:bg-green-700 transition-all`}
                    >
                        Create Staff
                    </button>
                </div>
            </form>
        </InputModal>
    );
};

export default FormModal;
