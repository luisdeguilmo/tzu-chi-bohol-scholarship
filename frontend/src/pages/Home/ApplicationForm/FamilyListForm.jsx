import { useState, useEffect, useCallback, use } from "react";
import familyMembersInputFields from "../../../constant/application/familyMembersInputFields";
import scholarsInputFields from "../../../constant/application/scholarsInputFields";
import assistanceInputFields from "../../../constant/application/assistanceInputFields";
import { Plus, Trash2, TrashIcon } from "lucide-react";
import { useApplicationForm } from "../../../context/ApplicationFormContext";

const FamilyListForm = ({
    formData,
    updateFormData,
    setIsFirstFormApplicable,
    setIsSecondFormApplicable,
    isTzuChiSiblingsExisted = false,
    isOtherAssistanceExisted = false,
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

    const {
        isTzuChiSiblingsApplicable,
        setIsTzuChiSiblingsApplicable,
        isOtherAssistanceApplicable,
        setIsOtherAssistanceApplicable,
    } = useApplicationForm();

    useEffect(() => {
        if (isTzuChiSiblingsExisted) {
            setIsTzuChiSiblingsApplicable("applicable");
        }

        if (isOtherAssistanceExisted) {
            setIsOtherAssistanceApplicable("applicable");
        }
    }, [isTzuChiSiblingsExisted, isOtherAssistanceExisted]);

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
            {/* <h2 className="pt-12 pb-6 font-bold mb-4 text-gray-700 md:text-lg text-sm">
                Siblings (Eldest to Youngest) including Family Member
            </h2> */}

            <h2 className="mt-12 mb-8 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-sm">
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
                                    className="w-full border text-gray-800 text-xs border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                                    className="w-full border text-xs text-gray-800 border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                    className="col-span-3 mt-4 mb-7 flex items-center gap-1 shadow-lg bg-green-600 hover:bg-green-700 text-xs rounded-lg text-white px-4 py-2.5"
                >
                    <Plus className="mb-[.5px] w-4 h-4" />
                    Add Member
                </button>
            </div>

            {/* Family Members Table */}
            <div className="space-y-4">
                {sortedFamily.length > 0 ? (
                    sortedFamily.map((member, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-md p-4 bg-white shadow-sm relative"
                        >
                            <button
                                onClick={() => removeFamilyMember(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                <p>
                                    <span className="text-gray-500">Name:</span>{" "}
                                    <span className="text-gray-800">
                                        {member.name}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Relationship:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.relationship}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">Age:</span>{" "}
                                    <span className="text-gray-800">
                                        {member.age}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Gender:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.gender}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Civil Status:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.civil_status}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Living with Family:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.living_with_family}
                                    </span>
                                </p>

                                <p className="md:col-span-2">
                                    <span className="text-gray-500">
                                        Educational/Occupation:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.education_occupation}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Monthly Income:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {member.monthly_income}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="px-4 py-8 rounded-md border-2 border-dashed text-xs text-center text-gray-400">
                        No family members added yet.
                    </p>
                )}
            </div>

            {/* Tzu Chi Scholars Section */}
            {/* <h2 className="pt-12 pb-6 font-bold mb-4 text-gray-800 md:text-lg text-sm">
                Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
            </h2> */}

            <h2 className="mt-16 mb-6 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-sm">
                Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance
            </h2>

            <div
                className={`${
                    isTzuChiSiblingsApplicable === null ||
                    isTzuChiSiblingsApplicable === "not_applicable"
                        ? "mb-0"
                        : "mb-4"
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
                            setTzuChiScholars([]);
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
                <div
                    className={`grid sm:grid-cols-2 md:grid-cols-3 ${isTzuChiSiblingsApplicable === "applicable" && "gap-5 sm:gap-4"}`}
                >
                    {scholarsInputFields.map((input, index) => (
                        <div key={index}>
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
                                } w-full border text-xs text-gray-800 border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500`}
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
                    className={`col-span-3 flex items-center gap-1 mt-4 mb-7 shadow-lg text-xs rounded-lg text-white px-4 py-2.5 ${
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
                    <Plus className="mb-[.5px] w-4 h-4" />
                    Add Scholar
                </button>
            </div>

            {isTzuChiSiblingsApplicable === "applicable" && (
                <div className="space-y-4">
                    {tzu_chi_siblings.length > 0 ? (
                        tzu_chi_siblings.map((scholar, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-md p-4 bg-white shadow-sm relative"
                            >
                                <button
                                    onClick={() => removeScholar(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
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
                        <p className="px-4 py-8 rounded-md border-2 border-dashed text-xs text-center text-gray-400">
                            No siblings enjoying/enjoyed Tzu Chi Educational
                            assistance added yet.
                        </p>
                    )}
                </div>
            )}

            {/* Assistance from Other Organizations */}
            {/* <h2
                className={`${
                    isTzuChiSiblingsApplicable === null ||
                    isTzuChiSiblingsApplicable === "not_applicable"
                        ? "pt-0 md:pt-4"
                        : "pt-8"
                } pb-6 font-bold sm:mt-0 -mt-5 mb-4 text-gray-700 md:text-lg text-sm`}
            >
                Assistance from Other Association, Organization, School
                Discount, etc.
            </h2> */}
            <h2 className="mt-16 mb-6 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-sm">
                Assistance from Other Association, Organization, School
                Discount, etc.
            </h2>
            <div
                className={`${
                    isOtherAssistanceApplicable === null ||
                    isOtherAssistanceApplicable === "not_applicable"
                        ? "mb-0"
                        : "mb-4"
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
                            setAssistanceList([]);
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
                <div
                    className={`grid sm:grid-cols-2 md:grid-cols-3 ${isOtherAssistanceApplicable === "applicable" && "gap-5 sm:gap-4"}`}
                >
                    {assistanceInputFields.map((input) => (
                        <div>
                            <label
                                className={`block mb-1 ${
                                    isOtherAssistanceApplicable === null ||
                                    isOtherAssistanceApplicable ===
                                        "not_applicable"
                                        ? "text-gray-400 hidden"
                                        : "text-gray-600 block"
                                } text-xs font-medium`}
                            >
                                {input.label}
                            </label>
                            <input
                                type={input.type}
                                name={input.name}
                                value={newAssistance[input.name]}
                                onChange={handleAssistanceChange}
                                placeholder={input.placeholder}
                                className={`w-full border text-xs text-gray-800 border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 ${
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
                    className={`col-span-3 mt-4 mb-7 flex items-center gap-1 shadow-lg text-xs rounded-lg text-white px-4 py-2.5 ${
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
                    <Plus className="mb-[.5px] w-4 h-4" />
                    Add Assistance
                </button>
            </div>

            {isOtherAssistanceApplicable === "applicable" && (
                <div className="space-y-4">
                    {other_assistance.length > 0 ? (
                        other_assistance.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-md p-4 bg-white shadow-sm relative"
                            >
                                <button
                                    onClick={() => removeAssistance(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>

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
                        <p className="px-4 py-8 rounded-md border-2 border-dashed text-xs text-center text-gray-400">
                            No assistance records added yet.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FamilyListForm;
