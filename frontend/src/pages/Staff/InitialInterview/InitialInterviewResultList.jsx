import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { toast } from "react-toastify";
import { formatDateTime } from "../../../utils/formatDateTime";

function InitialInterviewResultList() {
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
                `http://localhost:8000/app/views/application-examination.php?application_status=Approved&application_status=Examination&status=New`
            );
            setStudentData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setLoading(false);
        }
    };

    console.log("Data" + studentData);

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
                    batch: "Unassigned",
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
                    <table className="w-[1160px] divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-700 font-bold">
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Application ID
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Date Applied
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Date Approved
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((info, index) => (
                                <tr
                                    key={info.application_id}
                                    className={` transition-colors text-center text-xs`}
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.application_id}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium text-gray-500">
                                        {info.last_name +
                                            ", " +
                                            info.middle_name +
                                            ", " +
                                            info.first_name}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.approved_at ? formatDateTime(info.approved_at) : "--"}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                                info.application_status === "Examination"
                                                    ? "bg-green-100 text-green-800"
                                                    : info.application_status ===
                                                      "Approved"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {info.application_status === "Examination" ? "Approved" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium">
                                        <ApplicationFormPDF
                                            studentId={info.application_id}
                                        />
                                        <button
                                            disabled={info.application_status === "Examination"}
                                            onClick={() => {
                                                updateStudentApplication(
                                                    info.application_id
                                                );
                                                // addBatchColumn(
                                                //     info.application_id
                                                // );
                                            }}
                                            className={`${info.application_status === "Examination" ? 'text-gray-400' : 'text-green-600 hover:text-green-900'} inline-flex items-center mr-3`}
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
                                                    d="M15 10l-4.5 4.5L9 13m12-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Approve for Exam
                                            
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

export default InitialInterviewResultList;
