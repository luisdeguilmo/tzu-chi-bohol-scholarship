// components/CriteriaTable.jsx
import React, { useMemo } from 'react';
import SearchInput from './SearchInput';
import ScholarshipCriteriaTableRow from './ScholarshipCriteriaTableRow';
import EmptyState from '../EmptyState';
import Pagination from '../Pagination';
import FormModal from '../../pages/Staff/ScholarshipCriteria/FormModal';

const ScholarshipCriteriaTable = ({
    label,
    items,
    loading,
    error,
    searchTerm,
    onSearchChange,
    onRefresh,
    tableConfig, // Configuration object for table structure
    formFields,
    editState,
    paginationState,
}) => {
    const {
        headers,
        fields,
        primaryField,
        searchFields,
    } = tableConfig;

    const {
        isEditing,
        editData,
        onFieldChange,
        onSave,
        onStartEdit,
    } = editState;

    const {
        currentItems,
        currentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = paginationState;

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Filter items based on search term across multiple fields
    const filteredItems = useMemo(() => 
        items.filter((item) =>
            searchFields.some(field => 
                item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        ), [items, searchTerm, searchFields]
    );

    const handleDelete = async (id) => {
        const success = await onDelete(id);
        if (success && currentItems.length === 1 && currentPage > 1) {
            goToPreviousPage();
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-md shadow-md p-6">
                <div className="text-center py-10">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-md shadow-md p-6">
                <div className="text-center py-10 text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-md shadow-md p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{label}</h3>
                <SearchInput
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    placeholder={`Search ${label.toLowerCase()}...`}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-gray-700 font-bold">
                        <tr>
                            {headers.map((header, index) => (
                                <th 
                                    key={header.name}
                                    className={`py-3 text-xs uppercase tracking-wider ${
                                        index === 0 ? 'pl-20 text-left' :
                                        index === headers.length - 1 ? 'pr-14 text-right' :
                                        'text-center'
                                    }`}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <ScholarshipCriteriaTableRow
                                key={item.id}
                                item={item}
                                index={index}
                                numberOfItemsPerPage={numberOfItemsPerPage}
                                isEditing={isEditing(item.id)}
                                editData={editData}
                                onFieldChange={onFieldChange}
                                onSave={onSave}
                                onDelete={handleDelete}
                                onStartEdit={onStartEdit}
                                fields={fields}
                                primaryField={primaryField}
                            />
                        ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState 
                        message={`No ${label.toLowerCase()} found. Try adjusting your search or add a new ${label.toLowerCase().slice(0, -1)}.`}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-6">
                <FormModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    onSuccess={onRefresh}
                    label={label}
                    fields={formFields}
                />
                
                {filteredItems.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevious={goToPreviousPage}
                        onNext={goToNextPage}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={filteredItems.length}
                        itemLabel={label.toLowerCase()}
                    />
                )}
            </div>
        </div>
    );
};

export default ScholarshipCriteriaTable;