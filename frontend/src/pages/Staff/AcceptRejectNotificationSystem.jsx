import { useState } from "react";

export default function AcceptRejectNotificationSystem() {
    const [students, setStudents] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@gmail.com",
            status: "pending",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@gmail.com",
            status: "pending",
        },
        {
            id: 3,
            name: "Michael Johnson",
            email: "michael.j@gmail.com",
            status: "pending",
        },
        {
            id: 4,
            name: "Sarah Williams",
            email: "sarah.w@gmail.com",
            status: "pending",
        },
        {
            id: 5,
            name: "Robert Brown",
            email: "robert.b@gmail.com",
            status: "pending",
        },
    ]);

    const [examInfo] = useState({
        examName: "Final Assessment Exam",
        examDate: "2025-05-01",
        institutionName: "Your Institution",
    });

    const sendAcceptanceEmail = (studentId) => {
        // In a real implementation, this would connect to Gmail API to send the acceptance email
        setStudents(
            students.map((student) =>
                student.id === studentId
                    ? { ...student, status: "accepted" }
                    : student
            )
        );
    };

    const sendRejectionEmail = (studentId) => {
        // In a real implementation, this would connect to Gmail API to send the rejection email
        setStudents(
            students.map((student) =>
                student.id === studentId
                    ? { ...student, status: "rejected" }
                    : student
            )
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "accepted":
                return (
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        Accepted
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-block bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full">
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
                Exam Results Notification System
            </h1>

            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium mb-2">Exam Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Exam Name:</p>
                        <p className="font-medium">{examInfo.examName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Exam Date:</p>
                        <p className="font-medium">
                            {formatDate(examInfo.examDate)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Applicants</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border text-left">
                                    Student Name
                                </th>
                                <th className="py-2 px-4 border text-left">
                                    Email
                                </th>
                                <th className="py-2 px-4 border text-left">
                                    Status
                                </th>
                                <th className="py-2 px-4 border text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4 border">
                                        {student.name}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {student.email}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {getStatusBadge(student.status)}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    sendAcceptanceEmail(
                                                        student.id
                                                    )
                                                }
                                                disabled={
                                                    student.status !== "pending"
                                                }
                                                className={`px-3 py-1 rounded text-sm ${
                                                    student.status !== "pending"
                                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    sendRejectionEmail(
                                                        student.id
                                                    )
                                                }
                                                disabled={
                                                    student.status !== "pending"
                                                }
                                                className={`px-3 py-1 rounded text-sm ${
                                                    student.status !== "pending"
                                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                        : "bg-red-600 text-white hover:bg-red-700"
                                                }`}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="font-medium text-green-800 mb-2">
                        Acceptance Letter Preview
                    </h3>
                    <div className="bg-white p-4 border rounded-md text-sm">
                        <p className="mb-2">[Current Date]</p>
                        <p className="mb-2">Dear [Student Name],</p>
                        <p className="mb-2">
                            We are pleased to inform you that you have
                            successfully passed the {examInfo.examName}
                            conducted on {formatDate(examInfo.examDate)}.
                        </p>
                        <p className="mb-2">
                            Congratulations on your outstanding performance!
                            This achievement marks an important milestone in
                            your academic journey. We encourage you to maintain
                            this level of excellence in all your future
                            endeavors.
                        </p>
                        <p className="mb-2">
                            If you have any questions or need further
                            information, please contact the examination office.
                        </p>
                        <p className="mt-4">Best regards,</p>
                        <p>Examination Committee</p>
                        <p>{examInfo.institutionName}</p>
                    </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="font-medium text-red-800 mb-2">
                        Rejection Letter Preview
                    </h3>
                    <div className="bg-white p-4 border rounded-md text-sm">
                        <p className="mb-2">[Current Date]</p>
                        <p className="mb-2">Dear [Student Name],</p>
                        <p className="mb-2">
                            We regret to inform you that you did not pass the{" "}
                            {examInfo.examName}
                            conducted on {formatDate(examInfo.examDate)}.
                        </p>
                        <p className="mb-2">
                            We understand this may be disappointing news. Please
                            note that this result does not define your
                            capabilities, and we encourage you to view this as
                            an opportunity for growth and improvement.
                        </p>
                        <p className="mb-2">
                            You are eligible to retake the exam in the next
                            session. Our office will be happy to provide
                            additional resources and support to help you prepare
                            better.
                        </p>
                        <p className="mb-2">
                            If you have any questions or need clarification
                            regarding your results, please contact the
                            examination office.
                        </p>
                        <p className="mt-4">Regards,</p>
                        <p>Examination Committee</p>
                        <p>{examInfo.institutionName}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">System Information</h3>
                <ul className="text-sm list-disc pl-5 text-gray-600">
                    <li>
                        Click "Accept" to automatically send an acceptance
                        letter to the student's email.
                    </li>
                    <li>
                        Click "Reject" to automatically send a rejection letter
                        to the student's email.
                    </li>
                    <li>
                        Once an action is taken, the student's status will
                        update and the buttons will be disabled.
                    </li>
                    <li>
                        For a real implementation, this would connect to your
                        Gmail account via the Gmail API.
                    </li>
                </ul>
            </div>
        </div>
    );
}
