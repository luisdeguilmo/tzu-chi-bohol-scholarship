import React, { useState } from "react";

export default function PostCOA() {
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [date, setDate] = useState("");
    const [eventName, setEventName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [coas, setCoas] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
            const names = selectedFiles.map((file) => file.name);
            setFileNames(names);
        }
    };

    const handleUpload = () => {
        if (files.length > 0 && date && eventName) {
            setIsUploading(true);
            setUploadProgress(0);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);

            // Create FormData for file upload
            const formData = new FormData();

            // Add files with proper indexing
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            // Add event details to certificate_of_appearance data
            const applicationData = {
                certificate_of_appearance: [
                    
                    
                ],
                event_name: eventName,
                event_date: date,
            };

            // Add the application data as a string
            formData.append(
                "certificate_of_appearance",
                JSON.stringify(applicationData)
            );

            // Make API request
            fetch("http://localhost:8000/backend/api/coa", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // Add the new certificate to the list
                        const newCOA = {
                            id: data.application_id,
                            date: date,
                            event: eventName,
                            status: "Pending",
                            fileCount: files.length,
                        };

                        setCoas([...coas, newCOA]);
                        resetForm();
                        setIsUploading(false);
                        clearInterval(interval);
                        alert(
                            "Certificate of Appearance uploaded successfully!"
                        );
                    } else {
                        console.error("Upload failed:", data.message);
                        setIsUploading(false);
                        clearInterval(interval);
                        alert("Upload failed: " + data.message);
                    }
                })
                .catch((error) => {
                    console.error("Upload error:", error);
                    setIsUploading(false);
                    clearInterval(interval);
                    alert("Upload error: " + error.message);
                });
        } else {
            alert(
                "Please provide event name, date and select at least one file!"
            );
        }
    };

    const resetForm = () => {
        setFiles([]);
        setFileNames([]);
        setDate("");
        setEventName("");
        setIsOpen(false);
        setUploadProgress(0);
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data based on search term
    const filteredCoas = coas.filter(
        (coa) =>
            coa.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coa.date.includes(searchTerm) ||
            coa.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredCoas.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCoas.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page changes
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Function to view certificate
    const handleView = (coa) => {
        console.log(`Viewing certificate: ${coa.event} from ${coa.date}`);

        // Example of how to fetch and display a file
        fetch(`http://localhost:8000/backend/api/coa/files/${coa.id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.files.length > 0) {
                    // Open the file in a new window or download it
                    window.open(data.files[0].file_path, "_blank");
                }
            });
    };

    // Handle certificate deletion
    const handleDelete = (id) => {
        // Send delete request to API
        fetch(`http://localhost:8000/backend/api/coa/delete/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const updatedCoas = coas.filter((coa) => coa.id !== id);
                    setCoas(updatedCoas);
                    console.log(`Deleted certificate with ID: ${id}`);
                }
            })
            .catch((error) => {
                console.error("Delete error:", error);
            });
    };

    return (
        <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    My Certificates
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
                        placeholder="Search certificates..."
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
                                className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Event
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Files
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
                        {currentItems.map((coa) => (
                            <tr
                                key={coa.id}
                                className="hover:bg-gray-50 transition-colors text-center"
                            >
                                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coa.date}
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {coa.event}
                                </td>
                                <td className="py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                        coa.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                                    >
                                        {coa.status}
                                    </span>
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coa.fileCount
                                        ? `${coa.fileCount} file${
                                              coa.fileCount > 1 ? "s" : ""
                                          }`
                                        : "1 file"}
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleView(coa)}
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
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coa.id)}
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Archive
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
                            No certificates found. Try adjusting your search or
                            upload a new certificate.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination and Upload Button */}
            <div className="flex justify-between items-center mt-6">
                <div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Upload Certificate
                    </button>
                </div>
                {filteredCoas.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Upload Certificate
                            </h3>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Date input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Event Name input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500"
                                    placeholder="Enter event name"
                                    value={eventName}
                                    onChange={(e) =>
                                        setEventName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* File upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Certificate Document
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                ></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF, PNG, JPG, DOC, DOCX (MAX.
                                                10MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                            multiple
                                        />
                                    </label>
                                </div>

                                {/* Selected files display */}
                                {fileNames.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">
                                            Selected files ({fileNames.length}):
                                        </p>
                                        <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                                            {fileNames.map((name, index) => (
                                                <li
                                                    key={index}
                                                    className="truncate"
                                                >
                                                    {name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Upload progress */}
                            {isUploading && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-green-600 h-2.5 rounded-full"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        {uploadProgress}% uploaded
                                    </p>
                                </div>
                            )}

                            {/* Submit button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors ${
                                        isUploading ||
                                        !files.length ||
                                        !date ||
                                        !eventName
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={handleUpload}
                                    disabled={
                                        isUploading ||
                                        !files.length ||
                                        !date ||
                                        !eventName
                                    }
                                >
                                    {isUploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
