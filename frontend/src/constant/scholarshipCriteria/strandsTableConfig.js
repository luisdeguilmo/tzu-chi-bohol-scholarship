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
            className: 'pl-5 py-3 text-left whitespace-nowrap text-gray-500'
        },
        {
            name: 'description',
            type: 'textarea',
            rows: 3,
            placeholder: 'Enter description',
            className: 'p-3 text-gray-500',
            displayClassName: 'py-3 max-w-md break-words text-gray-500'
        }
    ],
    primaryField: 'strand',
    searchFields: ['strand', 'description']
};

// // config/gradeRequirementsConfig.js
// export const gradeRequirementsTableConfig = {
//     headers: [
//         { name: 'level', label: 'Grade Level' },
//         { name: 'min_gpa', label: 'Minimum GPA' },
//         { name: 'description', label: 'Requirements' },
//         { name: 'actions', label: 'Actions' }
//     ],
//     fields: [
//         {
//             name: 'level',
//             type: 'text',
//             placeholder: 'e.g., Grade 11, Grade 12',
//             className: 'pl-5 py-3 text-left whitespace-nowrap text-gray-500'
//         },
//         {
//             name: 'min_gpa',
//             type: 'number',
//             step: '0.01',
//             min: '0',
//             max: '4.0',
//             placeholder: '0.00',
//             className: 'py-3 text-center text-gray-500',
//             render: (value) => parseFloat(value).toFixed(2)
//         },
//         {
//             name: 'description',
//             type: 'textarea',
//             rows: 2,
//             placeholder: 'Additional requirements...',
//             className: 'p-3 text-gray-500',
//             displayClassName: 'py-3 max-w-md break-words text-gray-500'
//         }
//     ],
//     primaryField: 'level',
//     searchFields: ['level', 'description']
// };