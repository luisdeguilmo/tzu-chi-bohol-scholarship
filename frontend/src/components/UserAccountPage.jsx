import {
    EyeClosed,
    EyeIcon,
    GraduationCap,
    House,
    Info,
    Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfilePicture } from "../utils/getProfilePicture";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import ChangePasswordForm from "./ChangePasswordForm";
import { useScholarAccountInformation } from "../hooks/useScholarAccountInformation";
import { getCurrentSchoolYear } from "../utils/getCurrentSchoolYear";

const UserAccount = ({ scholarId = false, isMaximize = false }) => {
    const { user } = useAuth();
    const userId = user.user_id;
    const { imageUrl } = getProfilePicture(scholarId ? scholarId : userId);
    const currentSchoolYear = getCurrentSchoolYear();
    const { scholarInfo, fetchScholarInfo } = useScholarAccountInformation(
        scholarId ? scholarId : userId,
        currentSchoolYear
    );
    const info = "block md:hidden";

    console.log(scholarInfo);

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
                                        {
                                            scholarInfo?.basic_information
                                                ?.first_name
                                        }{" "}
                                        {
                                            scholarInfo?.basic_information
                                                ?.last_name
                                        }
                                    </h2>
                                    <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                        Scholar ID:{" "}
                                        {scholarId ? scholarId : userId}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-8">
                        {/* Profile Information */}
                        <section>
                            <div className="p-1 mb-8 flex items-center gap-1 bg-green-600 text-white rounded-lg">
                                <div className="p-2 rounded-lg">
                                    <Info className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-sm text-white">
                                    Basic Information
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2">
                                <div className="space-y-2 md:space-y-2">
                                    <InfoField
                                        label="Full Name"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.first_name +
                                            " " +
                                            scholarInfo?.basic_information
                                                ?.last_name
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Email Address"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.email
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Contact Number"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.contact_number
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Age"
                                        value={
                                            scholarInfo?.basic_information?.age
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Gender"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.gender
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Address"
                                        value={
                                            scholarInfo?.basic_information
                                                ?.home_address
                                        }
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-2">
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.first_name +
                                            " " +
                                            scholarInfo?.basic_information
                                                ?.last_name
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.email
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.contact_number
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information?.age
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.gender
                                        }
                                    />
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information
                                                ?.home_address
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Scholarship Details */}
                        <section>
                            <div className="p-1 my-8 flex items-center gap-1 bg-green-600 text-white rounded-lg">
                                <div className="p-2 rounded-lg">
                                    <GraduationCap className="w-4 h-4  text-white" />
                                </div>
                                <h3 className="text-sm text-white">
                                    Scholarship Details
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2">
                                <div className="space-y-2 md:space-y-2">
                                    <InfoField
                                        label="Academic Year"
                                        value={currentSchoolYear}
                                        mobileClass={info}
                                    />
                                    {/* <InfoField
                                        label="Semester"
                                        value="1st Semester"
                                        mobileClass={info}
                                    /> */}
                                    <InfoField
                                        label="Status"
                                        value={
                                            scholarInfo?.scholar_status ===
                                            "active"
                                                ? "Active"
                                                : scholarInfo?.scholar_status ===
                                                    "deactivated"
                                                  ? "Deactivated"
                                                  : "Not Renewed"
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Rendered Hours"
                                        value={scholarInfo?.rendered_hours}
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-2">
                                    <ValueField value={currentSchoolYear} />
                                    {/* <ValueField value="1st Semester" /> */}
                                    <ValueField
                                        value={
                                            scholarInfo?.scholar_status ===
                                            "active"
                                                ? "Active"
                                                : scholarInfo?.scholar_status ===
                                                    "deactivated"
                                                  ? "Deactivated"
                                                  : "Not Renewed"
                                        }
                                        badge="green"
                                    />
                                    <ValueField
                                        value={scholarInfo?.rendered_hours}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Academic Information */}
                        <section>
                            <div className="p-1 my-8 flex items-center gap-1 bg-green-600 text-white rounded-lg">
                                <div className="p-2 rounded-lg">
                                    <House className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-sm text-white">
                                    Academic Information
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2">
                                <div className="space-y-2 md:space-y-2">
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

                                <div className="hidden md:block space-y-2">
                                    <ValueField value="BISU Balilihan Campus" />
                                    <ValueField value="Bachelor of Science in Information Technology" />
                                    <ValueField value="4th Year" />
                                </div>
                            </div>
                        </section>

                        {/* Account Settings */}
                        {!isMaximize && (
                            <section>
                                <div className="p-1 my-8 flex items-center gap-1 bg-green-600 text-white rounded-lg">
                                    <div className="p-2 rounded-lg">
                                        <Settings className="w-4 h-4  text-white" />
                                    </div>
                                    <h3 className="text-sm text-white">
                                        Account Settings
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2">
                                    <div className="space-y-2 md:space-y-2">
                                        <InfoField
                                            label="Email"
                                            value={
                                                scholarInfo?.basic_information
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

                                    <div className="hidden md:block space-y-2">
                                        <ValueField
                                            value={
                                                scholarInfo?.basic_information
                                                    ?.email
                                            }
                                        />
                                        <ValueField value="••••••••" />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <ChangePasswordForm userId={4355295} />
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
        <p className="inline-flex items-center text-xs md:text-sm px-3 py-2 rounded-full text-gray-800 font-bold">
            {label}
        </p>
        <p
            className={`${mobileClass} text-gray-600 text-xs md:text-sm px-3 py-2 rounded-lg`}
        >
            {value}
        </p>
    </div>
);

const ValueField = ({ value, badge }) => (
    <div className="flex items-center">
        {badge === "green" ? (
            <span className="inline-flex items-center text-green-800 text-xs md:text-sm font-medium px-3 py-2 rounded-full">
                {value}
            </span>
        ) : (
            <p className="text-gray-700 text-xs md:text-sm font-medium px-3 py-2 rounded-lg">
                {value}
            </p>
        )}
    </div>
);

export default UserAccount;
