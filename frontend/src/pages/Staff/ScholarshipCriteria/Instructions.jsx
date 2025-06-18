import React, { useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import { instructionsTableConfig } from "../../../constant/scholarshipCriteria/scholarshipCriteriaTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "../../../components/ScholarshipCriteria/ScholarshipCriteriaTable";

const Instructions = ({ label = "Instructions" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 5;
    // Custom hooks
    const {
        items: instructions,
        loading,
        error,
        fetchItems: fetchInstructions,
        updateItem: updateInstruction,
        deleteItem: deleteInstruction,
    } = useScholarshipCriteria("instructions", "Instruction");

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredInstructions = instructions.filter((instruction) =>
        instructionsTableConfig.searchFields.some((field) =>
            instruction[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const paginationState = usePagination(filteredInstructions, itemsPerPage);

    // Event handlers
    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = instructionsTableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateInstruction(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteInstruction(id);

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
            items={instructions}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchInstructions}
            tableConfig={instructionsTableConfig}
            formFields={scholarshipCriteriaInputFields.instructionInputFields}
            editState={editState}
            paginationState={paginationState}
        />
    );
};

export default Instructions;
