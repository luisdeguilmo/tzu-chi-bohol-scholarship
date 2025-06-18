import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { toast } from "react-toastify";
import { formatDateTime } from "../../../utils/formatDateTime";
import BatchActions from "./BatchActions";
import SetScheduleForm from "./SetScheduleForm";
import { sendExaminationSchedule } from "../../../services/examinationService";

export default function ExaminationBatches() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("all");

    const [applicantsEachBatch, setApplicantsEachBatch] = useState([]);
    const [applicantsToSend, setApplicantsToSend] = useState([]);

    const [edit, setEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [score, setScore] = useState(0);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/batches.php`
            );
            setBatches(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    const fetchApplicantsEachBatch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/batch-examination.php?batch=${selectedBatch}`
            );
            setApplicantsEachBatch(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batch applicants data:", err);
            setError("Failed to load batch applicants data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        // Fetch applicants whenever selectedBatch changes
        if (selectedBatch) {
            fetchApplicantsEachBatch();
        }
    }, [selectedBatch]);

    // const fetchStudentsData = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get(
    //             `http://localhost:8000/app/views/applicants.php?status=Examination`
    //         );
    //         setStudentData(response.data.personalInfo || []);
    //         setLoading(false);
    //     } catch (err) {
    //         console.error("Error fetching student data:", err);
    //         setError("Failed to load student data. Please try again.");
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchStudentsData();
    // }, []);

    const handleButtonState = (id, value) => {
        setEdit(true);
        setEditingId(id);
        setScore(value || ''); // Set initial value
    };

    const handleChange = (value) => {
        setScore(value);
    };

    // const handleEdit = async (id) => {
    //     setEdit(false);
    //     setEditingId(null);

    //     // Check if the user cancelled or submitted an empty string
    //     if (score === null || score.trim() === "") {
    //         return; // Exit if cancelled or empty
    //     }

    //     try {
    //         // Create the data structure for the update
    //         const data = {
    //             id: id,
    //             score: score, // Changed from procedure to score
    //         };

    //         // Send the PUT request with the data in the body
    //         const response = await axios.put(
    //             `http://localhost:8000/app/views/batch-examination.php`, // Updated endpoint
    //             data,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         // Check for success and update the UI
    //         if (response.data.success) {
    //             // Update the local state to reflect the change
    //             const updatedApplicants = applicantsEachBatch.map((item) =>
    //                 item.applicationInfo.application_id === id
    //                     ? {
    //                           ...item,
    //                           applicationInfo: {
    //                               ...item.applicationInfo,
    //                               score: score,
    //                           },
    //                       }
    //                     : item
    //             );
    //             setApplicantsEachBatch(updatedApplicants);

    //             // Show success message
    //             toast.success("Score updated successfully.");
    //         } else {
    //             toast.error("Error: " + response.data.message);
    //         }
    //     } catch (error) {
    //         console.error("Error updating score:", error);
    //         toast.error("Failed to update score");
    //     }
    // };

    const handleAddScore = async (id) => {
        setEdit(false);
        setEditingId(null);

        // Check if the user cancelled or submitted an empty string
        if (!score || score < 0) {
            return; // Exit if cancelled or empty
        }

        try {
            // Create the data structure for the update
            const data = {
                id: id,
                score: score, // Changed from procedure to score
            };

            // Send the PUT request with the data in the body
            const response = await axios.post(
                `http://localhost:8000/app/views/scores.php`, // Updated endpoint
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
                const updatedApplicants = applicantsEachBatch.map((item) =>
                    item.applicationInfo.application_id === id
                        ? {
                              ...item,
                              applicationInfo: {
                                  ...item.applicationInfo,
                                  score: score,
                              },
                          }
                        : item
                );
                setApplicantsEachBatch(updatedApplicants);

                // Show success message
                toast.success("Score updated successfully.");
            } else {
                toast.error("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating score:", error);
            toast.error("Failed to update score");
        }
    };

    // Handle batch selection change - FIXED
    const handleBatchChange = (e) => {
        const newBatchValue = e.target.value;
        setSelectedBatch(newBatchValue);
        setCurrentPage(1); // Reset to first page when changing batches
        console.log("Selected batch:", newBatchValue);
    };

    // const updateBatchToUnassigned = async (id) => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.put(
    //             "http://localhost:8000/app/views/batch-examination.php",
    //             {
    //                 id: id,
    //             }
    //         );
    //         console.log(response.data.message); // Success message

    //         // Refresh the data after approval
    //         await fetchApplicantsEachBatch();

    //         // Optional: Show success notification
    //         toast.success("Successfully updated to unassigned.");
    //     } catch (err) {
    //         console.error("Error updating application batch:", err);
    //         setError("Failed to update application.");
    //         setLoading(false);
    //     }
    // };

    // Filter data based on search term
    const filteredApplications = applicantsEachBatch.filter((applicant) => {
        // First check if the applicant and nested objects exist
        if (
            !applicant ||
            !applicant.applicationInfo ||
            !applicant.personalInfo
        ) {
            return false;
        }

        // Now safely access the properties
        const { applicationInfo, personalInfo } = applicant;

        return (
            applicationInfo.application_id.toString().includes(searchTerm) ||
            applicationInfo.application_status
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            personalInfo.last_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            personalInfo.middle_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            personalInfo.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            personalInfo.created_at?.includes(searchTerm) ||
            ""
        );
    });

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

    // Handle successful batch creation
    const handleBatchCreated = () => {
        fetchBatches(); // Refresh the batches list
    };

    const getSchedule = (selectedBatch) => {
        if (selectedBatch === "all") return false;
        const batch = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );
        return batch.schedule;
    };

    // Find the batch name from the batch ID
    const getBatchName = (batchId) => {
        const batch = batches.find((b) => b.id === batchId);
        return batch ? batch.batch_name : "Unassigned";
    };

    const handleSendSchedule = () => {
        applicantsEachBatch.forEach((applicant) => {
            const { applicationInfo, personalInfo } = applicant;
            sendExaminationSchedule(
                applicant.application_id,
                applicationInfo,
                personalInfo,
                getDateAndTime,
                setLoading,
                setError
            );
        });
    };

    const getDateAndTime = () => {
        if (selectedBatch === "all") return false;

        const batch = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );

        const datetimeString = batch.schedule; // Assuming format: "2025-05-22 11:51:21"
        if (!datetimeString) return false;

        const dateObj = new Date(datetimeString);

        // Format date: "January 20, 2026"
        const formattedDate = dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Format time: "10:00 AM"
        const formattedTime = dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return { date: formattedDate, time: formattedTime };
    };

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Applications
                    </h2>

                    <div className="flex items-center space-x-4">
                        {/* Batch Dropdown - FIXED */}
                        <div className="relative">
                            <select
                                value={selectedBatch}
                                onChange={handleBatchChange}
                                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                            >
                                <option value="all">All Batches</option>
                                {batches.map((batch) => (
                                    <option
                                        key={batch.id}
                                        value={batch.batch_name}
                                    >
                                        {batch.batch_name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

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
                                className="pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <p className="mt-2 text-gray-500">Loading...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="text-center py-10 bg-red-50 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* No batches state */}
                {!loading && !error && batches.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
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
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No batches available
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new batch.
                        </p>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && batches.length > 0 && (
                    <div className="overflow-x-auto rounded-[4px] border border-gray-200">
                        <table className="w-[1160px] divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-gray-800 font-bold">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-3 text-center text-xs uppercase tracking-wider"
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
                                        Batch
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
                                        Exam Schedule
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-center text-xs uppercase tracking-wider"
                                    >
                                        Score
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 text-center text-xs font-medium uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-xs">
                                {currentItems.length > 0 ? (
                                    currentItems.map((info, index) => {
                                        const {
                                            applicationInfo,
                                            personalInfo,
                                        } = info;

                                        return (
                                            <tr
                                                key={index}
                                                className="transition-colors text-center"
                                            >
                                                <td className="py-3 whitespace-nowrap text-gray-500">
                                                    {
                                                        applicationInfo.application_id
                                                    }
                                                </td>
                                                <td className="py-3 whitespace-nowrap font-medium text-gray-500">
                                                    {personalInfo.last_name +
                                                        ", " +
                                                        personalInfo.middle_name +
                                                        ", " +
                                                        personalInfo.first_name}
                                                </td>
                                                <td className="py-3 whitespace-nowrap text-gray-500">
                                                    {applicationInfo.batch}
                                                </td>
                                                <td className="py-3 whitespace-nowrap text-gray-500">
                                                    {formatDateTime(
                                                        personalInfo.created_at
                                                    )}
                                                </td>
                                                <td className="py-3 whitespace-nowrap text-gray-500">
                                                    {formatDateTime(
                                                        getSchedule(
                                                            applicationInfo.batch
                                                        )
                                                    ) || "Not Set"}
                                                </td>
                                                <td className="py-3 text-center whitespace-nowrap text-gray-500">
                                                    {edit &&
                                                    editingId ===
                                                        applicationInfo.application_id ? (
                                                        <input
                                                            className="p-1 w-16 text-center border-[1px] outline-green-500"
                                                            type="text"
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={score}
                                                        />
                                                    ) : (
                                                        <span>
                                                            {applicationInfo.score}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 whitespace-nowrap font-medium">
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                edit &&
                                                                editingId ===
                                                                    applicationInfo.application_id
                                                            ) {
                                                                handleAddScore(
                                                                    applicationInfo.application_id
                                                                );
                                                            } else {
                                                                handleButtonState(
                                                                    applicationInfo.application_id,
                                                                    applicationInfo.score ||
                                                                        ""
                                                                );
                                                            }
                                                        }}
                                                        className={`inline-flex items-center ${applicationInfo.score != null ? 'text-blue-600 hover:text-blue-900' : 'text-green-600 hover:text-green-900'}`}
                                                    >
                                                        {applicationInfo.score != null ? (
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                        ) : (
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z"
                                                                />
                                                            </svg>
                                                        )}
                                                        {edit &&
                                                        editingId ===
                                                            applicationInfo.application_id
                                                            ? "Save"
                                                            : applicationInfo.score != null
                                                            ? "Edit Score"
                                                            : "Add Score"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-3"
                                        >
                                            <div className="flex flex-col items-center justify-center">
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
                                                <p className="text-gray-500">
                                                    {selectedBatch === "all"
                                                        ? "No applications found. Try adjusting your search."
                                                        : "No applications in this batch. Students may need to be assigned."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Bottom controls area */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center">
                        {selectedBatch !== "all" && (
                            <>
                                <SetScheduleForm
                                    isOpen={isModalOpen}
                                    setIsOpen={setIsModalOpen}
                                    batches={batches}
                                    selectedBatch={selectedBatch}
                                    onSuccess={fetchBatches}
                                />
                                <button
                                    onClick={handleSendSchedule}
                                    className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
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
                                    Send Email
                                </button>
                            </>
                        )}
                        <BatchActions
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            onSuccess={handleBatchCreated}
                            selectedBatch={selectedBatch}
                            batches={batches}
                            setBatches={setBatches}
                            applicantsEachBatch={applicantsEachBatch}
                        />
                    </div>

                    {!loading && filteredApplications.length > 0 && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
