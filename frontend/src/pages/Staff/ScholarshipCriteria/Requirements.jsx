import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FormModal from "./FormModal";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";

const Requirements = ({ label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [rowItemId, setRowItemId] = useState(0);
    const [newQuantity, setNewQuantity] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newSubmit, setNewSubmit] = useState("");
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(0);

    const [requirements, setRequirements] = useState([]);

    const fetchRequirements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/requirements.php`
            );
            // Fix 2: Access the correct property in the response
            setRequirements(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requirements data:", err);
            setError("Failed to load requirements data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequirements();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data based on search term
    const filteredRequirements = requirements.filter((requirement) =>
        requirement.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequirements.slice(
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

    const handleButtonState = (quantity, description, submit, id) => {
        setEdit(true);
        setNewQuantity(quantity);
        setNewDescription(description);
        setNewSubmit(submit);
        setRowItemId(id);
    };

    const handleQuantityChange = (value) => {
        setNewQuantity(value);
    };

    const handleDescriptionChange = (value) => {
        setNewDescription(value);
    };

    const handleSubmitChange = (value) => {
        setNewSubmit(value);
    };

    const handleEdit = async (id) => {
        setEdit(false);

        // Check if the user cancelled or submitted an empty string
        if (
            newQuantity === null ||
            newQuantity.trim() === "" ||
            newDescription === null ||
            newDescription.trim() === "" ||
            newSubmit === null ||
            newSubmit.trim() === ""
        ) {
            return; // Exit if cancelled or empty
        }

        try {
            // Create the data structure matching the working handleSubmit function
            const data = {
                requirement: {
                    id: id,
                    quantity: newQuantity,
                    description: newDescription,
                    submit: newSubmit,
                },
            };

            // Use fetch instead of axios to match the working handleSubmit function
            const response = await fetch(
                "http://localhost:8000/app/views/requirements.php",
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
                const updatedRequirements = requirements.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              quantity: newQuantity,
                              description: newDescription,
                              submit: newSubmit,
                          }
                        : item
                );
                setRequirements(updatedRequirements);

                // Show success message
                toast.success("Requirement updated successfully.");
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error updating requirement:", error);
            alert("Failed to update requirement");
        }
    };

    // Handle certificate deletion
    const handleDelete = async (id, index) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `http://localhost:8000/app/views/requirements.php?id=${id}`
            );

            // Update local state after successful deletion
            const updatedRequirements = requirements.filter(
                (requirement) => requirement.id !== id
            );
            setRequirements(updatedRequirements);

            toast.success("Requirements deleted successfully.");

            if (index === 0) goToPreviousPage();
        } catch (error) {
            console.error("Error deleting requirement:", error);
            alert("Failed to delete requirement");
        }
    };

    return (
        <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    Requirements
                </h3>

                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search requirements..."
                        className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-100 text-green-800 text-center">
                        <tr>
                            <th
                                scope="col"
                                className="py-3 text-xs font-medium uppercase tracking-wider"
                            >
                                Quantity
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-xs font-medium uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-xs font-medium uppercase tracking-wider"
                            >
                                Submit During
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-xs font-medium uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((requirement, index) => (
                            <tr
                                key={requirement.id}
                                className="hover:bg-gray-50 transition-colors text-center"
                            >
                                {edit && rowItemId === requirement.id ? (
                                    <td className="p-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        <input
                                            className="p-2 w-full border-[1px] outline-green-500"
                                            type="text"
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    e.target.value
                                                )
                                            }
                                            value={newQuantity}
                                        />
                                    </td>
                                ) : (
                                    <td className="p-4 text-left whitespace-nowrap text-sm text-gray-500">
                                        {numberOfItemsPerPage + index + 1}{". "}
                                        {requirement.quantity}
                                    </td>
                                )}
                                {edit && rowItemId === requirement.id ? (
                                    <td className="py-4 text-sm text-gray-500">
                                        <textarea
                                            rows={5}
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
                                    <td className="py-4 max-w-md break-words text-sm text-gray-500">
                                        {requirement.description}
                                    </td>
                                )}
                                {edit && rowItemId === requirement.id ? (
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            className="p-2 w-full border-[1px] outline-green-500"
                                            type="text"
                                            onChange={(e) =>
                                                handleSubmitChange(
                                                    e.target.value
                                                )
                                            }
                                            value={newSubmit}
                                        />
                                    </td>
                                ) : (
                                    <td className=" py-4 whitespace-nowrap text-sm text-gray-500">
                                        {requirement.submit}
                                    </td>
                                )}
                                <td className="p-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            {
                                                {
                                                    edit &&
                                                    rowItemId === requirement.id
                                                        ? handleEdit(
                                                              requirement.id
                                                          )
                                                        : handleButtonState(
                                                              requirement.quantity,
                                                              requirement.description,
                                                              requirement.submit,
                                                              requirement.id
                                                          );
                                                }
                                            }
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
                                        {edit && rowItemId === requirement.id
                                            ? "Save Changes"
                                            : "Edit"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                requirement.id,
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
                            No requirements found. Try adjusting your search or
                            upload a new requirement.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}

            <div className="flex justify-between items-center mt-6">
                <FormModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={fetchRequirements}
                    label={label}
                    fields={
                        scholarshipCriteriaInputFields.requirementInputFields
                    }
                />
                {filteredRequirements.length > 0 && (
                    <>
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(
                                indexOfLastItem,
                                filteredRequirements.length
                            )}{" "}
                            of {filteredRequirements.length} requirements
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

export default Requirements;
