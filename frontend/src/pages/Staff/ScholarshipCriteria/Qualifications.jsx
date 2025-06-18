import React, { useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import { qualificationsTableConfig } from "../../../constant/scholarshipCriteria/scholarshipCriteriaTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "../../../components/ScholarshipCriteria/ScholarshipCriteriaTable";

const Qualifications = ({ label = "Qualifications" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 5;
    // Custom hooks
    const {
        items: qualifications,
        loading,
        error,
        fetchItems: fetchQualifications,
        updateItem: updateQualification,
        deleteItem: deleteQualification,
    } = useScholarshipCriteria("qualifications", "Qualification");

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredQualifications = qualifications.filter((qualification) =>
        qualificationsTableConfig.searchFields.some((field) =>
            qualification[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const paginationState = usePagination(filteredQualifications, itemsPerPage);

    // Event handlers
    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = qualificationsTableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateQualification(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteQualification(id);

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
            items={qualifications}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchQualifications}
            tableConfig={qualificationsTableConfig}
            formFields={scholarshipCriteriaInputFields.qualificationInputFields}
            editState={editState}
            paginationState={paginationState}
        />
    );
};

export default Qualifications;
