import { useState, useEffect, useCallback } from "react";
import familyMembersInputFields from "../../../constant/application/familyMembersInputFields";
import scholarsInputFields from "../../../constant/application/scholarsInputFields";
import assistanceInputFields from "../../../constant/application/assistanceInputFields";

const FamilyListForm = ({ formData, updateFormData }) => {
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
            <h2 className="pt-12 pb-6 font-bold mb-4">
                Siblings (Eldest to Youngest) including Family Member
            </h2>

            {/* Family Members Input Form */}
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {familyMembersInputFields.map((input) => (
                        <input
                            type={input.type}
                            name={input.name}
                            value={newMember[input.name]}
                            onChange={handleChange}
                            placeholder={input.placeholder}
                            className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                        />
                    ))}

                    <div className="block relative">
                        <label
                            htmlFor="living"
                            className="absolute top-[-10px] text-gray-600 text-sm"
                        >
                            Status
                        </label>
                        <select
                            id="living"
                            name="living_with_family"
                            value={newMember.living_with_family}
                            onChange={handleChange}
                            className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            <option value="Yes">Living with Family</option>
                            <option value="No">Not Living with Family</option>
                        </select>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={addFamilyMember}
                    className="col-span-3 my-7 shadow-lg bg-green-500 text-white p-2 rounded-sm"
                >
                    Add Member
                </button>
            </div>

            {/* Family Members Table */}
            <div className="overflow-scroll">
                {sortedFamily.length > 0 && (
                    <table className="w-full border-collapse border border-gray-300 mb-6">
                        <thead>
                            <tr className="bg-gray-200">
                                {[
                                    "Name",
                                    "Relationship",
                                    "Age",
                                    "Gender",
                                    "Civil Status",
                                    "Living?",
                                    "Education/Job",
                                    "Income",
                                    "Action",
                                ].map((header) => (
                                    <th key={header} className="border p-2">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedFamily.map((member, index) => (
                                <tr key={index} className="border">
                                    <td className="border p-2">
                                        {member.name}
                                    </td>
                                    <td className="border p-2">
                                        {member.relationship}
                                    </td>
                                    <td className="border p-2">{member.age}</td>
                                    <td className="border p-2">
                                        {member.gender}
                                    </td>
                                    <td className="border p-2">
                                        {member.civil_status}
                                    </td>
                                    <td className="border p-2">
                                        {member.living_with_family}
                                    </td>
                                    <td className="border p-2">
                                        {member.education_occupation}
                                    </td>
                                    <td className="border p-2">
                                        {member.monthly_income}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() =>
                                                removeFamilyMember(index)
                                            }
                                            className="text-red-500 hover:text-red-700"
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
            <h2 className="pt-12 pb-6 font-bold mb-4">
                Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
            </h2>
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {scholarsInputFields.map((input) => (
                        <input
                            type={input.type}
                            name={input.name}
                            value={newScholar[input.name]}
                            onChange={handleScholarChange}
                            placeholder={input.placeholder}
                            className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addScholar}
                    className="col-span-3 my-7 shadow-lg bg-green-500 text-white p-2 rounded-sm"
                >
                    Add Scholar
                </button>
            </div>

            {/* Display Scholars in a Table */}
            <div className="overflow-scroll">
                {tzu_chi_siblings.length > 0 && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                {[
                                    "Name",
                                    "Year Level",
                                    "School",
                                    "Course",
                                    "School Year",
                                    "Action",
                                ].map((header) => (
                                    <th key={header} className="border p-2">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tzu_chi_siblings.map((scholar, index) => (
                                <tr key={index} className="border">
                                    <td className="border p-2">
                                        {scholar.name}
                                    </td>
                                    <td className="border p-2">
                                        {scholar.year_level}
                                    </td>
                                    <td className="border p-2">
                                        {scholar.school}
                                    </td>
                                    <td className="border p-2">
                                        {scholar.course}
                                    </td>
                                    <td className="border p-2">
                                        {scholar.school_year}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => removeScholar(index)}
                                            className="text-red-500 hover:text-red-700"
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
            <h2 className="pt-12 pb-6 font-bold">
                Assistance from Other Association, Organization, School
                Discount, etc.
            </h2>
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {assistanceInputFields.map((input) => (
                        <input
                            type={input.type}
                            name={input.name}
                            value={newAssistance[input.name]}
                            onChange={handleAssistanceChange}
                            placeholder={input.placeholder}
                            className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addAssistance}
                    className="col-span-3 my-7 shadow-lg bg-green-500 text-white p-2 rounded-sm"
                >
                    Add Assistance
                </button>
            </div>

            {/* Assistance Table */}
            <div className="overflow-scroll">
                {other_assistance.length > 0 && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                {[
                                    "Organization",
                                    "Type of Support",
                                    "Amount",
                                    "Action",
                                ].map((header) => (
                                    <th key={header} className="border p-2">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {other_assistance.map((assistance, index) => (
                                <tr key={index} className="border">
                                    <td className="border p-2">
                                        {assistance.organization_name}
                                    </td>
                                    <td className="border p-2">
                                        {assistance.support_type}
                                    </td>
                                    <td className="border p-2">
                                        {assistance.amount}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() =>
                                                removeAssistance(index)
                                            }
                                            className="text-red-500 hover:text-red-700"
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