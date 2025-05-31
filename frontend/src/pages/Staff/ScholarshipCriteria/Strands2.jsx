import { useState, useEffect, useMemo } from "react";
import FormModal from "./FormModal";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import SearchInput from "../../../components/ScholarshipCriteria/SearchInput";
import { useStrands } from "../../../hooks/useStrands";
import { useScholarshipCriteriaTableEdit } from "../../../hooks/useScholarshipCriteriaTableEdit";
import { usePagination } from "../../../hooks/usePagination";
import StrandTableRow from "../../../components/ScholarshipCriteria/StrandTableRow";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";

const Strands = ({ label = "Strands" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        strands,
        loading,
        error,
        fetchStrands,
        updateStrand,
        deleteStrand,
    } = useStrands();

    const {
        edit,
        newText,
        newDescription,
        setNewText,
        setNewDescription,
        startStrandEdit,
        cancelStrandEdit,
        isEditing
    } = useScholarshipCriteriaTableEdit();

    const filteredStrands = useMemo(() =>
        strands.filter(
            (strand) =>
                strand.strand.toLowerCase().includes(searchTerm.toLowerCase()),
            [strands, searchTerm]
        )
    );

    const {
        currentPage,
        totalPages,
        currentItems,
        numberOfItemsPerPage,
        indexOfFirstItem,
        indexOfLastItem,
        goToNextPage,
        goToPreviousPage,
    } = usePagination(filteredStrands, 5);

    const handleEdit = async (id) => {
        if (!newText.trim() || !newDescription.trim()) {
            cancelStrandEdit();
        }

        const success = await updateStrand(id, newText, newDescription);
        if (success) {
            cancelStrandEdit();
        }
    };

    const handleDelete = async (id) => {
        const success = await deleteStrand(id);
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
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{label}</h3>

                {/* Search */}
                <SearchInput
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={`Search ${label.toLowerCase()}...`}
                />
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-gray-700 font-bold">
                        <tr>
                            <th
                                scope="col"
                                className="pl-20 py-3 text-left text-xs uppercase tracking-wider"
                            >
                                {label}
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-center text-xs uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th
                                scope="col"
                                className="pr-14 py-3 text-right text-xs uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((strand, index) => (
                            <StrandTableRow
                                key={strand.id}
                                strand={strand}
                                index={index}
                                numberOfItemsPerPage={numberOfItemsPerPage}
                                isEditing={isEditing(strand.id)}
                                newText={newText}
                                newDescription={newDescription}
                                onTextChange={setNewText}
                                onDescriptionChange={setNewDescription}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStartEdit={startStrandEdit}
                            />
                        ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState />
                )}
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <FormModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={fetchStrands}
                    label={label}
                    fields={scholarshipCriteriaInputFields.strandInputField}
                />
                {filteredStrands.length > 0 && (
                    <Pagination
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={fetchStrands.length}
                        onNext={goToNextPage}
                        onPrevious={goToPreviousPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemLabel={label.toLowerCase()}
                    />
                )}
            </div>
        </div>
    );
};

export default Strands;
