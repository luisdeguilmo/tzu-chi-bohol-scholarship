import React, { useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import { strandsTableConfig } from "../../../constant/scholarshipCriteria/strandsTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "../../../components/ScholarshipCriteria/ScholarshipCriteriaTable";

const Strands = ({ label = "Strands" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Custom hooks
    const {
        items: strands,
        loading,
        error,
        fetchItems: fetchStrands,
        updateItem: updateStrand,
        deleteItem: deleteStrand,
    } = useScholarshipCriteria("strands", "Strand");

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredStrands = strands.filter((strand) =>
        strandsTableConfig.searchFields.some((field) =>
            strand[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const paginationState = usePagination(filteredStrands, 5);

    // Event handlers
    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = strandsTableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateStrand(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteStrand(id);
        if (
            success &&
            paginationState.currentItems.length === 1 &&
            paginationState.currentPage > 1
        ) {
            paginationState.goToPreviousPage();
        }
    };

    const editState = {
        isEditing,
        editData,
        onFieldChange: updateEditData,
        onSave: handleSave,
        onStartEdit: startEdit,
        onDelete: handleDelete,
    };

    return (
        <ScholarshipCriteriaTable
            label={label}
            items={strands}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchStrands}
            tableConfig={strandsTableConfig}
            formFields={scholarshipCriteriaInputFields.strandInputField}
            editState={editState}
            paginationState={paginationState}
        />
    );
};

export default Strands;
