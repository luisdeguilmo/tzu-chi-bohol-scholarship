const familyMembersInputFields = [
    {
        label: "Name",
        name: "name",
        type: "text",
        placeholder: "Enter name",
        validate: "lettersOnly",
    },
    {
        label: "Relationship",
        name: "relationship",
        type: "select",
        options: ["", "Brother", "Sister", "Other"],
        placeholder: "Relationship",
    },
    {
        label: "Age",
        name: "age",
        type: "text",
        placeholder: "Age",
        validate: "numbersOnly",
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
        type: "select",
        options: ["", "Single", "Married", "Divorced", "Widowed", "Separated"],
        placeholder: "Civil Status",
    },
    {
        label: "Education/Occupation",
        name: "education_occupation",
        type: "text",
        placeholder: "Enter details",
        validate: "lettersOnly",
    },
    {
        label: "Monthly Income",
        name: "monthly_income",
        type: "text",
        placeholder: "Enter amount",
        validate: "numbersOnly",
    },
    {
        label: "Living with Family",
        name: "living_with_family",
        type: "select",
        options: ["", "Yes", "No"],
    },
];

export default familyMembersInputFields;
