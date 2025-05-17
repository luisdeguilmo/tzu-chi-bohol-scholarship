import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationFormPDF from "../../components/ApplicationFormPDF";
import { toast } from "react-toastify";
import { formatDateTime } from "../../utils/formatDate";
import emailjs from "@emailjs/browser";

export default function Applications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState([]);

    // EmailJS configuration - replace with your actual service ID, template ID, and public key
    const EMAILJS_SERVICE_ID = "service_97rzw6o";
    const EMAILJS_TEMPLATE_ID = "template_zgcb5c1";
    const EMAILJS_PUBLIC_KEY = "jes1Va_kLko0tAZh5";

    const Reject = "template_5f51nna";

    const fetchStudentsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/applicants.php`
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

    const sendApprovalEmail = async (studentInfo) => {
        try {
            // Prepare the template parameters
            const templateParams = {
                to_name: `${studentInfo.first_name} ${studentInfo.last_name}`,
                to_email: studentInfo.email,
                school_year: studentInfo.school_year,
                applicant_name: `${studentInfo.first_name} ${
                    studentInfo.middle_name ? studentInfo.middle_name + " " : ""
                }${studentInfo.last_name}`,
                organization: "Tzu Chi Foundation Philippines - Bohol Office",
                contact_info: "tzuchibohol2014@gmail.com | 0998 885 5342",
            };

            // Send the email
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log("Email successfully sent!", response);
            return true;
        } catch (error) {
            console.error("Failed to send email:", error);
            return false;
        }
    };

    const sendRejectionEmail = async (studentInfo) => {
        try {
            // Prepare the template parameters
            const templateParams = {
                to_name: `${studentInfo.first_name} ${studentInfo.last_name}`,
                to_email: studentInfo.email,
                school_year: studentInfo.school_year,
                applicant_name: `${studentInfo.first_name} ${
                    studentInfo.middle_name ? studentInfo.middle_name + " " : ""
                }${studentInfo.last_name}`,
                organization: "Tzu Chi Foundation Philippines - Bohol Office",
                contact_info: "tzuchibohol2014@gmail.com | 0998 885 5342",
            };

            // Send the email
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                Reject,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log("Email successfully sent!", response);
            return true;
        } catch (error) {
            console.error("Failed to send email:", error);
            return false;
        }
    };

    const rejectStudentApplication = async (studentId) => {
        let confirmationId = window.prompt("Enter applicant's application ID:");

        if (+confirmationId === studentId) {
            try {
                setLoading(true);

                // 1. First update the application status
                const response = await axios.post(
                    "http://localhost:8000/app/views/update_application_status.php",
                    {
                        studentIds: [studentId],
                        status: "Rejected",
                    }
                );
                console.log(response.data.message);

                // 2. Find the student information to use in the email
                const studentToEmail = studentData.find(
                    (student) => student.application_id === studentId
                );

                // 3. Send the approval email
                if (studentToEmail) {
                    const emailSent = await sendRejectionEmail(studentToEmail);

                    if (emailSent) {
                        toast.success(
                            "Applicant rejected and notification email sent successfully!"
                        );
                    } else {
                        toast.warning(
                            "Applicant rejected but failed to send email notification."
                        );
                    }
                } else {
                    toast.warning(
                        "Applicant rejected but could not find email information."
                    );
                }

                // 4. Refresh the data after approval
                await fetchStudentsData();
                setLoading(false);
            } catch (err) {
                console.error("Error updating application status:", err);
                setError("Failed to approve application.");
                toast.error("Error approving application.");
                setLoading(false);
            }
        } else {
            toast.error("Incorrect application ID. Please try again.");
        }
    };

    const updateStudentApplication = async (studentId) => {
        let confirmationId = window.prompt("Enter applicant's application ID:");

        if (+confirmationId === studentId) {
            try {
                setLoading(true);

                // 1. First update the application status
                const response = await axios.post(
                    "http://localhost:8000/app/views/update_application_status.php",
                    {
                        studentIds: [studentId],
                        status: "Approved",
                    }
                );
                console.log(response.data.message);

                // 2. Find the student information to use in the email
                const studentToEmail = studentData.find(
                    (student) => student.application_id === studentId
                );

                // 3. Send the approval email
                if (studentToEmail) {
                    const emailSent = await sendApprovalEmail(studentToEmail);

                    if (emailSent) {
                        toast.success(
                            "Applicant rejected and notification email sent successfully!"
                        );
                    } else {
                        toast.warning(
                            "Applicant rejected but failed to send email notification."
                        );
                    }
                } else {
                    toast.warning(
                        "Applicant rejected but could not find email information."
                    );
                }

                // 4. Refresh the data after approval
                await fetchStudentsData();
                setLoading(false);
            } catch (err) {
                console.error("Error updating application status:", err);
                setError("Failed to approve application.");
                toast.error("Error approving application.");
                setLoading(false);
            }
        } else {
            toast.error("Incorrect application ID. Please try again.");
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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-100 text-green-800">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider"
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
                            {currentItems.map((info) => (
                                <tr
                                    key={info.application_id}
                                    className="transition-colors text-center"
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
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-4 whitespace-nowrap text-sm font-medium">
                                        <ApplicationFormPDF
                                            studentId={info.application_id}
                                        />
                                        <button
                                            onClick={() =>
                                                updateStudentApplication(
                                                    info.application_id
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            disabled={loading}
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
                                            Approve
                                        </button>
                                        <button
                                            onClick={() =>
                                                rejectStudentApplication(
                                                    info.application_id
                                                )
                                            }
                                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                                            disabled={loading}
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
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Reject
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
