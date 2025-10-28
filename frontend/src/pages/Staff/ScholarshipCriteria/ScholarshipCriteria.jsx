import { useEffect, useState } from "react";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import { usePagination } from "../../../hooks/usePagination";
import { useTableEdit } from "../../../hooks/useTableEdit";
import {
    strandsTableConfig,
    coursesTableConfig,
    qualificationsTableConfig,
    requirementsTableConfig,
    proceduresTableConfig,
    instructionsTableConfig,
} from "../../../constant/scholarshipCriteria/scholarshipCriteriaTableConfig";
import scholarshipCriteriaInputFields from "../../../constant/scholarshipCriteria/scholarshipCriteriaInputFields";
import ScholarshipCriteriaTable from "./ScholarshipCriteriaTable";
import { scholarshipCriteriaButtons } from "../../../constant/tableToolbarButtons";

const ScholarshipCriteria = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortBy, setSortBy] = useState("newest");
    const [activeTab, setActiveTab] = useState("strands");

    const [endPoint, setEndPoint] = useState(activeTab);
    const [entityName, setEntityName] = useState("Strands");
    const [tableConfig, setTableConfig] = useState(strandsTableConfig);
    const [inputFields, setInputFields] = useState(
        scholarshipCriteriaInputFields.strandInputField
    );

    useEffect(() => {
        if (activeTab === "strands") {
            setInputFields(scholarshipCriteriaInputFields.strandInputField);
            setTableConfig(strandsTableConfig);
        }
        if (activeTab === "courses") {
            setInputFields(scholarshipCriteriaInputFields.courseInputField);
            setTableConfig(coursesTableConfig);
        }
        if (activeTab === "qualifications") {
            setInputFields(
                scholarshipCriteriaInputFields.qualificationInputFields
            );
            setTableConfig(qualificationsTableConfig);
        }
        if (activeTab === "requirements") {
            setInputFields(
                scholarshipCriteriaInputFields.requirementInputFields
            );
            setTableConfig(requirementsTableConfig);
        }
        if (activeTab === "procedures") {
            setInputFields(scholarshipCriteriaInputFields.procedureInputFields);
            setTableConfig(proceduresTableConfig);
        }
        if (activeTab === "instructions") {
            setInputFields(
                scholarshipCriteriaInputFields.instructionInputFields
            );
            setTableConfig(instructionsTableConfig);
        }

        fetchItems();
    }, [activeTab]);

    const { items, loading, error, fetchItems, updateItem, deleteItem } =
        useScholarshipCriteria(endPoint, entityName);

    const { editData, updateEditData, startEdit, cancelEdit, isEditing } =
        useTableEdit();

    // Filter strands based on search term
    const filteredItems = items.filter((strand) =>
        tableConfig.searchFields.some((field) =>
            strand[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at) - new Date(a.created_at);
            case "oldest":
                return new Date(a.created_at) - new Date(b.created_at);
            case "name":
                return a.first_name.localeCompare(b.first_name);
            default:
                return 0;
        }
    });

    // Pagination
    const paginationState = usePagination(sortedItems, itemsPerPage);

    const { currentPage, setCurrentPage, setNumberOfItemsPerPage } =
        paginationState;

    const getTabName = (tab) => {
        const button = scholarshipCriteriaButtons.find(
            (button) => button.tabName === tab
        );
        return button.name;
    };

    const handleChangeTab = async (tab) => {
        setEntityName(getTabName(tab));
        setActiveTab(tab);
        await fetchItems();
        setEndPoint(tab);
        setCurrentPage(1);
        setNumberOfItemsPerPage(0);
    };

    const handleSave = async (id) => {
        // Validate required fields
        const requiredFields = tableConfig.fields.filter(
            (field) => field.required
        );
        const hasEmptyRequired = requiredFields.some(
            (field) => !editData[field.name]?.trim()
        );

        if (hasEmptyRequired) {
            cancelEdit();
            return;
        }

        const success = await updateItem(id, editData);
        if (success) {
            cancelEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteItem(id);

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
            label={entityName}
            searchPlaceholder={endPoint}
            items={items}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchItems}
            tableConfig={tableConfig}
            editItem={updateItem}
            deleteItem={handleDelete}
            formFields={inputFields}
            paginationState={paginationState}
            sortBy={sortBy}
            itemsPerPage={itemsPerPage}
            setSortBy={setSortBy}
            setItemsPerPage={setItemsPerPage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleChangeTab={handleChangeTab}
            currentPage={currentPage}
            onNumberOfItemsPerPageChange={setNumberOfItemsPerPage}
            sortedItems={sortedItems}
        />
    );
};

export default ScholarshipCriteria;
