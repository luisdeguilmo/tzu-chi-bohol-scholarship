import {
    GraduationCap,
    House,
    Info,
    Settings,
    Bus,
    PenLine,
    X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";
import { useScholarAccountInformation } from "../hooks/useScholarAccountInformation";
import { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import BASE_URL from "../config";
import { toast } from "react-toastify";

const UserAccount = ({
    scholarId = false,
    scholarInfoFromTable,
    isModal = false,
    data,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();
    const userId = user.user_id;
    const { scholarInfo: scholar } = useScholarAccountInformation();
    const profile =
        user.type === "scholar"
            ? user.profile
            : scholarInfoFromTable[1].profile;
    const scholarInfo =
        user.type === "scholar" ? scholar : scholarInfoFromTable[0];

    const info = "block md:hidden";

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
        <div className="min-h-screen bg-gray-50">
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
                                    My Account
                                </h2>
                            )}

                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <img
                                        src={profile}
                                        alt="Profile"
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                                        {scholarInfo?.basic_information
                                            ?.first_name || ""}{" "}
                                        {scholarInfo?.basic_information
                                            ?.last_name || ""}
                                    </h2>
                                    <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                                        Scholar ID:{" "}
                                        {user.type === "scholar"
                                            ? userId
                                            : scholarInfoFromTable[2]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-6 md:p-8">
                        {/* Profile Information */}
                        <section className="mb-10">
                            <div className="flex items-center gap-2 mb-6">
                                <Info className="w-4 h-4 text-gray-600" />
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Basic Information
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12">
                                <div className="space-y-4">
                                    <InfoField
                                        label="Full Name"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.first_name ||
                                            "" +
                                                " " +
                                                scholarInfo?.basic_information
                                                    ?.last_name ||
                                            ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Contact Number"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.contact_number || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Age"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.age || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Gender"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.gender || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Address"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.home_address || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Email Address"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.email || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Facebook Link"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.facebook || ""
                                        }
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField
                                        value={`
                                            ${
                                                scholarInfo?.basic_information
                                                    ?.first_name || ""
                                            }
                                                ${
                                                    scholarInfo
                                                        ?.basic_information
                                                        ?.last_name || ""
                                                }
                                        `}
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.contact_number || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.age || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.gender || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.home_address || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.email || ""
                                        }
                                    />
                                    <ValueField
                                        isUrl={true}
                                        value={
                                            scholarInfo?.basic_information
                                                ?.facebook || ""
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Scholarship Details */}
                        <section className="mb-10">
                            <div className="flex items-center gap-2 mb-6">
                                <GraduationCap className="w-4 h-4 text-gray-600" />
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Scholarship Details
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12">
                                <div className="space-y-4">
                                    <InfoField
                                        label="Academic Year"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.school_year || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Status"
                                        value={
                                            scholarInfo?.scholar_status ===
                                            "active"
                                                ? "Active"
                                                : scholarInfo?.scholar_status ===
                                                    "graduated"
                                                  ? "Graduated"
                                                  : scholarInfo?.scholar_status ===
                                                      "terminated"
                                                    ? "Terminated"
                                                    : "Not Renewed"
                                        }
                                        mobileClass={info}
                                    />
                                    {(scholarInfo?.scholar_status ===
                                        "graduated" ||
                                        scholarInfo?.scholar_status ===
                                            "terminated") && (
                                        <InfoField
                                            label={
                                                scholarInfo?.scholar_status ===
                                                "graduated"
                                                    ? "Special Award"
                                                    : "Reason"
                                            }
                                            value={scholarInfo?.award_or_reason}
                                            mobileClass={info}
                                        />
                                    )}
                                    <InfoField
                                        label="Rendered Hours"
                                        value={
                                            scholarInfo?.rendered_hours || "0"
                                        }
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.school_year || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.scholar_status ===
                                            "active"
                                                ? "Active"
                                                : scholarInfo?.scholar_status ===
                                                    "graduated"
                                                  ? "Graduated"
                                                  : scholarInfo?.scholar_status ===
                                                      "terminated"
                                                    ? "Terminated"
                                                    : "Not Renewed"
                                        }
                                        badge={
                                            scholarInfo?.scholar_status ===
                                            "active"
                                                ? "green"
                                                : scholarInfo?.scholar_status ===
                                                    "graduated"
                                                  ? "blue"
                                                  : scholarInfo?.scholar_status ===
                                                      "terminated"
                                                    ? "red"
                                                    : "orange"
                                        }
                                    />
                                    {(scholarInfo?.scholar_status ===
                                        "graduated" ||
                                        scholarInfo?.scholar_status ===
                                            "terminated") && (
                                        <ValueField
                                            value={scholarInfo?.award_or_reason}
                                        />
                                    )}
                                    <ValueField
                                        value={
                                            scholarInfo?.rendered_hours || "0"
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Academic Information */}
                        <section className="mb-10">
                            <div className="flex items-center gap-2 mb-6">
                                <House className="w-4 h-4 text-gray-600" />
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Academic Information
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12">
                                <div className="space-y-4">
                                    <InfoField
                                        label="School"
                                        value={
                                            scholarInfo?.academic_information
                                                ?.present_school || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Course"
                                        value={
                                            scholarInfo?.academic_information
                                                ?.present_course1 || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Year Level"
                                        value={
                                            scholarInfo?.academic_information
                                                ?.year_level === 1
                                                ? "1st Year"
                                                : scholarInfo
                                                        ?.academic_information
                                                        ?.year_level === 2
                                                  ? "2nd Year"
                                                  : scholarInfo
                                                          ?.academic_information
                                                          ?.year_level === 3
                                                    ? "3rd Year"
                                                    : scholarInfo
                                                            ?.academic_information
                                                            ?.year_level === 4
                                                      ? "4th Year"
                                                      : "--"
                                        }
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField
                                        value={
                                            scholarInfo?.academic_information
                                                ?.present_school || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.academic_information
                                                ?.present_course1 || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.academic_information
                                                ?.year_level === 1
                                                ? "1st Year"
                                                : scholarInfo
                                                        ?.academic_information
                                                        ?.year_level === 2
                                                  ? "2nd Year"
                                                  : scholarInfo
                                                          ?.academic_information
                                                          ?.year_level === 3
                                                    ? "3rd Year"
                                                    : scholarInfo
                                                            ?.academic_information
                                                            ?.year_level === 4
                                                      ? "4th Year"
                                                      : "--"
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Transport Details */}
                        <section className="mb-10">
                            <div className="flex items-center gap-2 mb-6">
                                <Bus className="w-4 h-4 text-gray-600" />
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Living and Transport Details
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12">
                                <div className="space-y-4">
                                    <InfoField
                                        label="Stay Type"
                                        value={
                                            scholarInfo?.transport_details
                                                ?.stay_type || "N/A"
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Address"
                                        value={
                                            scholarInfo?.transport_details
                                                ?.address || "N/A"
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Daily Transport Cost"
                                        value={
                                            scholarInfo?.transport_details
                                                ?.daily_transport_cost
                                                ? `₱ ${Number(scholarInfo.transport_details.daily_transport_cost).toFixed(2)}`
                                                : "N/A"
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Travel Route & Cost"
                                        value={
                                            scholarInfo?.transport_details
                                                ?.route_explanation || "N/A"
                                        }
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField
                                        value={
                                            scholarInfo?.transport_details
                                                ?.stay_type || "--"
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.transport_details
                                                ?.address || "--"
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.transport_details
                                                ?.daily_transport_cost
                                                ? `₱ ${Number(scholarInfo.transport_details.daily_transport_cost).toFixed(2)}`
                                                : "--"
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.transport_details
                                                ?.route_explanation || "--"
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Account Settings */}

                        {user.type === "admin" && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Settings className="w-4 h-4 text-gray-600" />
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Account Settings
                                    </h3>
                                </div>

                                {!isModal && (
                                    <>
                                        {" "}
                                        <div className="grid md:grid-cols-2 gap-x-12">
                                            <div className="space-y-4">
                                                <InfoField
                                                    label="Email"
                                                    value={
                                                        scholarInfo
                                                            ?.basic_information
                                                            ?.email
                                                    }
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
                                                    value={
                                                        scholarInfo
                                                            ?.basic_information
                                                            ?.email
                                                    }
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
                                                    Must be at least 8
                                                    characters long.
                                                </p>
                                            </div>
                                            <ChangePasswordForm />
                                        </div>
                                    </>
                                )}

                                {isModal && (
                                    <div className="w-[max-content] flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                data.onOpenConfirmationModal(
                                                    scholarInfoFromTable[2],
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
                                                    scholarInfoFromTable[2],
                                                    scholarInfo?.scholar_status,
                                                    scholarInfo?.scholar_status ===
                                                        "active"
                                                        ? "deactivate"
                                                        : "activate",
                                                );
                                            }}
                                            type="button"
                                            className={`inline-flex items-center text-sm px-6 py-3 ${scholarInfo?.scholar_status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}  text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5`}
                                        >
                                            {scholarInfo?.scholar_status ===
                                            "active"
                                                ? "Deactivate"
                                                : "Activate"}{" "}
                                            Account
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
                    isLoading={loading}
                    label={"Confirmation"}
                    action={data?.action}
                    message={
                        data.action === "activate"
                            ? data.message1
                            : data.action === "reset_password"
                              ? data.message3
                              : data.message2
                    }
                    // onClick={() =>
                    //     data.onChangeAccountStatus(
                    //         scholarInfoFromTable[2],
                    //         scholarInfo?.scholar_status,
                    //         data.action,
                    //     )
                    // }
                    onClick={() => {
                        if (data.action === "reset_password") {
                            handleSendTempPassword(
                                scholarInfoFromTable[2],
                                scholarInfo?.basic_information?.email,
                            );
                        } else {
                            data.onChangeAccountStatus(
                                scholarInfoFromTable[2],
                                scholarInfo?.scholar_status,
                                data.action,
                            );
                        }
                    }}
                    isScholarAccount={true}
                    deactivationReason={data.deactivationReason}
                    deactivationType={data.deactivationType}
                    setDeactivationReason={data.setDeactivationReason}
                    setDeactivationType={data.setDeactivationType}
                />
            )}
        </div>
    );
};

// Helper Components
const InfoField = ({ label, value, mobileClass, isEditing, setIsEditing }) => (
    <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1.5">
            {label}
        </p>
        {label === "Facebook Link" ? (
            <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className={`${mobileClass} text-blue-600 hover:text-blue-800 text-sm`}
            >
                {value}
            </a>
        ) : (
            <p className={`${mobileClass} text-gray-800 text-sm`}>{value}</p>
        )}
    </div>
);

const ValueField = ({ isUrl = false, value, badge }) => (
    <div className={`flex items-center`}>
        {isUrl ? (
            <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-blue-600 hover:text-blue-800 text-sm`}
            >
                {value}
            </a>
        ) : badge === "green" ? (
            <span className="inline-flex items-center bg-green-50 text-green-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : badge === "blue" ? (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : badge === "red" ? (
            <span className="inline-flex items-center bg-red-50 text-red-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : badge === "orange" ? (
            <span className="inline-flex items-center bg-orange-50 text-orange-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : (
            <p className="text-gray-800 text-sm">{value}</p>
        )}
    </div>
);

export default UserAccount;
