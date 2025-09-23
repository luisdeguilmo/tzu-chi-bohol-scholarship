// config/coursesConfig.js
export const coursesTableConfig = {
    headers: [
        { name: "course", label: "Courses" },
        { name: "actions", label: "Actions" },
    ],
    fields: [
        {
            name: "course",
            type: "text",
            placeholder: "Enter course name",
            required: true,
            className: "pl-5 py-3 text-left whitespace-nowrap text-gray-500",
        },
    ],
    primaryField: "course",
    searchFields: ["course"],
};