// components/CriteriaTable.jsx
import React, { useMemo, useState } from "react";
import ScholarshipCriteriaTableRow from "./TableRow";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import FormModal from "./FormModal";
import { scholarshipCriteriaButtons } from "../../../constant/tableToolbarButtons";
import Table from "../../../components/Table";
import TableToolbar from "../../../components/TableToolbar";
import { useCriteria } from "../../../context/CriteriaContext";

const ScholarshipCriteriaTable = ({
    label,
    searchPlaceholder,
    items,
    loading,
    error,
    searchTerm,
    onSearchChange,
    onRefresh,
    tableConfig, // Configuration object for table structure
    formFields,
    editItem,
    paginationState,
    sortBy,
    itemsPerPage,
    setSortBy,
    setItemsPerPage,
    activeTab,
    handleChangeTab,
    currentPage,
    sortedItems,
}) => {
    const { headers, fields, primaryField, searchFields } = tableConfig;
    const { setId, setText, setQuantity, setDescription, setSubmit } =
        useCriteria();

    // const {
    //     isEditing,
    //     editData,
    //     onFieldChange,
    //     onSave,
    //     onStartEdit,
    //     onDelete,
    // } = editState;

    const {
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = paginationState;

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Filter items based on search term across multiple fields
    const filteredItems = useMemo(
        () =>
            items.filter((item) =>
                searchFields.some((field) =>
                    item[field]
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            ),
        [items, searchTerm, searchFields]
    );

    const handleRefresh = () => {
        fetchApplications(activeTab);
        setSelectedItems([]);
    };

    const handleDelete = async (id) => {
        const success = await onDelete(id);
        if (success && currentItems.length === 1 && currentPage > 1) {
            goToPreviousPage();
        }
    };

    const handleItemToEdit = (item) => {
        if ("strand" in item) {
            setText(item.strand);
            setDescription(item.description);
        } else if ("quantity" in item) {
            setQuantity(item.quantity);
            setDescription(item.description);
            setSubmit(item.submit);
        } else if (
            "course" in item ||
            "qualification" in item ||
            "procedure" in item ||
            "instruction" in item
        ) {
            setText(item[searchPlaceholder.slice(0, -1)]);
        }
        console.log(item);
        setId(item.id);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    // if (loading) {
    //     return (
    //         <div className="bg-white rounded-md shadow-md p-6">
    //             <div className="text-center py-10">Loading...</div>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="bg-white rounded-md shadow-md p-6">
    //             <div className="text-center py-10 text-red-500">{error}</div>
    //         </div>
    //     );
    // }

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    items={items}
                    label={label}
                    placeholder={searchPlaceholder}
                    tab={activeTab}
                    buttons={scholarshipCriteriaButtons}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedItems}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={onSearchChange}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    onOpen={setIsModalOpen}
                    addButton={true}
                />

                {/* Table */}
                <div className="overflow-x-auto rounded-sm">
                    <Table tableHeaders={headers}>
                        {" "}
                        <ScholarshipCriteriaTableRow
                            numberOfItemsPerPage={numberOfItemsPerPage}
                            fields={fields}
                            primaryField={primaryField}
                            currentItems={currentItems}
                            onSelectItem={handleItemToEdit}
                        />
                    </Table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState
                            message={`No ${label.toLowerCase()} found. Try adjusting your search or add a new ${label
                                .toLowerCase()
                                .slice(0, -1)}.`}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">
                    {filteredItems.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredItems.length}
                            itemLabel={label}
                        />
                    )}
                </div>
            </div>

            <FormModal
                isOpen={isModalOpen}
                isEditing={isEditing}
                onEdit={setIsEditing}
                setIsOpen={setIsModalOpen}
                onSuccess={onRefresh}
                label={label.slice(0, -1)}
                endpoint={searchPlaceholder.slice(0, -1)}
                fields={formFields}
                updateItem={editItem}
            />
        </div>
    );
};

export default ScholarshipCriteriaTable;
