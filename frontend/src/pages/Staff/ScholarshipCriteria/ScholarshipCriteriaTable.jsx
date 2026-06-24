// components/CriteriaTable.jsx
import React, { useMemo, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import FormModal from "./FormModal";
import { scholarshipCriteriaButtons } from "../../../constant/tableToolbarButtons";
import Table from "../../../components/Table";
import TableToolbar from "../../../components/TableToolbar";
import { useCriteria } from "../../../context/CriteriaContext";
import ScholarshipCriteriaTableRow from "./ScholarshipCriteriaTableRow";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { Plus } from "lucide-react";
import ConfirmationModal from "../../../components/ConfirmationModal";

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
    editState,
    deleteItem,
    paginationState,
    sortBy,
    itemsPerPage,
    setSortBy,
    setItemsPerPage,
    activeTab,
    handleChangeTab,
    currentPage,
    setCurrentPage,
    sortedItems,
    onUpdateVisibility,
    filter,
    setFilter,
}) => {
    const { headers, fields, primaryField, searchFields } = tableConfig;
    const { setId, setText, setQuantity, setDescription, setSubmit } =
        useCriteria();
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const {
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        setNumberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = paginationState;

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Filter items based on search term across multiple fields
    const filteredItems = useMemo(
        () =>
            items.filter((item) =>
                searchFields.some((field) =>
                    item[field]
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                ),
            ),
        [items, searchTerm, searchFields],
    );

    const handleRefresh = () => {
        onRefresh();
    };

    const handleItemToEdit = (item) => {
        if ("strand" in item) {
            setText(item.strand);
            setDescription(item.description);
        } else if ("quantity" in item) {
            setQuantity(item.quantity);
            setDescription(item.description);
            setSubmit(item.submit);
        } else if ("instruction" in item) {
            setDescription(item.instruction);
        } else if (
            "course" in item ||
            "qualification" in item ||
            "procedure" in item
        ) {
            setText(item[searchPlaceholder.slice(0, -1)]);
        }
        setId(item.id);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-4 md:p-6">
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
                    onChangeCurrentPage={setCurrentPage}
                    onChangeNumberOfItemsPerPage={setNumberOfItemsPerPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    onOpen={setIsModalOpen}
                    addButton={true}
                    button={{
                        icon: <Plus className="w-4 h-4 text-white" />,
                        label: `Add New ${label.slice(0, -1)}`,
                    }}
                >
                    {label === "Courses" && (
                        <div className="flex justify-between items-center gap-2">
                            <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                                Filter:
                            </span>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="all">All</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    )}
                </TableToolbar>

                {/* Table */}
                <div
                    className={`${isMobile && "flex flex-col gap-2"} overflow-x-auto rounded-sm`}
                >
                    {isMobile ? (
                        currentItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-4 border rounded-md bg-gray-50"
                            >
                                <div className="space-y-2">
                                    {headers.map((header, index) => (
                                        <p
                                            key={index}
                                            className="text-xs font-bold text-gray-800"
                                        >
                                            {header.name[0]
                                                .toUpperCase()
                                                .concat(
                                                    header.name
                                                        .substring(
                                                            1,
                                                            header.name.length,
                                                        )
                                                        .toLowerCase(),
                                                )}
                                        </p>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-normal text-gray-600">
                                        <span className="">
                                            {item[primaryField]}
                                        </span>
                                    </p>
                                    {fields
                                        .filter(
                                            (field) =>
                                                field.name !== primaryField,
                                        )
                                        .map((field) => (
                                            <p
                                                key={field.name}
                                                className={`text-xs font-normal text-gray-600`}
                                            >
                                                <span className="">
                                                    {field.render
                                                        ? field.render(
                                                              item[field.name],
                                                          )
                                                        : item[field.name]}
                                                </span>
                                            </p>
                                        ))}
                                    <button
                                        onClick={() => handleItemToEdit(item)}
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
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsConfirmationModalOpen(true);
                                            setSelectedId(item.id);
                                        }}
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
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Table hasNumberColumn={true} tableHeaders={headers}>
                            <ScholarshipCriteriaTableRow
                                numberOfItemsPerPage={numberOfItemsPerPage}
                                fields={fields}
                                primaryField={primaryField}
                                currentItems={currentItems}
                                onSelectItem={handleItemToEdit}
                                onSelectedId={setSelectedId}
                                onOpenConfirmationModal={
                                    setIsConfirmationModalOpen
                                }
                                onDelete={deleteItem}
                                onUpdateVisibility={onUpdateVisibility}
                            />
                        </Table>
                    )}

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
                setIsEditing={setIsEditing}
                onEdit={setIsEditing}
                setIsOpen={setIsModalOpen}
                onSuccess={onRefresh}
                label={label.slice(0, -1)}
                endpoint={searchPlaceholder.slice(0, -1)}
                fields={formFields}
                updateItem={editItem}
            />

            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                isLoading={loading}
                label={"Confirmation"}
                message={"Are you sure you want to delete this item?"}
                onClick={() => {
                    const success = deleteItem(selectedId);

                    if (success) {
                        setIsConfirmationModalOpen(false);
                    }
                }}
            />
        </div>
    );
};

export default ScholarshipCriteriaTable;
