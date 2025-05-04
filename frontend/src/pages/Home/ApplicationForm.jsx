import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const FileUploadForm = ({ formData, updateFilesData }) => {
    // Initialize state for the formatted file objects
    const [files, setFiles] = useState(formData.uploaded_files || []);
    // Keep track of file previews separately for display purposes
    const [filePreviews, setFilePreviews] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*, .pdf, .doc, .docx",
        onDrop: (acceptedFiles) => {
            // Format the files with just the filename property
            const formattedFiles = acceptedFiles.map(file => ({
                filename: file.name,
                // Keep the original file object for upload
                fileObj: file
            }));
            
            // Update files state with the formatted objects
            setFiles([...files, ...formattedFiles]);
            
            // Create previews for display purposes
            const newPreviews = acceptedFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file)
            }));
            
            setFilePreviews([...filePreviews, ...newPreviews]);
        },
    });

    // Use useCallback to prevent this from being recreated on every render
    const updateParentData = useCallback(() => {
        updateFilesData({
            uploaded_files: files
        });
    }, [files, updateFilesData]);

    // Update parent formData when files change
    useEffect(() => {
        updateParentData();
    }, [updateParentData]);

    // Clean up object URLs when component unmounts or files change
    useEffect(() => {
        return () => {
            filePreviews.forEach(filePreview => {
                if (filePreview.preview) {
                    URL.revokeObjectURL(filePreview.preview);
                }
            });
        };
    }, [filePreviews]);

    const removeFile = (index) => {
        // Remove from previews
        setFilePreviews(filePreviews.filter((_, i) => i !== index));
        
        // Remove the actual file from files array
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    return (
        <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
            <div
                {...getRootProps()}
                className="w-full p-12 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
            >
                <input {...getInputProps()} />
                <p className="text-gray-500">
                    Drag & drop files here, or click to select
                </p>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mt-5 mx-auto text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4"
                    />
                </svg>
            </div>

            {filePreviews.length > 0 && (
                <ul className="mt-4 w-full text-sm text-gray-700">
                    {filePreviews.map((filePreview, index) => (
                        <li
                            key={index}
                            className="p-2 bg-white rounded-lg shadow mt-2 flex justify-between items-center"
                        >
                            {filePreview.type && filePreview.type.startsWith("image/") && (
                                <img
                                    src={filePreview.preview}
                                    alt={filePreview.name}
                                    className="w-12 h-12 object-cover rounded mr-2"
                                />
                            )}
                            <span>
                                {filePreview.name} ({(filePreview.size / 1024).toFixed(2)} KB)
                            </span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1 text-black"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 6l12 12M18 6l-12 12"
                                    />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const FamilyList = ({ formData, updateFormData }) => {
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
                    <input
                        type="text"
                        name="name"
                        value={newMember.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="relationship"
                        value={newMember.relationship}
                        onChange={handleChange}
                        placeholder="Relationship"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="number"
                        name="age"
                        value={newMember.age}
                        onChange={handleChange}
                        placeholder="Age"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="gender"
                        value={newMember.gender}
                        onChange={handleChange}
                        placeholder="Gender"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="civil_status"
                        value={newMember.civil_status}
                        onChange={handleChange}
                        placeholder="Civil Status"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="education_occupation"
                        value={newMember.education_occupation}
                        onChange={handleChange}
                        placeholder="Education/Occupation"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="number"
                        name="monthly_income"
                        value={newMember.monthly_income}
                        onChange={handleChange}
                        placeholder="Monthly Income"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />

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
                    <input
                        type="text"
                        name="name"
                        value={newScholar.name}
                        onChange={handleScholarChange}
                        placeholder="Name"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="year_level"
                        value={newScholar.year_level}
                        onChange={handleScholarChange}
                        placeholder="Year Level"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="school"
                        value={newScholar.school}
                        onChange={handleScholarChange}
                        placeholder="School"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="course"
                        value={newScholar.course}
                        onChange={handleScholarChange}
                        placeholder="Course"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="school_year"
                        value={newScholar.school_year}
                        onChange={handleScholarChange}
                        placeholder="School Year"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
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
                    <input
                        type="text"
                        name="organization_name"
                        value={newAssistance.organization_name}
                        onChange={handleAssistanceChange}
                        placeholder="Organization"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="text"
                        name="support_type"
                        value={newAssistance.support_type}
                        onChange={handleAssistanceChange}
                        placeholder="Type of Support"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
                    <input
                        type="number"
                        name="amount"
                        value={newAssistance.amount}
                        onChange={handleAssistanceChange}
                        placeholder="Amount"
                        className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                    />
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

// Form section constants
const FORM_SECTIONS = {
    APPLICATION: "application_info",
    PERSONAL: "personal_information",
    EDUCATION: "educational_background",
    FAMILY: "parents_guardian",
    CONTACT_PERSON: "contact_person",
    REQUIREMENTS: "requirements",
};

// Form field configurations
const formConfig = {
    [FORM_SECTIONS.APPLICATION]: [
        {
            name: "school_year",
            label: "School Year",
            type: "text",
            required: true,
        },
        { name: "caseNo", label: "Case Number", type: "text", required: true },
    ],
    [FORM_SECTIONS.PERSONAL]: [
        { name: "last_name", label: "Last Name", type: "text", required: true },
        {
            name: "first_name",
            label: "First Name",
            type: "text",
            required: true,
        },
        {
            name: "middle_name",
            label: "Middle Name",
            type: "text",
            required: false,
        },
        {
            name: "suffix",
            label: "Suffix",
            type: "select",
            options: ["", "Jr", "Sr", "I", "II", "III", "IV"],
            defaultValue: "",
            required: false,
        },
        {
            name: "gender",
            label: "Gender",
            type: "select",
            options: ["", "Male", "Female"],
            defaultValue: "",
            required: true,
        },
        { name: "age", label: "Age", type: "text", required: true },
        {
            name: "birthdate",
            label: "Birthdate (mm/dd/yyyy)",
            type: "text",
            required: true,
        },
        {
            name: "birthplace",
            label: "Birthplace",
            type: "text",
            required: true,
        },
        {
            name: "home_address",
            label: "Home Address",
            type: "text",
            required: true,
        },
        {
            name: "subdivision",
            label: "Village/Subdivision",
            type: "text",
            required: false,
        },
        { name: "barangay", label: "Barangay", type: "text", required: true },
        {
            name: "city",
            label: "City/Municipality",
            type: "text",
            required: true,
        },
        { name: "zip_code", label: "Zipcode", type: "text", required: true },
        {
            name: "contact_number",
            label: "Personal Contact",
            type: "text",
            required: true,
        },
        {
            name: "secondary_contact",
            label: "Secondary Contact",
            type: "text",
            required: false,
        },
        { name: "religion", label: "Religion", type: "text", required: true },
        {
            name: "civil_status",
            label: "Civil Status",
            type: "text",
            required: true,
        },
        { name: "facebook", label: "Facebook", type: "text", required: false },
        {
            name: "email",
            label: "Email Address",
            type: "text",
            required: true,
        },
    ],
    [FORM_SECTIONS.EDUCATION]: [
        {
            name: "previous_school",
            label: "Last School Attended",
            type: "text",
            required: true,
        },
        {
            name: "previous_location",
            label: "Location",
            type: "text",
            required: true,
        },
        {
            name: "previous_honor",
            label: "Honor Award",
            type: "text",
            required: false,
        },
        { name: "previous_gwa", label: "GWA", type: "text", required: true },
        {
            name: "previous_course",
            label: "Course Taken",
            type: "text",
            required: false,
        },
        {
            name: "incoming_grade",
            label: "Incoming Grade/Year Level",
            type: "select",
            options: ["Select", "JHS", "SHS", "College", "Vocational"],
            defaultValue: "Select",
            required: true,
        },
        {
            name: "present_school",
            label: "School",
            type: "text",
            required: true,
        },
        {
            name: "present_location",
            label: "Location",
            type: "text",
            required: true,
        },
        {
            name: "present_course1",
            label: "Course 1",
            type: "text",
            required: false,
        },
        {
            name: "present_course2",
            label: "Course 2",
            type: "text",
            required: false,
        },
    ],
    [FORM_SECTIONS.FAMILY]: [
        // Father's information
        {
            name: "father_name",
            label: "Name of Father",
            type: "text",
            required: true,
        },
        { name: "father_age", label: "Age", type: "text", required: true },
        {
            name: "father_education",
            label: "Educational Attainment",
            type: "text",
            required: true,
        },
        {
            name: "father_occupation",
            label: "Occupation",
            type: "text",
            required: true,
        },
        {
            name: "father_income",
            label: "Monthly Income",
            type: "text",
            required: true,
        },
        {
            name: "father_contact",
            label: "Contact Number",
            type: "text",
            required: true,
        },

        // Mother's information
        {
            name: "mother_name",
            label: "Name of Mother",
            type: "text",
            required: true,
        },
        { name: "mother_age", label: "Age", type: "text", required: true },
        {
            name: "mother_education",
            label: "Educational Attainment",
            type: "text",
            required: true,
        },
        {
            name: "mother_occupation",
            label: "Occupation",
            type: "text",
            required: true,
        },
        {
            name: "mother_income",
            label: "Monthly Income",
            type: "text",
            required: true,
        },
        {
            name: "mother_contact",
            label: "Contact Number",
            type: "text",
            required: true,
        },

        // Guardian's information
        {
            name: "guardian_name",
            label: "Guardian Name",
            type: "text",
            required: false,
        },
        { name: "guardian_age", label: "Age", type: "text", required: false },
        {
            name: "guardian_education",
            label: "Educational Attainment",
            type: "text",
            required: false,
        },
        {
            name: "guardian_occupation",
            label: "Occupation",
            type: "text",
            required: false,
        },
        {
            name: "guardian_income",
            label: "Monthly Income",
            type: "text",
            required: false,
        },
        {
            name: "guardian_contact",
            label: "Contact Number",
            type: "text",
            required: false,
        },
    ],
    [FORM_SECTIONS.CONTACT_PERSON]: [
        {
            name: "emergency_contact_name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "emergency_contact_relationship",
            label: "Relationship",
            type: "text",
            required: true,
        },
        {
            name: "emergency_contact_address",
            label: "Address",
            type: "text",
            required: true,
        },
        {
            name: "emergency_contact_number",
            label: "Contact Number",
            type: "text",
            required: true,
        },
    ],
};

// Helper function to generate initial state from config
const generateInitialState = (fieldsConfig) => {
    const initialState = {};
    fieldsConfig.forEach((field) => {
        initialState[field.name] =
            field.type === "select" ? field.defaultValue || "" : "";
    });
    return initialState;
};

// Component for form fields
const FormFields = ({
    fields,
    section,
    formData,
    handleInputChange,
    errors,
}) => {
    let inputSection =
        fields === formConfig[FORM_SECTIONS.CONTACT_PERSON]
            ? FORM_SECTIONS.CONTACT_PERSON
            : section;

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
            {fields.map((field) => (
                <div key={field.name}>
                    {field.type === "select" ? (
                        <div className="block w-full mb-2 relative">
                            <label
                                htmlFor={field.name}
                                className="absolute top-[-10px] text-gray-600 text-sm"
                            >
                                {field.label}
                                {field.required && (
                                    <span className="text-red-500">*</span>
                                )}
                            </label>
                            <select
                                id={field.name}
                                name={field.name}
                                value={formData[section][field.name]}
                                onChange={(e) => handleInputChange(section, e)}
                                className={`w-full outline-none border-b-[2px] ${
                                    errors && errors[field.name]
                                        ? "border-red-500"
                                        : "border-gray-400"
                                } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                required={field.required}
                            >
                                {field.options.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                        disabled={option === ""}
                                    >
                                        {option === "" ? "Select" : option}
                                    </option>
                                ))}
                            </select>
                            {errors && errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[inputSection][field.name]}
                                onChange={(e) =>
                                    handleInputChange(inputSection, e)
                                }
                                placeholder={`${field.label}${
                                    field.required ? "*" : ""
                                }`}
                                className={`w-full outline-none border-b-[2px] ${
                                    errors && errors[field.name]
                                        ? "border-red-500"
                                        : "border-gray-400"
                                } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                required={field.required}
                            />
                            {errors && errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Component for navigation buttons
const NavigationButtons = ({
    isFirst,
    isLast,
    prevStep,
    nextStep,
    handleSubmit,
    handleRenewSubmit,
    formData,
    formConfig,
    sections,
}) => {
    const checkAndProceed = (e) => {
        e.preventDefault();

        if (sections) {
            let [section1, section2] = sections;
            console.log(section1, section2);
            console.log(sections);
            // let section1, section2;

            const { errors, hasErrors } = validateSection(
                section1.toString(),
                formData,
                formConfig
            );

            // let hasErrorsInSection2 = false, errors2 = {};

            if (section2) {
                const { errors, hasErrors } = validateSection(
                    section2,
                    formData,
                    formConfig
                );

                if (hasErrors) {
                    // Show toast notification for validation errors
                    toast.error("Please fill in all required fields", {
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                        iconTheme: {
                            primary: "#ff4b4b",
                            secondary: "#fff",
                        },
                        duration: 3000,
                    });

                    // You could also highlight the fields with errors here if needed
                    return;
                }
            }

            if (hasErrors) {
                // Show toast notification for validation errors
                toast.error("Please fill in all required fields", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                    iconTheme: {
                        primary: "#ff4b4b",
                        secondary: "#fff",
                    },
                    duration: 3000,
                });

                // You could also highlight the fields with errors here if needed
                return;
            }
        }

        // If validation passes, proceed to next step
        if (!isLast) {
            nextStep(e);
        } else {
            if (handleRenewSubmit) {
                handleRenewSubmit(e);
            } else {
                handleSubmit(e);
            }
        }
    };

    return (
        <div className="mt-4">
            {!isFirst && (
                <button
                    className="mr-2 px-5 py-[6px] bg-gray-200 text-gray-600 rounded-md"
                    onClick={prevStep}
                >
                    Previous
                </button>
            )}

            {!isLast ? (
                <button
                    className="px-5 py-[6px] bg-green-500 text-white rounded-md shadow-lg"
                    onClick={checkAndProceed}
                >
                    Next
                </button>
            ) : (
                <button
                    className="px-5 py-[6px] bg-green-500 text-white rounded-md shadow-lg"
                    onClick={checkAndProceed}
                >
                    Submit
                </button>
            )}
        </div>
    );
};

// Component for progress indicator
const ProgressIndicator = ({ steps, currentStep }) => {
    return (
        <div className="w-[80%] lg:w-[65%] mx-auto mb-8 mt-6">
            <div className="relative flex items-center justify-between">
                {/* Progress line */}
                <div className="absolute h-1 bg-gray-200 w-full"></div>

                {/* Step indicators */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full 
                  ${index + 1 <= currentStep ? "bg-green-500" : "bg-gray-300"}`}
                    >
                        {/* Optional step number or icon inside the circle */}
                        {index + 1 <= currentStep && (
                            <span className="material-symbols-outlined text-white">
                                check
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Step labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                {steps.map((step, index) => (
                    <div key={index}>{step.label}</div>
                ))}
            </div>
        </div>
    );
};

const validateSection = (section, formData, formConfig) => {
    const errors = {};
    let hasErrors = false;

    // const [section1, section2] = sections;

    formConfig[section].forEach((field) => {
        if (field.required && !formData[section][field.name]?.trim()) {
            errors[field.name] = `${field.label} is required`;
            hasErrors = true;
        }
    });

    return { errors, hasErrors };
};

// Individual section components

// Example of updating the ApplicationSection component
const ApplicationSection = ({ formData, handleInputChange, nextStep }) => {
    const [errors, setErrors] = useState({});

    return (
        <form className="w-[75%] sm:w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Application Details</h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.APPLICATION]}
                section={FORM_SECTIONS.APPLICATION}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />
            <NavigationButtons
                isFirst={true}
                isLast={false}
                prevStep={() => {}}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.APPLICATION]}
            />
        </form>
    );
};

const PersonalSection = ({
    formData,
    handleInputChange,
    prevStep,
    nextStep,
}) => {
    const [errors, setErrors] = useState({});

    return (
        <form className="w-[75%] sm:w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Personal Information</h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.PERSONAL]}
                section={FORM_SECTIONS.PERSONAL}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />
            <NavigationButtons
                isFirst={false}
                isLast={false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.PERSONAL]}
            />
        </form>
    );
};

const EducationSection = ({
    formData,
    handleInputChange,
    prevStep,
    nextStep,
}) => {
    const [errors, setErrors] = useState({});

    return (
        <form className="w-[75%] sm:w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Educational Background</h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.EDUCATION]}
                section={FORM_SECTIONS.EDUCATION}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />
            <NavigationButtons
                isFirst={false}
                isLast={false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.EDUCATION]}
            />
        </form>
    );
};

const FamilySection = ({
    formData,
    setFormData,
    handleInputChange,
    prevStep,
    nextStep,
    handleRenewSubmit,
    isLast,
}) => {
    const [errors, setErrors] = useState({});

    // Function to update the family-related data in the main form state
    // Use useCallback to prevent this from being recreated on every render
    const updateFamilyData = useCallback(
        (familyData) => {
            setFormData((prevData) => ({
                ...prevData,
                ...familyData, // This will add/update familyMembers, tzuChiScholars, and assistanceList
            }));
        },
        [setFormData]
    );

    return (
        <form className="w-[80%] sm:w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Family Information</h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.FAMILY]}
                section={FORM_SECTIONS.FAMILY}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            <h2 className="py-10 font-bold">
                Contact Person In Case of Emergency
            </h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.CONTACT_PERSON]}
                section={FORM_SECTIONS.FAMILY}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            {/* Pass formData and update function to FamilyList */}
            <div>
                <FamilyList
                    formData={formData}
                    updateFormData={updateFamilyData}
                />
            </div>

            <NavigationButtons
                isFirst={false}
                isLast={isLast || false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                handleRenewSubmit={handleRenewSubmit}
                sections={[FORM_SECTIONS.FAMILY, FORM_SECTIONS.CONTACT_PERSON]}
            />
        </form>
    );
};

const RequirementsSection = ({
    formData,
    setFormData,
    prevStep,
    handleSubmit,
}) => {
    // Function to update the files-related data in the main form state
    const updateFilesData = useCallback(
        (filesData) => {
            setFormData((prevData) => ({
                ...prevData,
                ...filesData, // This will add/update uploaded_files
            }));
        },
        [setFormData]
    );

    return (
        <div className="w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-12 font-bold">Requirements</h2>
            <FileUploadForm
                formData={formData}
                updateFilesData={updateFilesData}
            />
            <NavigationButtons
                isFirst={false}
                isLast={true}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                sections={null}
            />
        </div>
    );
};

// Main form container component
function ApplicationForm({ includeRequirements = true }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false); // For showing a loading spinner or message
    const [error, setError] = useState(null); // For displaying error messages

    // Define steps based on whether requirements are included
    const steps = [
        { label: "Application", section: FORM_SECTIONS.APPLICATION },
        { label: "Personal", section: FORM_SECTIONS.PERSONAL },
        { label: "Education", section: FORM_SECTIONS.EDUCATION },
        { label: "Family", section: FORM_SECTIONS.FAMILY },
    ];

    // Add requirements step if needed
    if (includeRequirements) {
        steps.push({
            label: "Requirements",
            section: FORM_SECTIONS.REQUIREMENTS,
        });
    }

    // Total number of steps in the form
    const totalSteps = steps.length;

    // Consolidated form state
    const [formData, setFormData] = useState({
        application_info: generateInitialState(
            formConfig[FORM_SECTIONS.APPLICATION]
        ),
        personal_information: generateInitialState(
            formConfig[FORM_SECTIONS.PERSONAL]
        ),
        educational_background: generateInitialState(
            formConfig[FORM_SECTIONS.EDUCATION]
        ),
        parents_guardian: generateInitialState(
            formConfig[FORM_SECTIONS.FAMILY]
        ),
        contact_person: generateInitialState(
            formConfig[FORM_SECTIONS.CONTACT_PERSON]
        ),
        // Initialize the family-related data
        family_members: [],
        tzu_chi_siblings: [],
        other_assistance: [],
        // Initialize the files-related data
        uploaded_files: [],
    });

    // Generic handler for input changes
    const handleInputChange = (section, e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [name]: value,
            },
        }));
    };

    // Navigation functions
    const nextStep = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleRenewSubmit = (e) => {
        e.preventDefault();
        // setFormData(formData.application_info.status = 'Old');
        console.log(`Form Submitted:\n${JSON.stringify(formData, null, 2)}`);
    };

    // Handle final form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.application_info.status = 'New';
        console.log(`Form Submitted:\n${JSON.stringify(formData, null, 2)}`);
    
        const submitStudentData = async () => {
            try {
                setLoading(true);
    
                const formDataToSend = new FormData();
    
                // Separate application data (excluding files)
                const applicationData = { ...formData };
                delete applicationData.uploaded_files;
    
                formDataToSend.append(
                    'applicationData',
                    JSON.stringify(applicationData)
                );
    
                // Append files one by one
                if (formData.uploaded_files && formData.uploaded_files.length > 0) {
                    formData.uploaded_files.forEach((fileItem) => {
                        // If we have the actual file object stored in fileObj property
                        if (fileItem.fileObj) {
                            formDataToSend.append('files[]', fileItem.fileObj);
                        }
                        // Also send the filename format as a separate key
                        formDataToSend.append('fileInfo[]', JSON.stringify({ 
                            filename: fileItem.filename 
                        }));
                    });
                }
    
                const response = await axios.post(
                    "http://localhost:8000/backend/api/applications",
                    formDataToSend,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
    
                console.log("Server response:", response.data);
                toast.success("Application submitted successfully!");
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } catch (err) {
                console.error("Error submitting data:", err);
                setError("Failed to submit. Please try again.");
                toast.error("Failed to submit application. Please try again.");
                setLoading(false);
            }
        };
    
        submitStudentData();
    };
    
    console.log(formData);

    // Render form step components
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ApplicationSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <PersonalSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                );
            case 3:
                return (
                    <EducationSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                );
            case 4:
                if (includeRequirements) {
                    return (
                        <FamilySection
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            prevStep={prevStep}
                            nextStep={nextStep}
                        />
                    );
                } else {
                    return (
                        <FamilySection
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            prevStep={prevStep}
                            nextStep={nextStep}
                            handleRenewSubmit={handleRenewSubmit}
                            isLast={true}
                        />
                    );
                }
            // return (
            //     <FamilySection
            //         formData={formData}
            //         setFormData={setFormData}
            //         handleInputChange={handleInputChange}
            //         prevStep={prevStep}
            //         nextStep={nextStep}
            //     />
            // );
            case 5:
                // Only render if requirements are included
                if (includeRequirements) {
                    return (
                        <RequirementsSection
                            formData={formData}
                            setFormData={setFormData}
                            prevStep={prevStep}
                            handleSubmit={handleSubmit}
                        />
                    );
                }
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Add Toaster component for notifications */}
            <Toaster position="top-center" />

            <ProgressIndicator steps={steps} currentStep={currentStep} />
            {renderStep()}
        </div>
    );
}

// For reuse in different contexts
function NewApplicationForm() {
    return <ApplicationForm includeRequirements={true} />;
}

function RenewalApplicationForm() {
    return <ApplicationForm includeRequirements={false} />;
}

export { ApplicationForm, NewApplicationForm, RenewalApplicationForm };
