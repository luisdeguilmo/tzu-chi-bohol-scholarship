import React, { useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import { coursesTableConfig } from "../../../constant/scholarshipCriteria/scholarshipCriteriaTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "../../../components/ScholarshipCriteria/ScholarshipCriteriaTable";

const Courses = ({ label = "Courses" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 5;
    // Custom hooks
    const {
        items: courses,
        loading,
        error,
        fetchItems: fetchCourses,
        updateItem: updateCourse,
        deleteItem: deleteCourse,
    } = useScholarshipCriteria("courses", "Course");

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredCourses = courses.filter((course) =>
        coursesTableConfig.searchFields.some((field) =>
            course[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination
    const paginationState = usePagination(filteredCourses, itemsPerPage);

    // Event handlers
    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = coursesTableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateCourse(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteCourse(id);

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
            items={courses}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchCourses}
            tableConfig={coursesTableConfig}
            formFields={scholarshipCriteriaInputFields.courseInputField}
            editState={editState}
            paginationState={paginationState}
        />
    );
};

export default Courses;
