import { useState, useEffect, useCallback } from "react";
import familyMembersInputFields from "../../../constant/application/familyMembersInputFields";
import scholarsInputFields from "../../../constant/application/scholarsInputFields";
import assistanceInputFields from "../../../constant/application/assistanceInputFields";

const FamilyListForm = ({
    formData,
    updateFormData,
    setIsFirstFormApplicable,
    setIsSecondFormApplicable,
}) => {
    // Initialize state from formData or use empty arrays if not present
    const [family_members, setFamilyMembers] = useState(
        formData.family_members || []
    );
    const [tzu_chi_siblings, setTzuChiScholars] = useState(
        formData.tzu_chi_siblings || []
    );
    const [other_assistance, setAssistanceList] = useState(
        formData.other_assistance || []
    );

    const [isTzuChiSiblingsApplicable, setIsTzuChiSiblingsApplicable] =
        useState(null);
    const [isOtherAssistanceApplicable, setIsOtherAssistanceApplicable] =
        useState(null);

    const [newMember, setNewMember] = useState({
        name: "",
        relationship: "",
        age: "",
        gender: "",
        civil_status: "",
        living_with_family: "",
        education_occupation: "",
        monthly_income: "",
    });

    const [newScholar, setNewScholar] = useState({
        name: "",
        year_level: "",
        school: "",
        course: "",
        school_year: "",
    });

    const [newAssistance, setNewAssistance] = useState({
        organization_name: "",
        support_type: "",
        amount: "",
    });

    // Use useCallback to memoize the function that updates parent data
    const updateParentData = useCallback(() => {
        updateFormData({
            family_members,
            tzu_chi_siblings,
            other_assistance,
        });
    }, [family_members, tzu_chi_siblings, other_assistance, updateFormData]);

    // Update parent formData when our local state changes
    useEffect(() => {
        updateParentData();
    }, [updateParentData]);

    // Rest of the component remains the same...
    // Handle input changes
    const handleChange = (e) => {
        setNewMember({ ...newMember, [e.target.name]: e.target.value });
    };

    const handleScholarChange = (e) => {
        setNewScholar({ ...newScholar, [e.target.name]: e.target.value });
    };

    const handleAssistanceChange = (e) => {
        setNewAssistance({ ...newAssistance, [e.target.name]: e.target.value });
    };

    // Add new family member
    const addFamilyMember = () => {
        if (newMember.name && newMember.age) {
            setFamilyMembers([...family_members, newMember]);
            setNewMember({
                name: "",
                relationship: "",
                age: "",
                gender: "",
                civil_status: "",
                living_with_family: "",
                education_occupation: "",
                monthly_income: "",
            });
        }
    };

    // Add new Tzu Chi scholar
    const addScholar = () => {
        if (newScholar.name && newScholar.school) {
            setTzuChiScholars([...tzu_chi_siblings, newScholar]);
            setNewScholar({
                name: "",
                year_level: "",
                school: "",
                course: "",
                school_year: "",
            });
        }
    };

    // Add new Assistance Entry
    const addAssistance = () => {
        if (newAssistance.organization_name && newAssistance.support_type) {
            setAssistanceList([...other_assistance, newAssistance]);
            setNewAssistance({
                organization_name: "",
                support_type: "",
                amount: "",
            });
        }
    };

    // Remove a family member
    const removeFamilyMember = (index) => {
        const updatedFamilyMembers = [...family_members];
        updatedFamilyMembers.splice(index, 1);
        setFamilyMembers(updatedFamilyMembers);
    };

    // Remove a scholar
    const removeScholar = (index) => {
        const updatedScholars = [...tzu_chi_siblings];
        updatedScholars.splice(index, 1);
        setTzuChiScholars(updatedScholars);
    };

    // Remove an assistance entry
    const removeAssistance = (index) => {
        const updatedAssistance = [...other_assistance];
        updatedAssistance.splice(index, 1);
        setAssistanceList(updatedAssistance);
    };

    // Sort members by age (eldest to youngest)
    const sortedFamily = [...family_members].sort((a, b) => b.age - a.age);

    return (
        <div>
            <h2 className="pt-12 pb-6 font-bold mb-4 text-gray-700 md:text-lg text-sm">
                Siblings (Eldest to Youngest) including Family Member
            </h2>

            {/* Family Members Input Form */}
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {familyMembersInputFields.map((input, index) =>
                        input.type === "select" ? (
                            <div key={index}>
                                <label className="block mb-1 text-gray-500 text-xs">
                                    {input.label}
                                </label>
                                <select
                                    name={input.name}
                                    value={newMember[input.name]}
                                    onChange={handleChange}
                                    // className={`w-full outline-none border-b-[2px] ${
                                    //     errors && errors[field.name]
                                    //         ? "border-red-500"
                                    //         : "border-gray-400"
                                    // } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                    className="w-full border text-gray-800 text-xs border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    // required={field.required}
                                >
                                    {input.options.map((option) => (
                                        <option
                                            key={option}
                                            value={option}
                                            disabled={option === ""}
                                            className="text-gray-800 disabled:text-gray-400"
                                        >
                                            {option === ""
                                                ? "-- Select --"
                                                : option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div key={index}>
                                <label className="block mb-1 text-gray-500 text-xs">
                                    {input.label}
                                </label>
                                <input
                                    type={input.type}
                                    name={input.name}
                                    value={newMember[input.name]}
                                    onChange={handleChange}
                                    placeholder={input.placeholder}
                                    className="w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                        )
                    )}

                    {/* <div className="block relative">
                        
                        <label className="block mb-1 text-gray-600 text-xs">
                            Living w/ Family or Not?
                        </label>
                        <select
                            id="living"
                            name="living_with_family"
                            value={newMember.living_with_family}
                            onChange={handleChange}
                            className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            <option value="Yes">Living with Family</option>
                            <option value="No">Not Living with Family</option>
                        </select>
                    </div> */}
                </div>
                <button
                    type="button"
                    onClick={addFamilyMember}
                    className="col-span-3 my-7 shadow-lg bg-green-600 hover:bg-green-700 text-sm rounded-md text-white p-2"
                >
                    Add Member
                </button>
            </div>

            {/* Family Members Table */}
            <div className="overflow-y-auto">
                {sortedFamily.length > 0 && (
                    <table className="w-full mb-6 lg:w-[100%] min-w-[1000px]">
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
                                    "Action",
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
                                    <td className="py-2">
                                        <button
                                            onClick={() =>
                                                removeFamilyMember(index)
                                            }
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Tzu Chi Scholars Section */}
            <h2 className="pt-12 pb-6 font-bold mb-4 text-gray-800 md:text-lg text-sm">
                Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
            </h2>
            <div
                className={`${
                    isTzuChiSiblingsApplicable === null ||
                    isTzuChiSiblingsApplicable === "not_applicable"
                        ? "mb-0"
                        : "mb-12"
                } p-4 border rounded-lg bg-gray-50/50 border-gray-200`}
            >
                <div>
                    <input
                        id="tzu_chi_siblings_applicable"
                        name="tzu_chi_siblings"
                        type="radio"
                        value={"applicable"}
                        checked={isTzuChiSiblingsApplicable === "applicable"}
                        onChange={(e) => {
                            setIsTzuChiSiblingsApplicable(e.target.value);
                            setIsFirstFormApplicable(true);
                        }}
                        className="accent-green-600"
                    />
                    <label
                        htmlFor="tzu_chi_siblings_applicable"
                        className="ml-2 text-xs text-gray-700"
                    >
                        Yes, I have siblings who received Tzu Chi Educational
                        Assistance
                    </label>
                </div>
                <div>
                    <input
                        id="tzu_chi_siblings_not_applicable"
                        name="tzu_chi_siblings"
                        type="radio"
                        value={"not_applicable"}
                        checked={
                            isTzuChiSiblingsApplicable === "not_applicable"
                        }
                        onChange={(e) => {
                            setIsTzuChiSiblingsApplicable(e.target.value);
                            setIsFirstFormApplicable(false);
                        }}
                        className="accent-green-600"
                    />
                    <label
                        htmlFor="tzu_chi_siblings_not_applicable"
                        className="ml-2 text-xs text-gray-700"
                    >
                        No / Not applicable
                    </label>
                </div>
            </div>
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {scholarsInputFields.map((input) => (
                        <div>
                            <label
                                className={`block mb-1 text-xs ${
                                    isTzuChiSiblingsApplicable === null ||
                                    isTzuChiSiblingsApplicable ===
                                        "not_applicable"
                                        ? "text-gray-400 hidden"
                                        : "text-gray-600 block"
                                }`}
                            >
                                {input.label}
                            </label>
                            <input
                                type={input.type}
                                name={input.name}
                                value={newScholar[input.name]}
                                onChange={handleScholarChange}
                                placeholder={input.placeholder}
                                className={`${
                                    isTzuChiSiblingsApplicable === null ||
                                    isTzuChiSiblingsApplicable ===
                                        "not_applicable"
                                        ? "text-gray-400 hidden"
                                        : "text-gray-600 block"
                                } w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500`}
                                disabled={
                                    isTzuChiSiblingsApplicable === null ||
                                    isTzuChiSiblingsApplicable ===
                                        "not_applicable"
                                }
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addScholar}
                    className={`col-span-3 my-7 shadow-lg text-sm rounded-md text-white p-2 ${
                        isTzuChiSiblingsApplicable === null ||
                        isTzuChiSiblingsApplicable === "not_applicable"
                            ? "bg-green-300 hidden"
                            : "bg-green-600 hover:bg-green-700 block"
                    }`}
                    disabled={
                        isTzuChiSiblingsApplicable === null ||
                        isTzuChiSiblingsApplicable === "not_applicable"
                    }
                >
                    Add Scholar
                </button>
            </div>

            {/* Display Scholars in a Table */}
            <div className="overflow-y-auto">
                {tzu_chi_siblings.length > 0 && (
                    <table className="w-full mb-6 lg:w-[100%] min-w-[1000px]">
                        <thead>
                            <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
                                {[
                                    "Name",
                                    "Year Level",
                                    "School",
                                    "Course",
                                    "School Year",
                                    "Action",
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
                            {tzu_chi_siblings.map((scholar, index) => (
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
                                    <td className="p-2">
                                        <button
                                            onClick={() => removeScholar(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Assistance from Other Organizations */}
            <h2
                className={`${
                    isTzuChiSiblingsApplicable === null ||
                    isTzuChiSiblingsApplicable === "not_applicable"
                        ? "pt-0 md:pt-4"
                        : "pt-8"
                } pb-6 font-bold sm:mt-0 -mt-5  mb-4 text-gray-700 md:text-lg text-sm`}
            >
                Assistance from Other Association, Organization, School
                Discount, etc.
            </h2>
            <div
                className={`${
                    isOtherAssistanceApplicable === null ||
                    isOtherAssistanceApplicable === "not_applicable"
                        ? "mb-0"
                        : "mb-12"
                } p-4 border rounded-lg bg-gray-50/50 border-gray-200`}
            >
                <div>
                    <input
                        id="other_assistance_applicable"
                        name="other_assistance"
                        type="radio"
                        value={"applicable"}
                        checked={isOtherAssistanceApplicable === "applicable"}
                        onChange={(e) => {
                            setIsOtherAssistanceApplicable(e.target.value);
                            setIsSecondFormApplicable(true);
                        }}
                        className="accent-green-600"
                    />
                    <label
                        htmlFor="other_assistance_applicable"
                        className="ml-2 text-xs text-gray-700"
                    >
                        Yes, I have received assistance from other sources
                    </label>
                </div>
                <div>
                    <input
                        id="other_assistance_not_applicable"
                        name="other_assistance"
                        type="radio"
                        value={"not_applicable"}
                        checked={
                            isOtherAssistanceApplicable === "not_applicable"
                        }
                        onChange={(e) => {
                            setIsOtherAssistanceApplicable(e.target.value);
                            setIsSecondFormApplicable(false);
                        }}
                        className="accent-green-600"
                    />
                    <label
                        htmlFor="other_assistance_not_applicable"
                        className="ml-2 text-xs text-gray-700"
                    >
                        No / Not applicable
                    </label>
                </div>
            </div>
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {assistanceInputFields.map((input) => (
                        <div>
                            <label
                                className={`block mb-1 ${
                                    isOtherAssistanceApplicable === null ||
                                    isOtherAssistanceApplicable ===
                                        "not_applicable"
                                        ? "text-gray-400 hidden"
                                        : "text-gray-600 block"
                                } text-xs`}
                            >
                                {input.label}
                            </label>
                            <input
                                type={input.type}
                                name={input.name}
                                value={newAssistance[input.name]}
                                onChange={handleAssistanceChange}
                                placeholder={input.placeholder}
                                className={`w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                                    isOtherAssistanceApplicable === null ||
                                    isOtherAssistanceApplicable ===
                                        "not_applicable"
                                        ? "text-gray-400 hidden"
                                        : "text-gray-600 block"
                                }`}
                                disabled={
                                    isOtherAssistanceApplicable === null ||
                                    isOtherAssistanceApplicable ===
                                        "not_applicable"
                                }
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addAssistance}
                    className={`col-span-3 my-7 shadow-lg text-sm rounded-md text-white p-2 ${
                        isOtherAssistanceApplicable === null ||
                        isOtherAssistanceApplicable === "not_applicable"
                            ? "bg-green-300 hidden"
                            : "bg-green-600 hover:bg-green-700 block"
                    }`}
                    disabled={
                        isOtherAssistanceApplicable === null ||
                        isOtherAssistanceApplicable === "not_applicable"
                    }
                >
                    Add Assistance
                </button>
            </div>

            {/* Assistance Table */}
            <div className="overflow-y-auto">
                {other_assistance.length > 0 && (
                    <table className="w-full mb-6 lg:w-[100%] min-w-[1000px]">
                        <thead>
                            <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
                                {[
                                    "Organization",
                                    "Type of Support",
                                    "Amount",
                                    "Action",
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
                            {other_assistance.map((assistance, index) => (
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
                                    <td className="py-2">
                                        <button
                                            onClick={() =>
                                                removeAssistance(index)
                                            }
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FamilyListForm;
