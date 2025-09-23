import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { toast } from "react-toastify";
import { formatDateTime } from "../../../utils/formatDateTime";
import { generatePDF } from "../../../utils/generatePdf";
import { useApplicantData } from "../../../hooks/useApplicantData";

export default function NewApprovedApplications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedApplications, setSelectedApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState([]);
    const [applicationId, setApplicationId] = useState(null);
    const { fetchApplicantData } = useApplicantData();
    // Fetch student data from the API

    const fetchStudentsData = async (id) => {
        try {
            setLoading(true);
            // const response = await axios.get(
            //     `http://localhost:8000/app/views/application-examination.php?application_status=Approved&application_status=Examination&status=New`
            // );
            const response = await axios.get(
                `http://localhost:8000/app/views/applicants.php?approved=1&status=New`
            );
            setStudentData(response.data.data || []);
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
                    // studentId: studentId,
                    studentIds: selectedApplications,
                    status: "Examination",
                    batch: "Unassigned",
                }
            );
            // toast.success(response.data.message + "."); // Success message
            toast.success("Status successfully updated." + ".");

            // Refresh the data after approval
            await fetchStudentsData();
        } catch (err) {
            console.error("Error updating application status:", err);
            setError("Failed to approve application.");
            setLoading(false);
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

    const toggleApplicationSelection = (scholarId) => {
        setSelectedApplications((prev) => {
            if (prev.includes(scholarId)) {
                return prev.filter((id) => id !== scholarId);
            } else {
                return [...prev, scholarId];
            }
        });
    };

    const selectAllVisible = () => {
        const visibleIds = currentItems.map((item) => item.application_id);
        // item.application_status !== "Examination"
        if (selectedApplications.length === visibleIds.length) {
            // If all are selected, deselect all
            setSelectedApplications([]);
        } else {
            // Otherwise select all visible
            setSelectedApplications(visibleIds);
        }
    };

    const [profilePics, setProfilePics] = useState({});

    // Get profile picture URL for display
    const getProfilePicture = async (applicationId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/backend/api/applications/${applicationId}/profile-picture`
            );
            console.log(response.data.profile_picture_url);
            return response.data.profile_picture_url;
        } catch (error) {
            console.error("Error fetching profile picture:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchAllPics = async () => {
            const pics = {};
            for (const app of studentData) {
                const url = await getProfilePicture(app.application_id);
                pics[app.application_id] = url;
            }
            setProfilePics(pics);
        };
        fetchAllPics();
    }, [studentData]);

    const handleViewPdf = async (id) => {
        try {
            // Set the application ID first
            setApplicationId(id);

            // Fetch applicant data and wait for it to complete
            const data = await fetchApplicantData(id);

            // Use the returned data directly instead of relying on state
            if (data) {
                await generatePDF("view", id, data);
            } else {
                console.error("No applicant data received");
                alert("Unable to generate PDF: No applicant data found");
            }
        } catch (error) {
            console.error("Error in handleViewPdf:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Applications
                    </h2>

                    <div className="flex items-center space-x-4">
                        {/* Batch Dropdown - FIX: Use id as value instead of batch_name */}
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500">
                                <option value={new Date()}>Today</option>
                                <option value="">2025</option>
                                <option value="">2026</option>
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
                                className="pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    {/* <table className="w-[1160px] divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-800 font-bold">
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
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-xs">
                            {currentItems.map((info, index) => (
                                <tr
                                    key={info.application_id}
                                    className={` transition-colors text-center`}
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.application_id}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium text-gray-500">
                                        {info.first_name + " " + info.last_name}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.approved_at
                                            ? formatDateTime(info.approved_at)
                                            : "--"}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium">
                                        <ApplicationFormPDF
                                            studentId={info.application_id}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}

                    <table className="lg:w-[100%] min-w-[1000px] relative border border-gray-100">
                        <thead className="bg-gray-50 text-gray-700 font-bold">
                            <tr className="border-b border-gray-100">
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
                                    Applicant
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 pr-12 text-center text-xs uppercase tracking-wider"
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
                                    className="py-3 pr-12 text-right text-xs uppercase tracking-wider"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs">
                            {currentItems.map((info) => (
                                <tr
                                    key={info.application_id}
                                    className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-900 font-bold">
                                        {info.application_id}
                                    </td>
                                    <td className="py-3 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                        <div className="w-[max-content] ml-28 flex text-left gap-2">
                                            <img
                                                src={
                                                    profilePics[
                                                        info.application_id
                                                    ]
                                                }
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                            />
                                            <div>
                                                <p className="font-bold">
                                                    {info.first_name +
                                                        " " +
                                                        info.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {info.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-14 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {info.approved_at
                                            ? formatDateTime(info.approved_at)
                                            : "--"}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-center font-medium">
                                        <button
                                            onClick={() =>
                                                handleViewPdf(
                                                    info.application_id
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-5 h-5 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDownloadPdf(
                                                    info.application_id
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-5 h-5 text-green-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"
                                                />
                                            </svg>
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
