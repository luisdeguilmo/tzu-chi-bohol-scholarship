import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";
import { numbersOnly } from "../../../utils/inputValidations";

const FormModal = ({ isOpen, onClose, onSuccess }) => {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [suffix, setSuffix] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [facebook, setFacebook] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { loading, addStaff } = useStaffAccounts();

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Password doesn't match");
            return;
        }

        try {
            const success = await addStaff(
                firstName,
                middleName,
                lastName,
                contactNumber,
                suffix,
                age,
                gender,
                address,
                facebook,
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
        setMiddleName("");
        setLastName("");
        setSuffix("");
        setContactNumber("");
        setAge("");
        setAddress("");
        setFacebook("");
        setGender("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleCancel = () => {
        resetFields();
        onClose(false);
    };

    return (
        <InputModal
            label={"New Staff Account"}
            isOpen={isOpen}
            onClose={onClose}
            buttonLabel={"Confirm"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={loading}
        >
            <div
                // onSubmit={(e) => {
                //     e.preventDefault();
                //     handleSubmit();
                // }}
                className="p-6 space-y-4 h-[500px]"
            >
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Middle Name
                    </label>
                    <input
                        type="text"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        placeholder="Enter your middle name"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                        placeholder="Enter your last name"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mt-2 block w-full relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Suffix
                    </label>
                    <select
                        name="suffix"
                        value={suffix} // <-- controlled value
                        onChange={(e) => setSuffix(e.target.value)} // <-- change handler
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    >
                        <option value="" disabled>
                            -- Select --
                        </option>
                        {/* <option value="pending">Pending</option> */}
                        <option value="None">None</option>
                        <option value="Jr.">Jr</option>
                        <option value="Sr.">Sr</option>
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                    </select>
                </div>
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter your contact number"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Age
                    </label>
                    <input
                        type="text"
                        value={age}
                        onChange={(e) => {
                            const value = numbersOnly(e.target.value);
                            setAge(value);
                        }}
                        placeholder="Enter your age"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mt-2 block w-full relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={gender} // <-- controlled value
                        onChange={(e) => setGender(e.target.value)} // <-- change handler
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    >
                        <option value="" disabled>
                            -- Select --
                        </option>
                        {/* <option value="pending">Pending</option> */}
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Address
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="block mb-2 relative">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Facebook
                    </label>
                    <input
                        type="text"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="Enter your facebook"
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                        className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="h-4"></div>
            </div>
        </InputModal>
    );
};

export default FormModal;
