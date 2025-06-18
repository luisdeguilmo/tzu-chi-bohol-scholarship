import React, { useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import { proceduresTableConfig } from "../../../constant/scholarshipCriteria/scholarshipCriteriaTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "../../../components/ScholarshipCriteria/ScholarshipCriteriaTable";

const Procedures = ({ label = "Procedures" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 5;
    // Custom hooks
    const {
        items: procedures,
        loading,
        error,
        fetchItems: fetchProcedures,
        updateItem: updateProcedure,
        deleteItem: deleteProcedure,
    } = useScholarshipCriteria("procedures", "Procedure");

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredProcedures = procedures.filter((procedure) =>
        proceduresTableConfig.searchFields.some((field) =>
            procedure[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const paginationState = usePagination(filteredProcedures, itemsPerPage);

    // Event handlers
    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = proceduresTableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateProcedure(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteProcedure(id);

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
            items={procedures}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchProcedures}
            tableConfig={proceduresTableConfig}
            formFields={scholarshipCriteriaInputFields.procedureInputFields}
            editState={editState}
            paginationState={paginationState}
        />
    );
};

export default Procedures;
