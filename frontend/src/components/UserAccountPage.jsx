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
        <div className="min-h-screen bg-gray-50">
            <div
                className={`${
                    isMaximize
                        ? "md:w-[100%] lg:w-[100%] xl:w-[100%] md:py-0"
                        : "md:w-[90%] lg:w-[85%] xl:w-[80%] md:py-8"
                } w-[100%] mx-auto`}
            >
                <div
                    className={`bg-white ${
                        isMaximize && "md:rounded-none"
                    } md:rounded-xl overflow-hidden border border-gray-100 shadow-sm`}
                >
                    {/* Header Section */}
                    <div className="relative">
                        <div
                            className={`${
                                isMaximize ? "p-0" : ""
                            } bg-white px-6 md:px-8 py-6 border-b border-gray-100`}
                        >
                            {!isMaximize && (
                                <h2 className="text-base text-gray-900 font-semibold mb-6">
                                    My Account
                                </h2>
                            )}

                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                                        {scholarInfo?.basic_information?.first_name}{" "}
                                        {scholarInfo?.basic_information?.last_name}
                                    </h2>
                                    <div className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                                        Scholar ID: {scholarId ? scholarId : userId}
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
                                            scholarInfo?.basic_information?.first_name +
                                            " " +
                                            scholarInfo?.basic_information?.last_name
                                        }
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Email Address"
                                        value={scholarInfo?.basic_information?.email}
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Contact Number"
                                        value={scholarInfo?.basic_information?.contact_number}
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Age"
                                        value={scholarInfo?.basic_information?.age}
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Gender"
                                        value={scholarInfo?.basic_information?.gender}
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Address"
                                        value={scholarInfo?.basic_information?.home_address}
                                        mobileClass={info}
                                    />
                                </div>

                                <div className="hidden md:block space-y-4">
                                    <ValueField
                                        value={
                                            scholarInfo?.basic_information?.first_name +
                                            " " +
                                            scholarInfo?.basic_information?.last_name
                                        }
                                    />
                                    <ValueField
                                        value={scholarInfo?.basic_information?.email}
                                    />
                                    <ValueField
                                        value={scholarInfo?.basic_information?.contact_number}
                                    />
                                    <ValueField
                                        value={scholarInfo?.basic_information?.age}
                                    />
                                    <ValueField
                                        value={scholarInfo?.basic_information?.gender}
                                    />
                                    <ValueField
                                        value={scholarInfo?.basic_information?.home_address}
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
                                        value={currentSchoolYear}
                                        mobileClass={info}
                                    />
                                    <InfoField
                                        label="Status"
                                        value={
                                            scholarInfo?.scholar_status === "active"
                                                ? "Active"
                                                : scholarInfo?.scholar_status === "deactivated"
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

                                <div className="hidden md:block space-y-4">
                                    <ValueField value={currentSchoolYear} />
                                    <ValueField
                                        value={
                                            scholarInfo?.scholar_status === "active"
                                                ? "Active"
                                                : scholarInfo?.scholar_status === "deactivated"
                                                  ? "Deactivated"
                                                  : "Not Renewed"
                                        }
                                        badge="green"
                                    />
                                    <ValueField value={scholarInfo?.rendered_hours} />
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
                                            value={scholarInfo?.basic_information?.email}
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
                                            value={scholarInfo?.basic_information?.email}
                                        />
                                        <ValueField value="••••••••" />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
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
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1.5">
            {label}
        </p>
        <p className={`${mobileClass} text-gray-800 text-sm`}>
            {value}
        </p>
    </div>
);

const ValueField = ({ value, badge }) => (
    <div className="flex items-center">
        {badge === "green" ? (
            <span className="inline-flex items-center bg-green-50 text-green-700 text-sm px-3 py-1 rounded-md">
                {value}
            </span>
        ) : (
            <p className="text-gray-800 text-sm">
                {value}
            </p>
        )}
    </div>
);

export default UserAccount;