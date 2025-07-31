import { useState } from "react";

const PersonalInformation = () => {
    return (
        <>
            <h3 className="text-gray-700 py-8 font-bold">
                Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div>
                    <p className="text-xs text-gray-700">Full Name</p>
                    <p className="text-sm font-bold text-gray-800">
                        Luis Deguilmo
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Gender</p>
                    <p className="text-sm font-bold text-gray-800">Male</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Age</p>
                    <p className="text-sm font-bold text-gray-800">20</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Birthdate</p>
                    <p className="text-sm font-bold text-gray-800">
                        August 20, 2004
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Birthplace</p>
                    <p className="text-sm font-bold text-gray-800">Tokyo</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Home Address</p>
                    <p className="text-sm font-bold text-gray-800">
                        Purok 3, Cogon Sur, Loon, Bohol
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Subd./Village</p>
                    <p className="text-sm font-bold text-gray-800">N/A</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Barangay</p>
                    <p className="text-sm font-bold text-gray-800">Cogon Sur</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">City/Municipality</p>
                    <p className="text-sm font-bold text-gray-800">Loon</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Zip Code</p>
                    <p className="text-sm font-bold text-gray-800">6327</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Age</p>
                    <p className="text-sm font-bold text-gray-800">20</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Personal Contact</p>
                    <p className="text-sm font-bold text-gray-800">
                        09827323236
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Religion</p>
                    <p className="text-sm font-bold text-gray-800">Catholic</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Civil Status</p>
                    <p className="text-sm font-bold text-gray-800">Single</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Facebook</p>
                    <p className="text-sm font-bold text-gray-800">
                        Luis Deguilmo
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Email Address</p>
                    <p className="text-sm font-bold text-gray-800">
                        luis@gmail.com
                    </p>
                </div>
            </div>
        </>
    );
};

const EducationalBackground = () => {
    return (
        <>
            <h3 className="text-gray-700 py-8 font-bold">
                Educational Background
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div>
                    <p className="text-xs text-gray-700">Previous School</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Location</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Honor/Award</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">GWA</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Course Taken</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">
                        Incoming Grade/Year Level
                    </p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Present School</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Location</p>
                    <p className="text-sm font-bold text-gray-800">SHA</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Course 1</p>
                    <p className="text-sm font-bold text-gray-800">BSIT</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Course 2</p>
                    <p className="text-sm font-bold text-gray-800">BSCRIM</p>
                </div>
            </div>
        </>
    );
};

const FamilyInformation = () => {
    const [family_members, setNewMember] = useState({
        name: "wjsssssssssssssssssssssssssssssssssssssssd",
        relationship: "w",
        age: "w",
        gender: "w",
        civil_status: "w",
        living_with_family: "w",
        education_occupation: "wkdfndnfdfdfdfd",
        monthly_income: "w",
    });

    const [scholarsList, setNewScholar] = useState({
        name: "w",
        year_level: "w",
        school: "w",
        course: "w",
        school_year: "w",
    });

    const sortedFamily = [family_members].sort((a, b) => b.age - a.age);
    const scholars = [];

    scholars.push(scholarsList);

    return (
        <>
            <h3 className="text-gray-700 py-10 font-bold">Family Information</h3>

            <h4 className="text-sm text-gray-700 font-bold pb-10">
                A. 1. Parent/Guardian
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div>
                    <p className="text-xs text-gray-700">Father</p>
                    <p className="text-sm font-bold text-gray-800">
                        Louie Deguilmo
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Age</p>
                    <p className="text-sm font-bold text-gray-800">55</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">
                        Educational Attainment
                    </p>
                    <p className="text-sm font-bold text-gray-800">Male</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Occupation</p>
                    <p className="text-sm font-bold text-gray-800">20</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Monthly Income</p>
                    <p className="text-sm font-bold text-gray-800">
                        August 20, 2004
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Contact Number</p>
                    <p className="text-sm font-bold text-gray-800">Tokyo</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Mother</p>
                    <p className="text-sm font-bold text-gray-800">
                        Rowena Deguilmo
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Age</p>
                    <p className="text-sm font-bold text-gray-800">N/A</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">
                        Educational Attainment
                    </p>
                    <p className="text-sm font-bold text-gray-800">Cogon Sur</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Occupation</p>
                    <p className="text-sm font-bold text-gray-800">Loon</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Monthly Income</p>
                    <p className="text-sm font-bold text-gray-800">6327</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Contact Number</p>
                    <p className="text-sm font-bold text-gray-800">20</p>
                </div>
            </div>

            <h4 className="text-sm text-gray-700 font-bold py-10">
                A. 2. Contact Person In Case Of Emergency
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div>
                    <p className="text-xs text-gray-700">Name</p>
                    <p className="text-sm font-bold text-gray-800">
                        Rowena Deguilmo
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Relationship</p>
                    <p className="text-sm font-bold text-gray-800">Mother</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Address</p>
                    <p className="text-sm font-bold text-gray-800">Cebu City</p>
                </div>
                <div>
                    <p className="text-xs text-gray-700">Occupation</p>
                    <p className="text-sm font-bold text-gray-800">
                        09276263233
                    </p>
                </div>
            </div>

            <h4 className="text-sm text-gray-700 font-bold py-10">
                B. Family Member
            </h4>
            <div className="overflow-y-auto">
                {sortedFamily.length > 0 && (
                    <table className="w-full lg:w-[100%] min-w-[1000px]">
                        <thead>
                            <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
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

            <h4 className="text-sm text-gray-700 font-bold py-10">
                C. Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
            </h4>
            <div className="overflow-y-auto">
                {scholars.length > 0 && (
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
                                    <td className="p-2">{scholar.school}</td>
                                    <td className="p-2">{scholar.course}</td>
                                    <td className="p-2">
                                        {scholar.school_year}
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

const Assistance = () => {
    const [newAssistance, setNewAssistance] = useState({
        organization_name: "w",
        support_type: "w",
        amount: "w",
    });
    const assistances = [];

    assistances.push(newAssistance);

    return (
        <>
            <h3 className="text-gray-700 py-10 font-bold">
                Assistance from Other Association, Organization, School
                Discount, etc.
            </h3>
            <div className="overflow-y-auto">
                {assistances.length > 0 && (
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
                            {assistances.map((assistance, index) => (
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
                <PersonalInformation />
                <EducationalBackground />
                <FamilyInformation />
                <Assistance />

                <div className="mt-10 md:mt-8">
                    <label className="flex">
                        <input
                            type="checkbox"
                            value={isConsent}
                            onChange={onSetConsent}
                            className="accent-green-600 mr-2"
                        />
                        <span className="text-xs text-justify">
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
