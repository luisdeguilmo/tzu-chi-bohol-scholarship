import { Camera, Info, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfilePicture } from "../utils/getProfilePicture";
import ChangePasswordForm from "./ChangePasswordForm";
import { useEffect, useState } from "react";
import { useAdminAccountInformation } from "../hooks/useAdminAccountInformation";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

const AdminAccount = ({ adminId = false, isModal = false }) => {
    const [isOpenProfileUpload, setIsOpenProfileUpload] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const { user } = useAuth();
    const userId = user.user_id;
    const { imageUrl, fetchProfilePicture } = getProfilePicture(
        userId,
        "user-profile-picture"
    );
    const { adminInfo, updateAdminInfo, fetchAdminInfo } =
        useAdminAccountInformation(userId);
    const info = "block md:hidden";

    useEffect(() => {
        setName(adminInfo?.basic_information?.name || "");
        setEmail(adminInfo?.basic_information?.email || "");
    }, [adminInfo]);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        const success = await updateAdminInfo(userId, name, email);

        if (success) {
            fetchAdminInfo();
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
                                        <button
                                            onClick={() => {
                                                setIsOpenProfileUpload(true);
                                            }}
                                            className="absolute bottom-0 right-0 p-1 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <Camera className="w-4 h-4 text-gray-800" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 mr-1 rounded-full text-white text-3xl bg-black flex justify-center items-center">
                                        {adminInfo?.basic_information
                                            ?.name[0] || "A"}
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
                                        {adminInfo?.basic_information?.name ||
                                            ""}
                                    </h2>
                                    <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                                        ID: {adminId ? adminId : userId}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-6 md:p-8">
                        {/* Profile Information */}
                        <section className="mb-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Personal Information
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Manage your personal information.
                                </p>
                            </div>

                            <form
                                onSubmit={handleUpdateInfo}
                                className="space-y-4"
                            >
                                {/* Start Date Input */}
                                <div className="block mb-2 relative">
                                    <label className="block mb-1 text-gray-600 text-xs">
                                        Name
                                    </label>
                                    <div className="w-full sm:w-[50%] lg:w-[40%] relative">
                                        <input
                                            type={"text"}
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Name"
                                            className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                            // disabled={disabled}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 block mb relative">
                                    <label className="block mb-1 text-gray-600 text-xs">
                                        Email
                                    </label>
                                    <div className="w-full sm:w-[50%] lg:w-[40%] relative">
                                        <input
                                            type={"email"}
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email"
                                            className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                            // disabled={disabled}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex items-center text-sm px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Update
                                </button>
                            </form>
                        </section>

                        {/* Account Settings */}
                        {!isModal && (
                            <section className="">
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
                                                adminInfo?.basic_information
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
                                                adminInfo?.basic_information
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

export default AdminAccount;
