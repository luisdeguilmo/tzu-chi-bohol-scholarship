import { useState } from "react";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";

const PersonalInformation = ({ personal }) => {
    return (
        <>
            <h3 className="text-gray-700 py-8 font-bold md:text-lg text-sm">
                Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-4">
                {formConfig[FORM_SECTIONS.PERSONAL].map((item, index) => (
                    <div key={index}>
                        <p className="text-xs text-gray-500 mb-1.5">
                            {item.label}
                        </p>
                        <p className="text-xs font-medium text-gray-800">
                            {personal[item.name]}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

const EducationalBackground = ({ education }) => {
    console.log(education);
    return (
        <>
            <h3 className="text-gray-700 py-8 font-bold md:text-lg text-sm">
                Educational Background
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-4">
                {formConfig[FORM_SECTIONS.EDUCATION].map((item, index) => (
                    <div key={index}>
                        <p className="text-xs text-gray-500 mb-1.5">
                            {item.label}
                        </p>
                        <p className="text-xs font-medium text-gray-800">
                            {education[item.name]}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

const FamilyInformation = ({
    parents_guardian,
    contact_person,
    family_members,
    scholars,
}) => {
    const sortedFamily = family_members.sort((a, b) => b.age - a.age);

    return (
        <>
            <h3 className="text-gray-700 py-10 font-bold md:text-lg text-sm">
                Family Information
            </h3>

            <h4 className="text-gray-700 font-bold pb-10  md:text-sm text-xs">
                Parent/Guardian
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-4">
                {formConfig[FORM_SECTIONS.FAMILY].map((item, index) => (
                    <div key={index}>
                        <p className="text-xs text-gray-500 mb-1.5">
                            {item.label}
                        </p>
                        <p className="text-xs font-medium text-gray-800">
                            {parents_guardian[item.name]}
                        </p>
                    </div>
                ))}
            </div>

            <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                Contact Person In Case Of Emergency
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {formConfig[FORM_SECTIONS.CONTACT_PERSON].map((item, index) => (
                    <div key={index}>
                        <p className="text-xs text-gray-500 mb-1.5">
                            {item.label}
                        </p>
                        <p className="text-xs font-medium text-gray-800">
                            {contact_person[item.name]}
                        </p>
                    </div>
                ))}
            </div>

            <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                Family Member
            </h4>
            <div className="overflow-y-auto">
                {sortedFamily.length > 0 && (
                    <table className="w-full lg:w-[100%] min-w-[1000px]">
                        <thead>
                            <tr className="p-2 bg-gray-50 text-xs font-light text-slate-700">
                                {[
                                    "Name",
                                    "Relationship",
                                    "Age",
                                    "Gender",
                                    "Civil Status",
                                    "Living w/ Family or Not?",
                                    "Education/Job",
                                    "Income",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="py-4 font-semibold text-xs"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedFamily.map((member, index) => (
                                <tr
                                    key={index}
                                    className="text-center text-xs border-y border-gray-200 text-gray-500"
                                >
                                    <td className="py-5">{member.name}</td>
                                    <td className="py-2">
                                        {member.relationship}
                                    </td>
                                    <td className="py-2">{member.age}</td>
                                    <td className="py-2">{member.gender}</td>
                                    <td className="py-2">
                                        {member.civil_status}
                                    </td>
                                    <td className="py-2">
                                        {member.living_with_family}
                                    </td>
                                    <td className="py-2">
                                        {member.education_occupation}
                                    </td>
                                    <td className="py-2">
                                        {member.monthly_income}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {scholars.length > 0 && (
                <>
                    <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                        Siblings Enjoying/Enjoyed Tzu Chi Educational
                        Assistance
                    </h4>
                    <div className="overflow-y-auto">
                        <table className="w-full lg:w-[100%] min-w-[1000px]">
                            <thead>
                                <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
                                    {[
                                        "Name",
                                        "Year Level",
                                        "School",
                                        "Course",
                                        "School Year",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="py-4 font-semibold text-xs"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {scholars.map((scholar, index) => (
                                    <tr
                                        key={index}
                                        className="text-center text-xs border-y border-gray-200 text-gray-500"
                                    >
                                        <td className="py-5">{scholar.name}</td>
                                        <td className="p-2">
                                            {scholar.year_level}
                                        </td>
                                        <td className="p-2">
                                            {scholar.school}
                                        </td>
                                        <td className="p-2">
                                            {scholar.course}
                                        </td>
                                        <td className="p-2">
                                            {scholar.school_year}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
};

const Assistance = ({ assistance }) => {
    return (
        <>
            {assistance.length > 0 && (
                <>
                    <h3 className="text-gray-700 py-10 font-bold md:text-lg text-sm">
                        Assistance from Other Association, Organization, School
                        Discount, etc.
                    </h3>
                    <div className="overflow-y-auto">
                        <table className="w-full mb-6 lg:w-[100%] min-w-[1000px]">
                            <thead>
                                <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
                                    {[
                                        "Organization",
                                        "Type of Support",
                                        "Amount",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="py-4 font-semibold text-xs"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {assistance.map((assistance, index) => (
                                    <tr
                                        key={index}
                                        className="text-center text-xs border-y border-gray-200 text-gray-500"
                                    >
                                        <td className="py-5">
                                            {assistance.organization_name}
                                        </td>
                                        <td className="py-2">
                                            {assistance.support_type}
                                        </td>
                                        <td className="py-2">
                                            {assistance.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
};

const OtherInformation = ({ expectation, character_reference }) => {
    return (
        <>
            <h3 className="text-gray-700 py-10 font-bold md:text-lg text-sm">
                Other Information
            </h3>
            <div>
                <p className="text-xs text-gray-700">Expectation</p>
                <p className="text-sm font-bold text-gray-800">{expectation}</p>
            </div>

            <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                Character Reference
            </h4>

            <div className="overflow-y-auto">
                {character_reference.length > 0 && (
                    <table className="w-full mb-6 lg:w-[100%] min-w-[1000px]">
                        <thead>
                            <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
                                {[
                                    "Name",
                                    "Address",
                                    "Company",
                                    "Position",
                                    "Contact #",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="py-4 font-semibold text-xs"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {character_reference.map((character, index) => (
                                <tr
                                    key={index}
                                    className="text-center text-xs border-y border-gray-200 text-gray-500"
                                >
                                    <td className="py-5">{character.name}</td>
                                    <td className="py-2">
                                        {character.address}
                                    </td>
                                    <td className="py-2">
                                        {character.company}
                                    </td>
                                    <td className="py-2">
                                        {character.position}
                                    </td>
                                    <td className="py-2">
                                        {character.contact_number}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

const ReviewPage = ({ formData, isConsent, onSetConsent }) => {
    console.log(formData);
    return (
        <div className="bg-white">
            <div className="bg-white mx-auto">
                <PersonalInformation personal={formData.personal_information} />
                <EducationalBackground
                    education={formData.educational_background}
                />
                <FamilyInformation
                    parents_guardian={formData.parents_guardian}
                    contact_person={formData.contact_person}
                    family_members={formData.family_members}
                    scholars={formData.tzu_chi_siblings}
                />
                <Assistance assistance={formData.other_assistance} />
                <OtherInformation
                    expectation={formData.other_information.expectation}
                    character_reference={formData.character_reference}
                />

                <div className="mt-10 md:mt-8">
                    <label className="flex">
                        <input
                            type="checkbox"
                            value={isConsent}
                            onChange={onSetConsent}
                            className="accent-green-600 mr-2"
                        />
                        <span className="text-xs text-justify text-gray-800">
                            I hereby attest that the information I have provided
                            is true and correct. I also consents Tzu Chi
                            Foundation to obtain and retain my personal
                            information for the purpose of this application.
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
