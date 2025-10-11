const familyMembersInputFields = [
    {
        label: "Name",
        name: "name",
        type: "text",
        placeholder: "Name",
    },
    {
        label: "Relationship",
        name: "relationship",
        type: "text",
        placeholder: "Relationship",
    },
    {
        label: "Age",
        name: "age",
        type: "number",
        placeholder: "Age",
    },
    {
        label: "Gender",
        name: "gender",
        type: "select",
        options: ["", "Male", "Female"],
        placeholder: "Gender",
    },
    {
        label: "Civil Status",
        name: "civil_status",
        type: "text",
        placeholder: "Civil Status",
    },
    {
        label: "Education/Occupation",
        name: "education_occupation",
        type: "text",
        placeholder: "Education Attainment/Occupation & Company Name",
    },
    {
        label: "Monthly Income",
        name: "monthly_income",
        type: "number",
        placeholder: "Monthly Income",
    },
    {
        label: "Living w/ Family or Not?",
        name: "living_with_family",
        type: "select",
        options: ["", "Living with family", "Not living with family"],
    },
];

export default familyMembersInputFields;
