import FORM_SECTIONS from "../application/formSections";

const formConfig = {
    [FORM_SECTIONS.APPLICATION]: [
        {
            name: "school_year",
            label: "School Year",
            type: "text",
            required: true,
        },
        // { name: "caseNo", label: "Case Number", type: "text", required: true },
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

export default formConfig;