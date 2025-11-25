const scholarsInputFields = [
    {
        label: "Name",
        name: "name",
        type: "text",
        placeholder: "Enter name",
        validate: "lettersOnly",
    },
    {
        label: "Year Level",
        name: "year_level",
        type: "text",
        placeholder: "e.g., 1st Year",
        validate: "lettersNumbers",
    },
    {
        label: "School",
        name: "school",
        type: "text",
        placeholder: "School name",
        validate: "lettersOnly",
    },
    {
        label: "Course",
        name: "course",
        type: "text",
        placeholder: "Course name",
        validate: "lettersOnly",
    },
    {
        label: "School Year Last Attended",
        name: "school_year",
        type: "text",
        placeholder: "e.g., 2024-2025",
        validate: "lettersNumbers",
    },
];

export default scholarsInputFields;