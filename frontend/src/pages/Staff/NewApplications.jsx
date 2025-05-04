import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../components/ApplicationFormPDF";
import { toast } from "react-toastify";

function NewApplications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState([]);

    const fetchStudentsData = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/applicants.php?status=Approved&type=New`
            );
            setStudentData(response.data.personalInfo);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentsData();
    }, []);

    const updateStudentApplication = async (studentId) => {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/app/views/update_application_status.php",
                {
                    studentId: studentId,
                    status: "Examination",
                }
            );
            toast.success(response.data.message + "."); // Success message

            // Refresh the data after approval
            await fetchStudentsData();

            // Optional: Show success notification
            // alert("Application approved successfully");
        } catch (err) {
            console.error("Error updating application status:", err);
            setError("Failed to approve application.");
            setLoading(false);
        }
    };

    // const addBatchColumn = async (id) => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.post(
    //             "http://localhost:8000/app/views/add-remove-batch.php",
    //             {
    //                 id: id
    //             }
    //         );
    
    //         console.log(response.data.message);
    //         alert(response.data.message);
    //     } catch (err) {
    //         console.error("Error adding batch column:", err);
    //         alert("Failed to add 'batch' column.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };    

    // Filter data based on search term
    const filteredApplications = studentData.filter(
        (applicant) =>
            applicant.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.middle_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.created_at.includes(searchTerm)
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplications.slice(
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

    console.log(studentData);
    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Applications
                    </h2>

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
                            placeholder="Search applications..."
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
                                    Application ID
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                                >
                                    Gender
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                                >
                                    Age
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                                >
                                    Contact
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                                >
                                    Date Applied
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
                            {currentItems.map((info, index) => (
                                <tr
                                    key={info.application_id}
                                    className={` transition-colors text-center`}
                                >
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {info.application_id}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {info.last_name +
                                            ", " +
                                            info.middle_name +
                                            ", " +
                                            info.first_name}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {info.gender}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {info.age}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {info.contact_number}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                        {info.created_at}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm font-medium">
                                        <ApplicationFormPDF
                                            studentId={info.application_id}
                                        />
                                        <button
                                            onClick={() => {
                                                updateStudentApplication(
                                                    info.application_id
                                                );
                                                // addBatchColumn(
                                                //     info.application_id
                                                // );
                                            }}
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Send to Exam
                                        </button>
                                        {/* <button
                                            // onClick={() => handleDelete(coa.id)}
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
                                            Reject
                                        </button> */}
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
                {filteredApplications.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(
                                indexOfLastItem,
                                filteredApplications.length
                            )}{" "}
                            of {filteredApplications.length} applications
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${
                                    currentPage === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 transition-all"
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
                    </div>
                )}
            </div>
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
                                    className={`w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={
                                        !file || !documentType || !semester
                                    }
                                    className={`w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:ring-2 focus:ring-green-500 transition-colors ${
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

export default NewApplications;
