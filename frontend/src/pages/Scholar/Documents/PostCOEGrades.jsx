import React, { useState } from "react";

function PostCOEGrades() {
    const documentTypes = ["COE", "Grades"];
    // Semester options
    const semesters = [
        "1st Sem, 2024",
        "2nd Sem, 2024",
        "Summer, 2024",
        "1st Sem, 2025",
        "2nd Sem, 2025",
    ];

    // State for form inputs
    const [isOpen, setIsOpen] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [semester, setSemester] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    // Initial documents data
    const [documents, setDocuments] = useState([
        {
            id: 1,
            type: "COE",
            semester: "1st Sem, 2024",
            uploadDate: "2025-01-10",
            status: "Approved",
            fileUrl: "#",
        },
        {
            id: 2,
            type: "COE",
            semester: "2nd Sem, 2024",
            uploadDate: "2025-06-05",
            status: "Pending",
            fileUrl: "#",
        },
        {
            id: 3,
            type: "Grades",
            semester: "1st Sem, 2024",
            uploadDate: "2025-02-15",
            status: "Approved",
            fileUrl: "#",
        },
    ]);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    // Handle document upload
    const handleUpload = () => {
        if (file && documentType && semester) {
            const today = new Date();
            const formattedDate = today.toISOString().split("T")[0];

            const newDocument = {
                id: documents.length + 1,
                type: documentType,
                semester: semester,
                uploadDate: formattedDate,
                status: "Pending",
                fileUrl: "#",
            };

            setDocuments([...documents, newDocument]);

            // Reset form
            setFile(null);
            setFileName("");
            setDocumentType("");
            setSemester("");
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleDelete = (id) => {
        const updatedDocuments = documents.filter((doc) => doc.id !== id);
        setDocuments(updatedDocuments);
    };

    // Filter data based on search term
    const filteredDocuments = documents.filter(
        (doc) =>
            doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDocuments.slice(
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

    // Function to view document (in real app, this would open the file)
    const handleView = (doc) => {
        // In a real app, this would open the document
        console.log(`Viewing document: ${doc.type} for ${doc.semester}`);
    };

    return (
        <div className="bg-white rounded-md shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    My Documents
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
                        placeholder="Search documents..."
                        className="pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-[4px] border border-gray-200">
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
                                Document Type
                            </th>
                            <th
                                scope="col"
                                className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Semester
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
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((doc) => (
                            <tr
                                key={doc.id}
                                className="hover:bg-gray-50 transition-colors text-center"
                            >
                                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                    {doc.uploadDate}
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {doc.type}
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                    {doc.semester}
                                </td>
                                <td className="py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                                doc.status === "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                                    >
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleView(doc)}
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
                                        onClick={() => handleDelete(doc.id)}
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
                                                d="M3 8l1 12a2 2 0 002 2h12a2 2 0 002-2l1-12M3 8h18M3 8l2-3h14l2 3M10 12h4"
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
                            No documents found. Try adjusting your search or
                            upload a new document.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredDocuments.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <Form
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        file={file}
                        setFile={setFile}
                        fileName={fileName}
                        setFileName={setFileName}
                        documentTypes={documentTypes}
                        semesters={semesters}
                        documentType={documentType}
                        setDocumentType={setDocumentType}
                        semester={semester}
                        setSemester={setSemester}
                        handleFileChange={handleFileChange}
                        handleUpload={handleUpload}
                    />
                    <div className="text-sm text-gray-600">
                        Showing {indexOfFirstItem + 1}-
                        {Math.min(indexOfLastItem, filteredDocuments.length)} of{" "}
                        {filteredDocuments.length} certificates
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
                                currentPage === totalPages || totalPages === 0
                            }
                            className={`px-4 py-2 rounded-md ${
                                currentPage === totalPages || totalPages === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600 transition-all"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Form({
    isOpen,
    setIsOpen,
    file,
    setFile,
    fileName,
    setFileName,
    documentTypes,
    semesters,
    documentType,
    setDocumentType,
    semester,
    setSemester,
    handleFileChange,
    handleUpload,
}) {
    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition-colors"
            >
                Upload Document
            </button>

            {isOpen && (
                <div
                    // onClick={() => setIsOpen(false)}
                    className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="w-[80%] md:w-[50%] lg:w-[40%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-4 py-3 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Upload COE & Grades
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 space-y-4">
                            {/* Document Type Selection */}
                            <div className="relative">
                                <label className="absolute top-[-10px] text-gray-600 text-sm">
                                    Document Type
                                </label>
                                <select
                                    value={documentType}
                                    onChange={(e) =>
                                        setDocumentType(e.target.value)
                                    }
                                    className="w-full border-b-2 border-gray-400 py-2 mt-1 focus:border-green-500"
                                    required
                                >
                                    <option value="">
                                        Select document type
                                    </option>
                                    {documentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester Selection */}
                            <div className="relative">
                                <label className="absolute top-[-10px] text-gray-600 text-sm">
                                    Semester
                                </label>
                                <select
                                    value={semester}
                                    onChange={(e) =>
                                        setSemester(e.target.value)
                                    }
                                    className="w-full border-b-2 border-gray-400 py-2 mt-1 focus:border-green-500"
                                    required
                                >
                                    <option value="">Select semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem} value={sem}>
                                            {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-1 flex justify-center p-2 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500"
                                        >
                                            <span>Choose File</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".pdf,.jpg,.png"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, JPG, PNG (max 10MB)
                                    </p>
                                    {fileName && (
                                        <p className="text-sm text-purple-500 font-medium mt-2">
                                            {fileName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Upload Button */}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`w-full py-2 px-4 rounded-md font-medium shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={
                                        !file || !documentType || !semester
                                    }
                                    className={`w-full py-2 px-4 rounded-md font-medium shadow-sm focus:ring-2 focus:ring-green-500 transition-colors ${
                                        !file || !documentType || !semester
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600 text-white"
                                    }`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostCOEGrades;