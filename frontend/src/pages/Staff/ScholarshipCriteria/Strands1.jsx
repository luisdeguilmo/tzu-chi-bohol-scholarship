import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FormModal from "./FormModal";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";
import SearchBar from "../../../components/ScholarshipCriteria/SearchBar";

const Strandss = ({ label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [newText, setNewText] = useState("");
    const [rowItemId, setRowItemId] = useState(0);
    const [newDescription, setNewDescription] = useState("");
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(0);
    const [strands, setStrands] = useState([]);

    const handleDescriptionChange = (value) => {
        setNewDescription(value);
    };

    const fetchStrands = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/strands.php`
            );
            // Decode HTML entities in the data when it's received
            const decodedStrands =
                response.data.data?.map((strand) => ({
                    ...strand,
                    strand: decodeHTMLEntities(strand.strand),
                })) || [];

            setStrands(decodedStrands);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching strands data:", err);
            setError("Failed to load strands data. Please try again.");
            setLoading(false);
        }
    };

    // Function to decode HTML entities to plain text
    const decodeHTMLEntities = (text) => {
        if (!text) return "";
        const textArea = document.createElement("textarea");
        textArea.innerHTML = text;
        return textArea.value;
    };

    useEffect(() => {
        fetchStrands();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data based on search term
    const filteredStrands = strands.filter((strand) =>
        strand.strand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredStrands.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStrands.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Handle page changes
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        setNumberOfItemsPerPage(numberOfItemsPerPage - 5);
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        setNumberOfItemsPerPage(numberOfItemsPerPage + 5);
    };

    const handleButtonState = (value, description, id) => {
        setEdit(true);
        setNewText(value);
        setNewDescription(description);
        setRowItemId(id);
    };

    const handleChange = (value) => {
        setNewText(value);
    };

    const handleEdit = async (id) => {
        setEdit(false);

        // Check if the user cancelled or submitted an empty string
        if (
            newText === null ||
            newText.trim() === "" ||
            newDescription === null ||
            newDescription.trim() === ""
        ) {
            return; // Exit if cancelled or empty
        }

        try {
            // Create the data structure for the update
            // No need to encode here as that should be handled server-side
            const data = {
                strand: {
                    id: id,
                    strand: newText,
                    description: newDescription,
                },
            };

            console.log(data);

            // Send the PUT request with the data in the body
            const response = await fetch(
                `http://localhost:8000/app/views/strands.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            // Check for success and update the UI
            if (result.success) {
                // Update the local state to reflect the change
                const updatedStrands = strands.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              strand: newText,
                              description: newDescription,
                          }
                        : item
                );
                setStrands(updatedStrands);

                // Show success message
                toast.success("Strand updated successfully.");
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating strand:", error);
            alert("Failed to update strand");
        }
    };

    // Handle strand deletion
    const handleDelete = async (id, index) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `http://localhost:8000/app/views/strands.php?id=${id}`
            );

            // Update local state after successful deletion
            const updatedStrands = strands.filter((strand) => strand.id !== id);
            setStrands(updatedStrands);

            toast.success("Strand deleted successfully.");

            if (index === 0) goToPreviousPage();
        } catch (error) {
            console.error("Error deleting strand:", error);
            alert("Failed to delete strand");
        }
    };

    return (
        <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    {label || "Strands"}
                </h3>

                {/* Search */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={'Search strands...'} />
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
                                {label || "Strands"}
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
                            <tr
                                key={strand.id}
                                className="hover:bg-gray-50 transition-colors text-center text-xs"
                            >

                                {edit && rowItemId === strand.id ? (
                                    <td className="pl-5 py-3 text-left whitespace-nowrap text-gray-500">
                                        <input
                                            className="w-full p-2 border-[1px] outline-green-500"
                                            type="text"
                                            onChange={(e) =>
                                                handleChange(e.target.value)
                                            }
                                            value={newText}
                                        />
                                    </td>
                                ) : (
                                    <td className="pl-5 py-3 text-left whitespace-nowrap text-gray-500">
                                        {`${numberOfItemsPerPage + index + 1}.`}{" "}
                                        {strand.strand}
                                    </td>
                                )}
                                {edit && rowItemId === strand.id ? (
                                    <td className="p-3 text-gray-500">
                                        <textarea
                                            rows={3}
                                            className="w-full p-2 resize-none text-justify border-[1px] outline-green-500"
                                            type="text"
                                            onChange={(e) =>
                                                handleDescriptionChange(
                                                    e.target.value
                                                )
                                            }
                                            value={newDescription}
                                        />
                                    </td>
                                ) : (
                                    <td className="py-3 max-w-md break-words text-gray-500">
                                        {strand.description}
                                    </td>
                                )}
                                <td className="pr-5 py-3 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => {
                                            edit && rowItemId === strand.id
                                                ? handleEdit(strand.id)
                                                : handleButtonState(
                                                      strand.strand,
                                                      strand.description,
                                                      strand.id
                                                  );
                                        }}
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
                                        {edit && rowItemId === strand.id
                                            ? "Save Changes"
                                            : "Edit"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                strand.id,
                                                currentItems.length - 1
                                            )
                                        }
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
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <div className="text-center py-10">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="mt-2 text-gray-500">
                            No strands found. Try adjusting your search or add a
                            new strand.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <FormModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={fetchStrands}
                    label={label || "Strand"}
                    fields={scholarshipCriteriaInputFields.strandInputField}
                />
                {filteredStrands.length > 0 && (
                    <>
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(indexOfLastItem, filteredStrands.length)}{" "}
                            of {filteredStrands.length} strands
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-600 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={goToNextPage}
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === totalPages ||
                                    totalPages === 0
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Strandss;
