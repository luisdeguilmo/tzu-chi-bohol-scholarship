// components/CriteriaTableRow.jsx
import React from 'react';

const ScholarshipCriteriaTableRow = ({ 
    item, 
    index, 
    numberOfItemsPerPage,
    isEditing,
    editData,
    onFieldChange,
    onSave,
    onDelete,
    onStartEdit,
    fields, // Array of field configurations
    primaryField, // The main field to display in first column
}) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors text-center text-xs">
            {/* First column - primary field */}
            {isEditing ? (
                <td className="pl-5 py-3 text-left whitespace-nowrap text-gray-500">
                    <input
                        className="w-full p-2 border-[1px] outline-green-500"
                        type="text"
                        onChange={(e) => onFieldChange(primaryField, e.target.value)}
                        value={editData[primaryField] || ''}
                    />
                </td>
            ) : (
                <td className="pl-5 py-3 text-left whitespace-nowrap text-gray-500">
                    {`${numberOfItemsPerPage + index + 1}.`} {item[primaryField]}
                </td>
            )}
            
            {/* Dynamic columns based on fields configuration */}
            {fields.filter(field => field.name !== primaryField).map(field => (
                <td key={field.name} className={field.className || "py-3 text-gray-500"}>
                    {isEditing ? (
                        field.type === 'textarea' ? (
                            <textarea
                                rows={field.rows || 3}
                                className="w-full p-2 resize-none text-justify border-[1px] outline-green-500"
                                onChange={(e) => onFieldChange(field.name, e.target.value)}
                                value={editData[field.name] || ''}
                                placeholder={field.placeholder}
                            />
                        ) : (
                            <input
                                type={field.type || 'text'}
                                className="w-full p-2 border-[1px] outline-green-500"
                                onChange={(e) => onFieldChange(field.name, e.target.value)}
                                value={editData[field.name] || ''}
                                placeholder={field.placeholder}
                            />
                        )
                    ) : (
                        <span className={field.displayClassName}>
                            {field.render ? field.render(item[field.name]) : item[field.name]}
                        </span>
                    )}
                </td>
            ))}
            
            {/* Actions column */}
            <td className="pr-5 py-3 text-right whitespace-nowrap">
                <button
                    onClick={() => {
                        if (isEditing) {
                            onSave(item.id);
                        } else {
                            const initialData = {};
                            fields.forEach(field => {
                                initialData[field.name] = item[field.name];
                            });
                            onStartEdit(item.id, initialData);
                        }
                    }}
                    className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    {isEditing ? "Save Changes" : "Edit"}
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="inline-flex items-center text-red-600 hover:text-red-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                        />
                    </svg>
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ScholarshipCriteriaTableRow;