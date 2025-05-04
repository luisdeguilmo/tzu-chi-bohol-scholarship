import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Qualifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [newText, setNewText] = useState("");
    const [rowItemId, setRowItemId] = useState(0);

    const [qualifications, setQualifications] = useState([]);

    const fetchQualifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/qualifications.php`
            );
            // Fix 2: Access the correct property in the response
            setQualifications(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching qualifications data:", err);
            setError("Failed to load qualifications data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQualifications();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data based on search term
    const filteredQualifications = qualifications.filter((qualification) =>
        qualification.qualification
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredQualifications.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredQualifications.slice(
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
            // 2. Create the data structure for the update
            const data = {
                id: id,
                qualification: newText,
            };

            // 3. Send the PUT request with the data in the body (not as query params)
            const response = await axios.put(
                `http://localhost:8000/app/views/qualifications.php`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // 4. Check for success and update the UI
            if (response.data.success) {
                // Update the local state to reflect the change
                const updatedQualifications = qualifications.map((item) =>
                    item.id === id ? { ...item, qualification: newText } : item
                );
                setQualifications(updatedQualifications);

                // Show success message
                toast.success("Qualification updated successfully.");
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating qualification:", error);
            alert("Failed to update qualification");
        }
    };

    // Handle certificate deletion
    const handleDelete = async (id, index) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `http://localhost:8000/app/views/qualifications.php?id=${id}`
            );

            // Update local state after successful deletion
            const updatedQualifications = qualifications.filter(
                (qualification) => qualification.id !== id
            );
            setQualifications(updatedQualifications);

            toast.success("Qualification deleted successfully.");

            if (index === 0) goToPreviousPage();
        } catch (error) {
            console.error("Error deleting qualification:", error);
            alert("Failed to delete qualification");
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
                        placeholder="Search qualifications..."
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
                                Qualifications
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
                        {currentItems.map((qualification, index) => (
                            <tr
                                key={qualification.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {edit && rowItemId === qualification.id ? (
                                    <td className="pl-10 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            className="p-2 w-full border-[1px] outline-green-500"
                                            type="text"
                                            onChange={(e) =>
                                                handleChange(e.target.value)
                                            }
                                            value={newText}
                                        />
                                    </td>
                                ) : (
                                    <td className="pl-10 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                                        {`${index + 1}.`}{" "}
                                        {qualification.qualification}
                                    </td>
                                )}
                                <td className="py-4 text-center whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={(e) => {
                                            {
                                                {
                                                    edit &&
                                                    rowItemId ===
                                                        qualification.id
                                                        ? handleEdit(
                                                              qualification.id
                                                          )
                                                        : handleButtonState(
                                                              qualification.qualification,
                                                              qualification.id
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
                                                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z"
                                            />
                                        </svg>
                                        {edit && rowItemId === qualification.id
                                            ? "Save Changes"
                                            : "Edit"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                qualification.id,
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
                            No qualifications found. Try adjusting your search
                            or add a new qualification.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}

            <div className="flex justify-between items-center mt-6">
                <Form
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onSuccess={fetchQualifications}
                />
                {filteredQualifications.length > 0 && (
                    <>
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(
                                indexOfLastItem,
                                filteredQualifications.length
                            )}{" "}
                            of {filteredQualifications.length} qualifications
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the data structure that matches your backend expectations
        const data = {
            qualification: text,
        };

        try {
            const formData = new FormData();
            // Serialize the data object to JSON string before appending
            formData.append("qualification", JSON.stringify(data));

            const response = await fetch(
                "http://localhost:8000/app/views/qualifications.php",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                setText("");
                setIsOpen(false); // Close the modal on success
            } else {
                alert("Error: " + result.message);
            }
            if (onSuccess) onSuccess();
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
                Add Qualification
            </button>

            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">
                                Qualification
                            </h2>
                            <button
                                type="button" // Explicitly mark as button type
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            {/* Qualification Name Input */}
                            <div>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                                    placeholder="Enter qualification name"
                                    required
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button" // Explicitly set type to prevent form submission
                                    onClick={handleCancel}
                                    className="w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600"
                                >
                                    Add Qualification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Qualifications;
