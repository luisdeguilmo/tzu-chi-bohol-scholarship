import React, { useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import { requirementsTableConfig } from "../../../constant/scholarshipCriteria/scholarshipCriteriaTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "../../../components/ScholarshipCriteria/ScholarshipCriteriaTable";

const Requirements = ({ label = "Requirements" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 5;
    // Custom hooks
    const {
        items: requirements,
        loading,
        error,
        fetchItems: fetchRequirements,
        updateItem: updateRequirement,
        deleteItem: deleteRequirement,
    } = useScholarshipCriteria("requirements", "Requirement");

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredRequirements = requirements.filter((requirement) =>
        requirementsTableConfig.searchFields.some((field) =>
            requirement[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const paginationState = usePagination(filteredRequirements, itemsPerPage);

    // Event handlers
    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = requirementsTableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateRequirement(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteRequirement(id);

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
            items={requirements}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchRequirements}
            tableConfig={requirementsTableConfig}
            formFields={scholarshipCriteriaInputFields.requirementInputFields}
            editState={editState}
            paginationState={paginationState}
        />
    );
};

export default Requirements;
