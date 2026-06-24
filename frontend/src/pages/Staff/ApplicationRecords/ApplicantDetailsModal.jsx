import { useEffect, useRef, useState } from "react";
import InputModal from "../../../components/InputModal";
import {
    Ban,
    Calendar,
    Download,
    Files,
    FileText,
    Hash,
    Loader,
    User,
} from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { useApplicationFiles } from "../../../hooks/useApplicationFiles";
import BASE_URL from "../../../config";
import pdfIcon from "../../../assets/pdf.png";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

function ApplicantDetailsModal({
    schoolYear,
    applicant,
    isOpen,
    onClose,
    label,
    viewPdf,
    downloadPdf,
}) {
    const {
        is_application_approved,
        is_application_rejected,
        is_examination_passed,
        is_examination_failed,
        is_initial_interview_passed,
        is_initial_interview_failed,
        is_home_visitation_qualified,
        is_home_visitation_not_qualified,
        is_final_interview_passed,
        is_final_interview_failed,
        is_attended_orientation,
        is_not_attended_orientation,
        is_attended_awarding,
        is_not_attended_awarding,
    } = applicant ?? {};

    const BASE_PUBLIC_URL = `${BASE_URL}public/`;

    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const [existingFiles, setExistingFiles] = useState([]);
    const [existingFilesRemoved, setExistingFilesRemoved] = useState([]);

    const { applicationFiles, fetchApplicationFiles } = useApplicationFiles();

    useEffect(() => {
        if (isOpen && applicant?.application_id) {
            fetchApplicationFiles(null, applicant?.application_id);
        } else {
            setFilePreviews([]);
            setExistingFiles([]);
        }
    }, [applicant?.application_id, isOpen]);

    useEffect(() => {
        if (applicationFiles[0]?.files?.length > 0) {
            const existingPreviews = applicationFiles[0].files.map((file) => ({
                id: file.id,
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                file_path: file.file_path,
                file_url: file.file_url,
                preview: file.file_type.startsWith("image/")
                    ? `${BASE_URL}public/${file.file_path}`
                    : null,
                isConverting: false,
                isExisting: true,
                originalFile: null,
            }));

            setFilePreviews(existingPreviews);
        }
    }, [applicationFiles]);

    const { activeSchoolYear } = useSchoolYearContext();

    const isPdf = (type) => type === "application/pdf";
    const isImage = (type) => type && type.startsWith("image/");

    const stages = [
        {
            stage: "Application Approved",
            result: is_application_approved,
        },
        {
            stage: "Application Rejected",
            result: is_application_rejected,
        },
        {
            stage: "Entrance Examination Passed",
            result: is_examination_passed,
        },
        { stage: "Entrance Examination Failed", result: is_examination_failed },
        { stage: "Interview Passed", result: is_initial_interview_passed },
        { stage: "Interview Failed", result: is_initial_interview_failed },
        {
            stage: "Home Visitation Qualified",
            result: is_home_visitation_qualified,
        },
        {
            stage: "Home Visitation Not Qualified",
            result: is_home_visitation_not_qualified,
        },
        { stage: "Final Interview Passed", result: is_final_interview_passed },
        { stage: "Final Interview Failed", result: is_final_interview_failed },
        { stage: "Attended Orientation", result: is_attended_orientation },
        {
            stage: "Did Not Attend Orientation",
            result: is_not_attended_orientation,
        },
        { stage: "Attended Awarding", result: is_attended_awarding },
        { stage: "Did Not Attend Awarding", result: is_not_attended_awarding },
    ];

    const filteredStages = [];

    stages.forEach((stage) => {
        if (
            stage.result &&
            (stage.stage.includes("Approved") ||
                stage.stage.includes("Passed") ||
                stage.stage.includes("Qualified") ||
                stage.stage.includes("Attended"))
        ) {
            filteredStages.push(stage);
        } else if (
            stage.result &&
            (stage.stage.includes("Rejected") ||
                stage.stage.includes("Failed") ||
                stage.stage.includes("Not Qualified") ||
                stage.stage.includes("Dit Not Attend"))
        ) {
            filteredStages.push(stage);
            return;
        }
    });

    const resetFields = () => {};

    const handleCancel = (e) => {
        e.preventDefault();
        onClose(false);
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
            // onSubmit={handleSubmit}
            onCancel={handleCancel}
            disabledButtonSave={true}
            // isLoading={isLoading}
        >
            <div className="p-6 space-y-6">
                <div className="bg-gray-50/50 border border-gray-200 rounded-md p-4 shadow-sm transition-shadow">
                    <h2 className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        Applicant Information
                    </h2>

                    <div className="grid grid-cols-1 gap-1.5">
                        <div className="flex items-center gap-3 group">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">
                                    Application ID
                                </p>
                                <p className="text-xs text-gray-700 font-semibold">
                                    {applicant?.application_id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 group">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">
                                    Applicant Name
                                </p>
                                <p className="text-xs text-gray-700 font-semibold">
                                    {applicant?.first_name}{" "}
                                    {applicant?.last_name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 group">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">
                                    School Year
                                </p>
                                <p className="text-xs text-gray-700 font-semibold">
                                    {applicant?.school_year}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 group">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">
                                    Date Applied
                                </p>
                                <p className="text-xs text-gray-700 font-semibold">
                                    {formatDate(applicant?.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="space-y-0.5 bg-gray-50/50 border border-gray-200 rounded-md p-4 shadow-sm transition-shadow">
                    <h2 className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        Application Status
                    </h2>
                    {filteredStages.length === 0 ? (
                        <>
                            {schoolYear === activeSchoolYear ? (
                                <li className="text-xs flex gap-2 text-gray-600">
                                    <Loader className="w-4 h-4" />
                                    Pending
                                </li>
                            ) : (
                                <li className="text-xs flex gap-2 text-gray-600">
                                    <Ban className="w-4 h-4" />
                                    Closed
                                </li>
                            )}
                        </>
                    ) : (
                        filteredStages.map((stage, index) => (
                            <li key={index} className="text-xs text-gray-600">
                                {stage.stage.includes("Passed") ||
                                stage.stage.includes("Approved") ||
                                stage.stage.includes("Qualified") ||
                                stage.stage.includes("Attended")
                                    ? "✅"
                                    : "❌"}{" "}
                                {stage.stage}
                            </li>
                        ))
                    )}
                </ul>

                <div className="space-y-0.5 bg-gray-50/50 border border-gray-200 rounded-md p-4 shadow-sm transition-shadow">
                    <h2 className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        Application Files
                    </h2>
                    {filePreviews.length > 0 && (
                        <ul className="mt-2 w-full text-sm text-gray-700 grid md:grid-cols-2 gap-2">
                            {filePreviews.map((filePreview, index) => (
                                <li
                                    key={
                                        filePreview.isExisting
                                            ? `existing-${filePreview.id}`
                                            : `new-${index}`
                                    }
                                    title={filePreview.name}
                                    className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                >
                                    <div className="flex items-center">
                                        {isImage(filePreview.type) ? (
                                            <img
                                                src={
                                                    filePreview?.file_url
                                                        ? filePreview?.file_url
                                                        : filePreview.preview
                                                }
                                                alt={filePreview.name}
                                                className="w-12 h-12 object-cover rounded mr-2"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : isPdf(filePreview.type) ? (
                                            <img
                                                src={pdfIcon}
                                                alt={filePreview.name}
                                                className="w-12 h-12 object-cover rounded mr-2"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-red-100 rounded mr-2 flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-red-600"
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
                                            </div>
                                        )}

                                        <div>
                                            <div className="w-full md:w-[150px] lg:w-[100px] font-medium text-gray-700 flex items-center text-xs">
                                                <p className="truncate">
                                                    {filePreview.name}
                                                </p>
                                                {isImage(
                                                    filePreview.file_type,
                                                ) && (
                                                    <img
                                                        src={`${BASE_PUBLIC_URL}/${filePreview.file_path}`}
                                                        alt={
                                                            filePreview.file_name
                                                        }
                                                        className="w-12 h-12 object-cover rounded mr-2"
                                                    />
                                                )}
                                            </div>
                                            {/* <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div> */}
                                            {isPdf(filePreview.type) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();

                                                        window.open(
                                                            filePreview.file_url,
                                                            "_blank",
                                                        );
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1.5"
                                                >
                                                    Click to view PDF
                                                </button>
                                            )}

                                            {isImage(filePreview.type) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.open(
                                                            filePreview.file_url,
                                                            "_blank",
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1.5"
                                                >
                                                    Click to view image
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="hover:text-red-700 text-red-500 p-1"
                                        type="button"
                                        disabled={isSubmitting}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 6l12 12M18 6l-12 12"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {filePreviews.length < 1 && (
                        <p className="text-center text-xs text-gray-500 flex flex-col items-center gap-1">
                            <Files className="w-6 h-6 text-gray-500/80" />
                            No applications files.
                        </p>
                    )}
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        onClick={() =>
                            viewPdf({
                                applicationId: applicant.application_id,
                                scholarId: applicant.scholar_id,
                            })
                        }
                        className="px-3 py-2.5 rounded-lg text-xs text-white bg-green-600 hover:bg-green-700 flex items-center"
                    >
                        <FileText className="w-4 h-4 mr-1" /> View Pdf
                    </button>
                    <button
                        onClick={() =>
                            downloadPdf({
                                applicationId: applicant.application_id,
                                scholarId: applicant.scholar_id,
                            })
                        }
                        className="px-3 py-2.5 rounded-lg text-xs text-green-800 border border-green-600 hover:bg-gray-100 flex items-center"
                    >
                        <Download className="w-4 h-4 mr-1 text-green-800" />{" "}
                        Download Pdf
                    </button>
                </div>
            </div>
        </InputModal>
    );
}

export default ApplicantDetailsModal;
