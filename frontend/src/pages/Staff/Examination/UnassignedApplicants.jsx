import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { toast } from "react-toastify";
import { formatDateTime } from "../../../utils/formatDateTime";

export default function UnassignedApplicants() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBatch, setSelectedBatch] = useState("Batch 1");
    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const itemsPerPage = 10;
    const [batches, setBatches] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState([]);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/batches.php`
            );
            // Fix 2: Access the correct property in the response
            setBatches(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchStudentsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/applicants.php?entrance_examination=1&batch=Unassigned`
            );
            setStudentData(response.data.data || []);
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

    console.log(studentData);

    const assignStudentsToBatch = async () => {
        if (selectedApplicants.length === 0) {
            alert("Please select at least one applicant");
            return;
        }

        if (!selectedBatch) {
            alert("Please select a batch");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/app/views/batch-examination.php",
                {
                    applicantIds: selectedApplicants,
                    batch: selectedBatch,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Refresh the data after assignment
                await fetchStudentsData();

                // Clear selections
                setSelectedApplicants([]);

                // Show success notification
                toast.success(response.data.message + ".");
            } else {
                alert("Error: " + response.data.message);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error assigning batch:", err);
            setError(
                "Failed to assign batch to applicants: " +
                    (err.response?.data?.message || err.message)
            );
            setLoading(false);
        }
    };

    // Toggle applicant selection
    const toggleApplicantSelection = (applicationId) => {
        setSelectedApplicants((prev) => {
            if (prev.includes(applicationId)) {
                return prev.filter((id) => id !== applicationId);
            } else {
                return [...prev, applicationId];
            }
        });
    };

    // Select all visible applicants
    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.application_id);
        if (selectedApplicants.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedApplicants([]);
        } else {
            // Otherwise select all visible
            setSelectedApplicants(visibleIds);
        }
    };

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
                                <th className="px-3 py-3 flex justify-center gap-2 text-center text-xs uppercase tracking-wider">
                                    {/* <input
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        checked={
                                            currentItems.length > 0 &&
                                            selectedApplicants.length ===
                                                currentItems.length
                                        }
                                        onChange={selectAllVisible}
                                    />
                                    Select All */}
                                </th>
                                <th className="px-3 py-3 text-center text-xs uppercase tracking-wider">
                                    Application ID
                                </th>
                                <th className="py-3 text-center text-xs uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="py-3 text-center text-xs uppercase tracking-wider">
                                    Batch
                                </th>
                                <th className="py-3 text-center text-xs uppercase tracking-wider">
                                    Date Applied
                                </th>
                                <th className="py-3 text-center text-xs uppercase tracking-wider">
                                    Date Approved
                                </th>
                                <th className="py-3 text-center text-xs uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((info, index) => (
                                <tr
                                    key={index}
                                    className={`transition-colors text-center text-xs ${
                                        selectedApplicants.includes(
                                            info.application_id
                                        )
                                            ? "bg-green-50"
                                            : ""
                                    }`}
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            checked={selectedApplicants.includes(
                                                info.application_id
                                            )}
                                            onChange={() =>
                                                toggleApplicantSelection(
                                                    info.application_id
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.application_id}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.last_name +
                                            ", " +
                                            info.first_name +
                                            (info.middle_name
                                                ? " " + info.middle_name
                                                : "")}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {"Unassigned"}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.approved_at)}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium">
                                        <ApplicationFormPDF
                                            studentId={info.application_id}
                                        />
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
                                No applicants found. Try adjusting your search.
                            </p>
                        </div>
                    )}
                </div>

                {currentItems.length > 0 && (
                    <div className="w-[max-content] py-4">
                        <label className="flex gap-2 items-center text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                checked={
                                    currentItems.length > 0 &&
                                    selectedApplicants.length ===
                                        currentItems.length
                                }
                                onChange={selectAllVisible}
                            />
                            Select All
                        </label>
                    </div>
                )}

                {/* Batch Assignment Controls */}
                <div className="flex items-center justify-between">
                    {filteredApplications.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2">
                                {/* <div className="flex-none text-sm font-medium text-gray-700">
                                    Assign Selected to:
                                </div> */}
                                <select
                                    className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={selectedBatch}
                                    onChange={(e) =>
                                        setSelectedBatch(e.target.value)
                                    }
                                >
                                    {batches.map((batch, index) => (
                                        <option
                                            key={index}
                                            value={batch.batch_name}
                                        >
                                            {batch.batch_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={assignStudentsToBatch}
                                    disabled={selectedApplicants.length === 0}
                                    className={`px-4 py-2 rounded-md ${
                                        selectedApplicants.length === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    Assign Selected
                                </button>
                            </div>
                        </div>
                    )}

                    {filteredApplications.length > 0 && (
                        <div className="text-sm text-gray-600 mx-auto">
                            Showing {indexOfFirstItem + 1}-
                            {Math.min(
                                indexOfLastItem,
                                filteredApplications.length
                            )}{" "}
                            of {filteredApplications.length} applications
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredApplications.length > 0 && (
                        <div className="flex justify-between items-center">
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
        </div>
    );
}
