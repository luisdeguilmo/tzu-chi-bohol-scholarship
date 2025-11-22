import { useState } from "react";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";

const PersonalInformation = ({ personal }) => {
    return (
        <>
            {/* <h3 className="text-gray-700 py-8 font-bold md:text-lg text-sm">
                Personal Information
            </h3> */}
            <h2 className="mb-10 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-xs md:text-sm">
                Personal Information
            </h2>
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
            <h2 className="mt-10 mb-10 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-xs md:text-sm">
                Educational Background
            </h2>
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
            {/* <h3 className="text-gray-700 py-10 font-bold md:text-lg text-sm">
                Family Information
            </h3> */}
            <h2 className="mt-10 mb-10 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-xs md:text-sm">
                Family Information
            </h2>

            {/* <h4 className="text-gray-700 font-bold pb-10  md:text-sm text-xs">
                Parent/Guardian
            </h4> */}
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

            {/* <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                Contact Person In Case Of Emergency
            </h4> */}
            <h2 className="mt-10 mb-10 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-[10px] md:text-xs">
                Contact Person In Case Of Emergency
            </h2>
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

            {/* <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                Family Member
            </h4> */}
            <h2 className="mt-10 mb-4 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-[10px] md:text-xs">
                Family Member
            </h2>

            <div className="space-y-4">
                {sortedFamily.length > 0 ? (
                    sortedFamily.map((member, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                <p>
                                    <span className="text-gray-600">Name:</span>{" "}
                                    <span className="text-gray-800">
                                        {member.name}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Relationship:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.relationship}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">Age:</span>{" "}
                                    <span className="text-gray-800">
                                        {member.age}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Gender:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.gender}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Civil Status:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.civil_status}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Living with Family:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.living_with_family}
                                    </span>
                                </p>

                                <p className="md:col-span-2">
                                    <span className="text-gray-600">
                                        Education/Job:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.education_occupation}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Income:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.monthly_income}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-500">
                        No family members added yet.
                    </p>
                )}
            </div>

            {scholars.length > 0 && (
                <>
                    {/* <h4 className="text-gray-700 font-bold py-10 md:text-sm text-xs">
                        Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
                    </h4> */}
                    <h4 className="mt-10 mb-4 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-xs md:text-sm">
                        Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
                    </h4>

                    <div className="space-y-4">
                        {scholars.length > 0 ? (
                            scholars.map((scholar, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                        <p>
                                            <span className="text-gray-600">
                                                Name:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {scholar.name}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-gray-600">
                                                Year Level:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {scholar.year_level}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-gray-600">
                                                School:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {scholar.school}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-gray-600">
                                                Course:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {scholar.course}
                                            </span>
                                        </p>

                                        <p className="md:col-span-2">
                                            <span className="text-gray-600">
                                                School Year:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {scholar.school_year}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-500">
                                No scholars added yet.
                            </p>
                        )}
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
                    {/* <h3 className="text-gray-700 py-10 font-bold md:text-lg text-sm">
                        Assistance from Other Association, Organization, School
                        Discount, etc.
                    </h3> */}
                    <h3 className="mt-10 mb-4 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-xs md:text-sm">
                        Assistance from Other Association, Organization, School
                        Discount, etc.
                    </h3>
                    <div className="space-y-4">
                        {assistance.length > 0 ? (
                            assistance.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                        <p>
                                            <span className="text-gray-600">
                                                Organization:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {item.organization_name}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-gray-600">
                                                Type of Support:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {item.support_type}
                                            </span>
                                        </p>

                                        <p className="md:col-span-2">
                                            <span className="text-gray-600">
                                                Amount:
                                            </span>{" "}
                                            <span className="text-gray-800">
                                                {item.amount}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-500">
                                No assistance records added yet.
                            </p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

const OtherInformation = ({ expectation, character_reference }) => {
    return (
        <>
            {/* <h3 className="text-gray-700 py-10 font-bold md:text-lg text-sm">
                Other Information
            </h3> */}
            <h3 className="mt-16 mb-10 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-xs md:text-sm">
                Other Information
            </h3>
            <div>
                <p className="text-xs text-gray-700">Expectation</p>
                <p className="text-sm mt-1 text-gray-800">{expectation}</p>
            </div>

            <h4 className="mt-10 mb-4 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-[10px] md:text-xs">
                Character Reference
            </h4>

            <div className="space-y-4">
                {character_reference.length > 0 ? (
                    character_reference.map((character, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                <p>
                                    <span className="text-gray-600">Name:</span>{" "}
                                    <span className="text-gray-800">
                                        {character.name}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Address:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.address}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Company:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.company}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Position:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.position}
                                    </span>
                                </p>

                                <p className="md:col-span-2">
                                    <span className="text-gray-600">
                                        Contact #:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.contact_number}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-500">
                        No character references added yet.
                    </p>
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
