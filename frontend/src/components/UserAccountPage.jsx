import { GraduationCap, House, Info, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfilePicture } from "../utils/getProfilePicture";

const UserAccount = ({ scholarId = false, isMaximize = false }) => {
    const { user } = useAuth();
    const userId = user.user_id;
    const { imageUrl } = getProfilePicture(scholarId ? scholarId : userId);

    console.log(user);
    const info = "block md:hidden";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div
                className={`${
                    isMaximize
                        ? "md:w-[100%] lg:w-[100%] xl:w-[100%] md:py-0"
                        : "md:w-[90%] lg:w-[85%] xl:w-[80%] md:py-6"
                } w-[100%] mx-auto`}
            >
                <div
                    className={`bg-white shadow-xl shadow-gray-200/50 ${
                        isMaximize && "md:rounded-none"
                    } md:rounded-2xl overflow-hidden border border-gray-200`}
                >
                    {/* Header Section */}
                    <div className="relative">
                        {/* Profile Section */}

                        <div
                            className={`${
                                isMaximize ? "p-0" : ""
                            } bg-gray-50 px-8 py-6 border border-gray-200`}
                        >
                            {!isMaximize && (
                                <h2 className="text-lg text-slate-600 font-bold mb-4">
                                    My Account
                                </h2>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                    <div className="absolute inset-0 rounded-full ring-2 ring-green-200"></div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                                        Luis Deguilmo
                                    </h2>
                                    <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                        Scholar ID: {userId}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-8 space-y-10">
                        {/* Profile Information */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-500">
                                <div className="bg-green-50 p-2 rounded-lg">
                                    <Info className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg text-gray-800">
                                    Profile Information
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-5 md:space-y-8">
                                    <InfoField
                                        label="Full Name"
                                        value="Luis Fortes Deguilmo"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Email Address"
                                        value="luisdeguilmo@gmail.com"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Contact Number"
                                        value="09269470525"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Age"
                                        value="20"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Gender"
                                        value="Male"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Address"
                                        value="Cogon Sur, Loon, Bohol"
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField value="Luis Fortes Deguilmo" />
                                    <ValueField value="luisdeguilmo@gmail.com" />
                                    <ValueField value="09269470525" />
                                    <ValueField value="20" />
                                    <ValueField value="Male" />
                                    <ValueField value="Cogon Sur, Loon, Bohol" />
                                </div>
                            </div>
                        </section>

                        {/* Scholarship Details */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-500">
                                <div className="bg-green-50 p-2 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg text-gray-800">
                                    Scholarship Details
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-5 md:space-y-8">
                                    <InfoField
                                        label="Academic Year"
                                        value="2025-2026"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Semester"
                                        value="1st Semester"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Status"
                                        value="Active"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Rendered Hours"
                                        value="5 hours"
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField value="2025-2026" />
                                    <ValueField value="1st Semester" />
                                    <ValueField value="Active" badge="green" />
                                    <ValueField value="5 hours" />
                                </div>
                            </div>
                        </section>

                        {/* Academic Information */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-500">
                                <div className="bg-green-50 p-2 rounded-lg">
                                    <House className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg text-gray-800">
                                    Academic Information
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-5 md:space-y-8">
                                    <InfoField
                                        label="School"
                                        value="BISU Balilihan Campus"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Course"
                                        value="Bachelor of Science in Information Technology"
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Year Level"
                                        value="4th Year"
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField value="BISU Balilihan Campus" />
                                    <ValueField value="Bachelor of Science in Information Technology" />
                                    <ValueField value="4th Year" />
                                </div>
                            </div>
                        </section>

                        {/* Account Settings */}
                        {!isMaximize && (
                            <section>
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-500">
                                    <div className="bg-green-50 p-2 rounded-lg">
                                        <Settings className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-lg text-gray-800">
                                        Account Settings
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-5 md:space-y-8">
                                        <InfoField
                                            label="Email"
                                            value="deguilmoluis0@gmail.com"
                                            mobileClass={info}
                                        />
                                        <InfoField
                                            label="Password"
                                            value="*******************"
                                            mobileClass={info}
                                        />
                                    </div>

                                    <div className="hidden md:block space-y-4">
                                        <ValueField value="deguilmoluis0@gmail.com" />
                                        <ValueField value="*******************" />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button className="inline-flex items-center text-sm px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                                        Change Password
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const InfoField = ({ label, value, mobileClass }) => (
    <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
        <p
            className={`${mobileClass} text-gray-600 text-sm bg-gray-50 px-3 py-2 rounded-lg`}
        >
            {value}
        </p>
    </div>
);

const ValueField = ({ value, badge }) => (
    <div className="flex items-center">
        {badge === "green" ? (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {value}
            </span>
        ) : (
            <p className="text-gray-700 text-sm font-medium bg-gray-50 px-3 py-2 rounded-lg">
                {value}
            </p>
        )}
    </div>
);

export default UserAccount;
