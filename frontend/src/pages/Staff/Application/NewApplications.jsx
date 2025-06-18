import { useEffect, useState } from "react";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import { formatDateTime } from "../../../utils/formatDateTime";
import { manageApplication } from "../../../services/applicationService";
import { useApplications } from "../../../hooks/useApplications";
import SearchInput from "../../../components/SearchInput";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import axios from "axios";
import ApplicationFormPDFCopy from "../../../components/ApplicationFormPDFCopy";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { generatePDF } from "../../../utils/generatePdf";
import { convertImageToBase64 } from "../../../utils/convertImageToBase64";
import { getProfilePictureBase64 } from "../../../utils/getProfilePictureBase64";

export default function NewApplications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const itemsPerPage = 5;

    const { loading, error, applications, fetchApplications } =
        useApplications("New");
    const { approveApplication, rejectApplication } = manageApplication();
    const { applicantData, fetchApplicantData } = useApplicantData();

    console.log("Applications:", applications);

    // Filter data based on search term
    const filteredApplications = applications.filter(
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

    const {
        currentItems,
        currentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(filteredApplications, itemsPerPage);

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
            for (const app of applications) {
                const url = await getProfilePicture(app.application_id);
                pics[app.application_id] = url;
            }
            setProfilePics(pics);
        };
        fetchAllPics();
    }, [applications]);

    console.log("Profile Pictures:", profilePics);

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

    const handleDownloadPdf = async (id) => {
        try {
            // Set the application ID first
            setApplicationId(id);

            // Fetch applicant data and wait for it to complete
            const data = await fetchApplicantData(id);

            // Use the returned data directly instead of relying on state
            if (data) {
                await generatePDF("download", id, data);
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

                    {/* Search */}
                    <SearchInput
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={"Search applications..."}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-[4px]">
                    <table className="w-[1166px] relative border border-gray-100">
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
                                    className="py-3 text-center text-xs uppercase tracking-wider"
                                >
                                    Date Applied
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 pr-20 text-right text-xs uppercase tracking-wider"
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
                                        <div className="w-[max-content] ml-36 flex text-left gap-2">
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
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-3 pr-10 whitespace-nowrap text-right font-medium">
                                        {/* <button
                                            onClick={() =>
                                                handlePdfOpen(
                                                    info.application_id
                                                )
                                            }
                                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                                            disabled={loading}
                                        >
                                            PDF
                                        </button> */}

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
                                        <button
                                            onClick={() =>
                                                approveApplication(
                                                    info.application_id,
                                                    applications,
                                                    fetchApplications
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            disabled={loading}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-5 h-5 text-green-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M9 12l2 2 4-4M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                rejectApplication(
                                                    info.application_id,
                                                    applications,
                                                    fetchApplications
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            disabled={loading}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-5 h-5 text-red-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M15 9l-6 6M9 9l6 6M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"
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
                        <EmptyState message="No applications found." />
                    )}
                </div>

                {/* Pagination */}
                {filteredApplications.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredApplications.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}
            </div>

            {isOpen && <ApplicationFormPDFCopy studentId={applicationId} />}
        </div>
    );
}
