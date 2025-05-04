import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Strands = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [newText, setNewText] = useState("");
    const [rowItemId, setRowItemId] = useState(0);

    const [strands, setStrands] = useState([]);

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
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleButtonState = (value, id) => {
        setEdit(true);
        setNewText(value);
        setRowItemId(id);
    };

    const handleChange = (value) => {
        setNewText(value);
    };

    const handleEdit = async (id) => {
        setEdit(false);

        // Check if the user cancelled or submitted an empty string
        if (newText === null || newText.trim() === "") {
            return; // Exit if cancelled or empty
        }

        try {
            // Create the data structure for the update
            // No need to encode here as that should be handled server-side
            const data = {
                id: id,
                strand: newText,
            };

            // Send the PUT request with the data in the body
            const response = await axios.put(
                `http://localhost:8000/app/views/strands.php`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Check for success and update the UI
            if (response.data.success) {
                // Update the local state to reflect the change
                const updatedStrands = strands.map((item) =>
                    item.id === id ? { ...item, strand: newText } : item
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
                    Qualifications
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
                        placeholder="Search strands..."
                        className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-100 text-green-800">
                        <tr>
                            <th
                                scope="col"
                                className="pl-20 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                                Strands
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((strand, index) => (
                            <tr
                                key={strand.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {edit && rowItemId === strand.id ? (
                                    <td className="pl-10 py-4 text-left whitespace-nowrap text-sm text-gray-500">
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
                                    <td className="pl-10 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                                        {`${index + 1}.`} {strand.strand}
                                    </td>
                                )}
                                <td className="py-4 text-center whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            edit && rowItemId === strand.id
                                                ? handleEdit(strand.id)
                                                : handleButtonState(
                                                      strand.strand,
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
                                                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z"
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
                <Form
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={fetchStrands}
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

function Form({ isOpen, setIsOpen, onSuccess }) {
    const [text, setText] = useState("");

    const handleChange = (value) => {
        setText(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the data structure that matches your backend expectations
        const data = {
            strand: text,
        };

        try {
            const formData = new FormData();
            // Send the raw text data without any encoding - server should handle proper escaping
            formData.append("strand", JSON.stringify(data));

            const response = await fetch(
                "http://localhost:8000/app/views/strands.php",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (result.success) {
                toast.success(result.message + ".");
                setText("");
                setIsOpen(false); // Close the modal on success
                if (onSuccess) onSuccess(); // Refresh the data
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Add Strand
            </button>

            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[80%] md:w-[50%] lg:w-[25%] bg-white rounded-md shadow-md overflow-hidden">
                        <div className="bg-green-500 px-6 py-2 flex justify-between items-center">
                            <h2 className="text-md text-white">
                                Add New Strand
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-2">
                            {/* Qualification Name Input */}
                            <div>
                                <label className="text-md font-semibold text-gray-700">Strand</label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) =>
                                        handleChange(e.target.value)
                                    }
                                    className="w-full outline-none border-[2px] border-gray-300 rounded-md p-2 mt-1 box-border hover:border-green-500 focus:border-green-500"
                                    placeholder="Enter strand name"
                                    required
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full py-2 px-4 rounded-sm text-md shadow-sm focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 rounded-sm text-md  shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600"
                                >
                                    Add Strand
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Strands;
