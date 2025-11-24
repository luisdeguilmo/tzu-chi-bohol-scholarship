import { useEffect, useState } from "react";
import InputModal from "../../../components/InputModal";
import { Calendar, Download, FileText, Hash, Loader, User } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";

function ApplicantDetailsModal({
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

                {/* <div className="text-xs text-gray-600 flex items-start gap-10 border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex flex-col gap-1 font-medium text-gray-700">
                        <p>Application ID</p>
                        <p>Applicant Name</p>
                        <p>Date Applied</p>
                    </div>

                    <div className="flex flex-col gap-1 text-gray-400">
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                    </div>

                    <div className="flex flex-col gap-1 text-gray-700">
                        <p>{applicant?.application_id}</p>
                        <p>
                            {applicant?.first_name} {applicant?.last_name}
                        </p>
                        <p>{formatDate(applicant?.created_at)}</p>
                    </div>
                </div> */}

                <ul className="space-y-0.5 bg-gray-50/50 border border-gray-200 rounded-md p-4 shadow-sm transition-shadow">
                    <h2 className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        Application Status
                    </h2>
                    {filteredStages.length === 0 ? (
                        <li className="text-xs flex gap-2 text-gray-600">
                            <Loader className="w-4 h-4" />
                            Pending
                        </li>
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
