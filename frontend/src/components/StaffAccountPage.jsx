import { Camera, Info, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfilePicture } from "../utils/getProfilePicture";
import ChangePasswordForm from "./ChangePasswordForm";
import { useStaffAccountInformation } from "../hooks/useStaffAccountInformation";
import { useState } from "react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

const StaffAccount = ({ staffId = false, isModal = false }) => {
    const [isOpenProfileUpload, setIsOpenProfileUpload] = useState(false);
    const { user } = useAuth();
    const userId = user.user_id;
    const { imageUrl, fetchProfilePicture } = getProfilePicture(
        staffId ? staffId : userId,
        "user-profile-picture"
    );
    const { staffInfo } = useStaffAccountInformation(
        staffId ? staffId : userId
    );
    const info = "block md:hidden";

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
                                {imageUrl ? (
                                    <div className="relative">
                                        <img
                                            src={imageUrl}
                                            alt="Profile"
                                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                                        />
                                        {user.type === "staff" && (
                                            <button
                                                onClick={() => {
                                                    setIsOpenProfileUpload(
                                                        true
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
                                        {
                                            staffInfo?.basic_information
                                                ?.first_name[0]
                                        }{" "}
                                        {
                                            staffInfo?.basic_information
                                                ?.last_name[0]
                                        }
                                        <button
                                            onClick={() => {
                                                setIsOpenProfileUpload(true);
                                            }}
                                            className="absolute bottom-0 right-0 p-1 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <Camera className="w-4 h-4 text-gray-800" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                                        {staffInfo?.basic_information
                                            ?.first_name || ""}{" "}
                                        {staffInfo?.basic_information
                                            ?.last_name || ""}
                                    </h2>
                                    <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                                        Staff ID: {staffId ? staffId : userId}
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
                                            staffInfo?.basic_information
                                                ?.first_name ||
                                            "" +
                                                " " +
                                                staffInfo?.basic_information
                                                    ?.last_name ||
                                            ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Contact Number"
                                        value={
                                            staffInfo?.basic_information
                                                ?.contact_number || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Age"
                                        value={
                                            staffInfo?.basic_information?.age ||
                                            ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Gender"
                                        value={
                                            staffInfo?.basic_information
                                                ?.gender || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Address"
                                        value={
                                            staffInfo?.basic_information
                                                ?.address || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Email Address"
                                        value={
                                            staffInfo?.basic_information
                                                ?.email_address || ""
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Facebook"
                                        value={
                                            staffInfo?.basic_information
                                                ?.facebook || ""
                                        }
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField
                                        value={`
                                            ${
                                                staffInfo?.basic_information
                                                    ?.first_name || ""
                                            } 
                                                ${
                                                    staffInfo?.basic_information
                                                        ?.last_name || ""
                                                }
                                        `}
                                    />
                                    <ValueField
                                        value={
                                            staffInfo?.basic_information
                                                ?.contact_number || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            staffInfo?.basic_information?.age ||
                                            ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            staffInfo?.basic_information
                                                ?.gender || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            staffInfo?.basic_information
                                                ?.address || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            staffInfo?.basic_information
                                                ?.email_address || ""
                                        }
                                    />
                                    <ValueField
                                        value={
                                            staffInfo?.basic_information
                                                ?.facebook || ""
                                        }
                                    />
                                </div>
                            </div>
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
                                            value={
                                                staffInfo?.basic_information
                                                    ?.email_address
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
                                                staffInfo?.basic_information
                                                    ?.email_address
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
                                            Must be at least 8 characters long.
                                        </p>
                                    </div>
                                    <ChangePasswordForm userId={user.user_id} />
                                </div>
                            </section>
                        )}
                    </div>

                    <ProfilePhotoUpload
                        userId={user.user_id}
                        isOpen={isOpenProfileUpload}
                        onOpenModal={setIsOpenProfileUpload}
                        onRefresh={fetchProfilePicture}
                    />
                </div>
            </div>
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
