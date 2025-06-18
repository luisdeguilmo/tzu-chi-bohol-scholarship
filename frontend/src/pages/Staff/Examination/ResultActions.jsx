import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { proceedToInterview } from "../../../services/examinationService";

export default function ResultActions({
    isOpen,
    setIsOpen,
    selectedBatch,
    selectedApplicants,
    setLoading,
    applicantsEachBatch,
}) {
    const handleCancel = () => {
        setIsOpen(false);
    };

    const applicants = applicantsEachBatch.filter(
        (applicant) => applicant["applicationInfo"].score > 50
    );
    const ids = applicants.map((applicant) => applicant['applicationInfo'].application_id);

    return (
        <div>
            <div className="flex gap-2">
                {selectedApplicants === "passed" && selectedBatch === "all" && (
                    <button
                        onClick={() => proceedToInterview(ids)}
                        className="bg-white text-green-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
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
                        Send email for students who passed
                    </button>
                )}

                {selectedApplicants === "failed" && selectedBatch === "all" && (
                    <button
                        // onClick={handleCreateBatch}
                        className="bg-white text-green-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
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
                        Send email for students who failed
                    </button>
                )}
            </div>

            {/* Student Assignment Modal */}
            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-4 py-2 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Assign Students to Batch
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Here you would add your student assignment form content */}
                            <p className="text-gray-700 mb-4">
                                Select students to assign to the selected batch.
                            </p>

                            {/* Student selection would go here */}

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                    Assign Students
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
