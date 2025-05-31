// config/coursesConfig.js
export const coursesTableConfig = {
    headers: [
        { name: "course", label: "Courses" },
        { name: "code", label: "Course Code" },
        { name: "description", label: "Description" },
        { name: "credits", label: "Credits" },
        { name: "actions", label: "Actions" },
    ],
    fields: [
        {
            name: "course",
            type: "text",
            placeholder: "Enter course name",
            className: "pl-5 py-3 text-left whitespace-nowrap text-gray-500",
        },
        {
            name: "code",
            type: "text",
            placeholder: "Enter course code",
            className: "py-3 text-center text-gray-500",
            displayClassName: "font-mono text-sm",
        },
        {
            name: "description",
            type: "textarea",
            rows: 2,
            placeholder: "Enter description",
            className: "p-3 text-gray-500",
            displayClassName: "py-3 max-w-md break-words text-gray-500",
        },
        {
            name: "credits",
            type: "number",
            placeholder: "Credits",
            className: "py-3 text-center text-gray-500",
            render: (value) => `${value} ${value === 1 ? "credit" : "credits"}`,
        },
    ],
    primaryField: "course",
    searchFields: ["course", "code", "description"],
};