import { Camera, Info, Pen, PenLine, Settings, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";
import { useStaffAccountInformation } from "../hooks/useStaffAccountInformation";
import { useEffect, useState } from "react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import { useStaffAccounts } from "../hooks/useStaffAccounts";

const StaffAccount = ({
    staffId,
    staffInfoFromTable,
    isModal = false,
    data,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenProfileUpload, setIsOpenProfileUpload] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
    const { user } = useAuth();
    const userId = user.user_id;
    const { staffInfo: staff, fetchStaffInfo } = useStaffAccountInformation();
    const { loading: isLoading, editStaff } = useStaffAccounts();
    const profile =
        user.type === "staff" ? user.profile : staffInfoFromTable[1]?.profile;
    const staffInfo =
        user.type === "staff" ? staff.basic_information : staffInfoFromTable[0];
    const info = "block md:hidden";
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFirstName(staffInfo?.first_name);
        setLastName(staffInfo?.last_name);
        setMiddleName(staffInfo?.middle_name);
        setAge(staffInfo?.age);
        setGender(staffInfo?.gender);
        setAddress(staffInfo?.address);
        setSuffix(staffInfo?.suffix);
        setContactNumber(staffInfo?.contact_number);
        setEmail(staffInfo?.email_address);
        setFacebook(staffInfo?.facebook);
    }, [staffInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const success = await editStaff(
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
            );

            if (success) {
                setIsEditing(false);
                fetchStaffInfo();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const handleSendTempPassword = async (userId, email) => {
        try {
            setLoading(true);

            const data = new URLSearchParams();
            data.append("account_id", userId);
            data.append("email", email);

            const response = await axios.post(
                `${BASE_URL}app/api/password-reset.php?action=reset_password`,
                data,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            if (response.data.success) {
                toast.success("Password changed successfully!");
                // setError("");

                setIsModalOpen(false);
            } else {
                // setError(response.data.message || "Failed to reset password");
                // toast.error(error);
                toast.error("Error: " + response.data.message);
                console.log("Error: " + response.data.message);
                setIsModalOpen(false);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error sending reset link:", err);
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50">
            <div
                className={`${
                    isModal
                        ? "md:w-[100%] lg:w-[100%] xl:w-[100%] md:py-0"
                        : "md:w-[90%] lg:w-[85%] xl:w-[80%] md:py-8"
                } w-[100%] mx-auto`}
            >
                <div
                    className={`bg-white ${
                        isModal
                            ? "md:rounded-none"
                            : "md:rounded-xl overflow-hidden"
                    } border border-gray-100 shadow-sm`}
                >
                    {/* Header Section */}
                    <div className={`relative`}>
                        <div
                            className={`${
                                isModal ? "p-0" : ""
                            } bg-white px-6 md:px-8 py-6 border-b border-gray-200`}
                        >
                            {!isModal && (
                                <h2 className="text-base text-gray-900 font-semibold mb-6">
                                    My Profile
                                </h2>
                            )}

                            <div className="flex items-center gap-5">
                                {profile ? (
                                    <div className="relative">
                                        <img
                                            src={profile}
                                            alt="Profile"
                                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                                        />
                                        {user.type === "staff" && (
                                            <button
                                                onClick={() => {
                                                    setIsOpenProfileUpload(
                                                        true,
                                                    );
                                                }}
                                                className="absolute bottom-0 right-0 p-1 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                <Camera className="w-4 h-4 text-gray-800" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 mr-1 rounded-full text-white text-3xl bg-black flex justify-center items-center">
                                        {staffInfo?.first_name}{" "}
                                        {staffInfo?.last_name}
                                        {!isModal && (
                                            <button
                                            onClick={() => {
                                                setIsOpenProfileUpload(true);
                                            }}
                                            className="absolute bottom-0 right-0 p-1 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <Camera className="w-4 h-4 text-gray-800" />
                                        </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                                        {staffInfo?.first_name || ""}{" "}
                                        {staffInfo?.last_name || ""}
                                    </h2>
                                    <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                                        Staff ID:{" "}
                                        {staffInfo?.account_id
                                            ? staffInfo.account_id
                                            : userId}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-6 md:p-8">
                        {/* Profile Information */}
                        <section className="mb-10">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 ">
                                    <Info className="w-4 h-4 text-gray-600" />
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Basic Information
                                    </h3>
                                </div>
                                <div>
                                    {user.type === "staff" && (
                                        <>
                                            {!isEditing ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                >
                                                    <PenLine className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                >
                                                    <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {!isEditing ? (
                                <div className="grid md:grid-cols-2 gap-x-12">
                                    <div className="space-y-4">
                                        <InfoField
                                            label="Full Name"
                                            value={
                                                staffInfo?.first_name ||
                                                "" +
                                                    " " +
                                                    staffInfo?.last_name ||
                                                ""
                                            }
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Contact Number"
                                            value={
                                                staffInfo?.contact_number || ""
                                            }
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Age"
                                            value={staffInfo?.age || ""}
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Gender"
                                            value={
                                                staffInfo?.gender
                                                    .charAt(0)
                                                    .toUpperCase()
                                                    .concat(
                                                        staffInfo?.gender.substring(
                                                            1,
                                                            staffInfo?.gender
                                                                .length,
                                                        ),
                                                    ) || ""
                                            }
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Address"
                                            value={staffInfo?.address || ""}
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Email Address"
                                            value={
                                                staffInfo?.email_address || ""
                                            }
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Facebook"
                                            value={staffInfo?.facebook || ""}
                                            mobileClass={info}
                                        />
                                    </div>

                                    <div className="hidden md:block space-y-4">
                                        <ValueField
                                            value={`
                                            ${staffInfo?.first_name || ""} 
                                                ${staffInfo?.last_name || ""}
                                        `}
                                        />
                                        <ValueField
                                            value={
                                                staffInfo?.contact_number || ""
                                            }
                                        />
                                        <ValueField
                                            value={staffInfo?.age || ""}
                                        />
                                        <ValueField
                                            value={
                                                staffInfo?.gender
                                                    .charAt(0)
                                                    .toUpperCase()
                                                    .concat(
                                                        staffInfo?.gender.substring(
                                                            1,
                                                            staffInfo?.gender
                                                                .length,
                                                        ),
                                                    ) || ""
                                            }
                                        />
                                        <ValueField
                                            value={staffInfo?.address || ""}
                                        />
                                        <ValueField
                                            value={
                                                staffInfo?.email_address || ""
                                            }
                                        />
                                        <ValueField
                                            value={staffInfo?.facebook || ""}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="w-full grid grid-cols-2 gap-6"
                                >
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            placeholder="First Name"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            value={middleName}
                                            onChange={(e) =>
                                                setMiddleName(e.target.value)
                                            }
                                            placeholder="Middle Name"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            placeholder="Last Name"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block w-full relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Suffix
                                        </label>
                                        <select
                                            name="suffix"
                                            value={suffix} // <-- controlled value
                                            onChange={(e) =>
                                                setSuffix(e.target.value)
                                            } // <-- change handler
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
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            value={contactNumber}
                                            onChange={(e) =>
                                                setContactNumber(e.target.value)
                                            }
                                            placeholder="Contact Number"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Age
                                        </label>
                                        <input
                                            type="text"
                                            value={age}
                                            onChange={(e) => {
                                                const value = numbersOnly(
                                                    e.target.value,
                                                );
                                                setAge(value);
                                            }}
                                            placeholder="Age"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block w-full relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={gender} // <-- controlled value
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            } // <-- change handler
                                            className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        >
                                            <option value="" disabled>
                                                -- Select --
                                            </option>
                                            {/* <option value="pending">Pending</option> */}
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                        </select>
                                    </div>
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="Address"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Email Address
                                        </label>
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email Address"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="block relative">
                                        <label className="block mb-1 text-gray-600 text-xs">
                                            Facebook
                                        </label>
                                        <input
                                            type="text"
                                            value={facebook}
                                            onChange={(e) =>
                                                setFacebook(e.target.value)
                                            }
                                            placeholder="Facebook"
                                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="inline-flex items-center justify-center text-sm px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        {isLoading ? "Updating..." : "Update"}
                                    </button>
                                </form>
                            )}
                        </section>

                        {/* Account Settings */}
                        {!isModal && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Settings className="w-4 h-4 text-gray-600" />
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Account Settings
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-x-12">
                                    <div className="space-y-4">
                                        <InfoField
                                            label="Email"
                                            value={staffInfo?.email_address}
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Password"
                                            value="••••••••"
                                            mobileClass={info}
                                        />
                                    </div>

                                    <div className="hidden md:block space-y-4">
                                        <ValueField
                                            value={staffInfo?.email_address}
                                        />
                                        <ValueField value="••••••••" />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            Password
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            Must be at least 8 characters long.
                                        </p>
                                    </div>
                                    <ChangePasswordForm />
                                </div>
                            </section>
                        )}

                        {/* <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Settings className="w-4 h-4 text-gray-600" />
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Permissions
                                </h3>
                            </div>
                            <div className="mb-6 space-y-2">
                                <label className="text-xs text-gray-700 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        className="accent-green-600"
                                    />
                                    Create
                                </label>
                                <label className="text-xs text-gray-700 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        className="accent-green-600"
                                    />
                                    Edit
                                </label>
                                <label className="text-xs text-gray-700 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        className="accent-green-600"
                                    />
                                    Delete
                                </label>
                                <label className="text-xs text-gray-700 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        className="accent-green-600"
                                    />
                                    Edit Profile
                                </label>
                            </div>
                            <button
                                // onClick={() => {
                                //     setIsModalOpen(true);
                                //     data.onOpenConfirmationModal(
                                //         staffInfoFromTable[2],
                                //         null,
                                //         "reset_password",
                                //     );
                                // }}
                                type="button"
                                className="mb-6 inline-flex justify-center items-center text-center text-sm px-7 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Save
                            </button>
                        </section> */}

                        {isModal && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Settings className="w-4 h-4 text-gray-600" />
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Account Settings
                                    </h3>
                                </div>

                                <div className="w-[max-content] flex flex-row gap-3">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            data.onOpenConfirmationModal(
                                                staffInfoFromTable[2],
                                                null,
                                                "reset_password",
                                            );
                                        }}
                                        type="button"
                                        className="inline-flex justify-center items-center text-center text-sm px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        Reset Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            data.onOpenConfirmationModal(
                                                staffInfoFromTable[2],
                                                staffInfo?.status,
                                                staffInfo?.status === "active"
                                                    ? "deactivate"
                                                    : "activate",
                                            );
                                        }}
                                        type="button"
                                        className={`inline-flex items-center text-sm px-6 py-3 ${staffInfo?.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}  text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5`}
                                    >
                                        {staffInfo?.status === "active"
                                            ? "Deactivate"
                                            : "Activate"}{" "}
                                        Account
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>

                    <ProfilePhotoUpload
                        isOpen={isOpenProfileUpload}
                        onOpenModal={setIsOpenProfileUpload}
                        // onRefresh={fetchProfilePicture}
                    />
                </div>
            </div>

            {isModalOpen && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
                    isLoading={loading}
                    label={"Confirmation"}
                    action={data.action}
                    message={
                        data.action === "activate"
                            ? data.message1
                            : data.action === "reset_password"
                              ? data.message3
                              : data.message2
                    }
                    onClick={() => {
                        if (data.action === "reset_password") {
                            handleSendTempPassword(
                                staffInfoFromTable[2],
                                staffInfo?.email,
                            );
                        } else {
                            data.onChangeAccountStatus(
                                staffInfoFromTable[2],
                                staffInfo?.status,
                                data.action,
                            );
                        }
                    }}
                />
            )}
        </div>
    );
};

// Helper Components
const InfoField = ({ label, value, mobileClass }) => (
    <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1.5">
            {label}
        </p>
        <p className={`${mobileClass} text-gray-800 text-sm`}>{value}</p>
    </div>
);

const ValueField = ({ value, badge }) => (
    <div className={`flex items-center`}>
        {badge === "green" ? (
            <span className="inline-flex items-center bg-green-50 text-green-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : badge === "red" ? (
            <span className="inline-flex items-center bg-red-50 text-red-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : badge === "yellow" ? (
            <span className="inline-flex items-center bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : (
            <p className="text-gray-800 text-sm">{value}</p>
        )}
    </div>
);

export default StaffAccount;
