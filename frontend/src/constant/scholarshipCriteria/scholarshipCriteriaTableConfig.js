// config/strandsConfig.js
export const strandsTableConfig = {
    headers: [
        { name: 'strand', label: 'Strands' },
        { name: 'description', label: 'Description' },
        { name: 'actions', label: 'Actions' }
    ],
    fields: [
        {
            name: 'strand',
            type: 'text',
            placeholder: 'Enter strand name',
            required: true,
            className: 'pl-5 py-3 text-left whitespace-nowrap text-gray-500'
        },
        {
            name: 'description',
            type: 'textarea',
            rows: 3,
            placeholder: 'Enter description',
            required: true,
            className: 'p-3 text-gray-500',
            displayClassName: 'py-3 max-w-md break-words text-gray-500'
        }
    ],
    primaryField: 'strand',
    searchFields: ['strand', 'description']
};

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

export const qualificationsTableConfig = {
    headers: [
        { name: "qualification", label: "Qualifications" },
        { name: "actions", label: "Actions" },
    ],
    fields: [
        {
            name: "qualification",
            type: "text",
            placeholder: "Enter qualification name",
            required: true,
            className: "pl-5 py-3 text-left whitespace-nowrap text-gray-500",
        },
    ],
    primaryField: "qualification",
    searchFields: ["qualification"],
};

// config/strandsConfig.js
export const requirementsTableConfig = {
    headers: [
        { name: 'quantity', label: 'Quantity' },
        { name: 'description', label: 'Description' },
        { name: 'submit', label: 'Submit During' },
        { name: "actions", label: "Actions" },
    ],
    fields: [
        {
            name: 'quantity',
            type: 'text',
            placeholder: 'Enter quantity',
            required: true,
            className: 'pl-5 py-3 text-left whitespace-nowrap text-gray-500'
        },
        {
            name: 'description',
            type: 'textarea',
            rows: 3,
            placeholder: 'Enter description',
            required: true,
            className: 'p-3 text-gray-500',
            displayClassName: 'py-3 max-w-md break-words text-gray-500'
        },
        {
            name: 'submit',
            type: 'text',
            placeholder: 'Enter submit during',
            required: true,
            className: 'pl-5 py-3 text-left whitespace-nowrap text-gray-500'
        },
    ],
    primaryField: 'quantity',
    searchFields: ['quantity', 'description', 'submit']
};

export const proceduresTableConfig = {
    headers: [
        { name: "procedure", label: "Procedures" },
        { name: "actions", label: "Actions" },
    ],
    fields: [
        {
            name: "procedure",
            type: "text",
            placeholder: "Enter procedure",
            required: true,
            className: "pl-5 py-3 text-left whitespace-nowrap text-gray-500",
        },
    ],
    primaryField: "procedure",
    searchFields: ["procedure"],
};

export const instructionsTableConfig = {
    headers: [
        { name: "instruction", label: "Instructions" },
        { name: "actions", label: "Actions" },
    ],
    fields: [
        {
            name: "instruction",
            type: "text",
            placeholder: "Enter instruction",
            required: true,
            className: "pl-5 py-3 text-left whitespace-nowrap text-gray-500",
        },
    ],
    primaryField: "instruction",
    searchFields: ["instruction"],
};