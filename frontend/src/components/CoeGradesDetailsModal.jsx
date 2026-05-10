import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import pdfIcon from "../assets/pdf.png";

const CoeGradesDetailsModal = React.memo(({ isOpen, onClose, submission }) => {
    const [filePreviews, setFilePreviews] = useState([]);
    useEffect(() => {
        // Reset file previews when scholar data changes
        if (submission && submission?.files) {
            setFilePreviews(submission?.files);
        }
    }, [submission]);

    const isPdf = (type) => type === "application/pdf";
    const isImage = (type) => type && type.startsWith("image/");

    const openPdfViewer = (filePreview) => {
        setSelectedPdf(filePreview);
    };

    return (
        <div>
            {isOpen && (
                <div
                    className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200 ${
                        isOpen ? "block" : "hidden"
                    }`}
                    // onKeyDown={handleKeyDown}
                    // onClick={handleBackdropClick}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className={`
                        relative bg-white rounded-sm shadow-2xl w-full
                        sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%]
                        transition-transform duration-300
                        ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}

                        absolute bottom-0 sm:relative sm:bottom-auto flex flex-col h-auto
                    `}
                    >
                        {/* Header */}
                        <div className="relative px-4 py-4 rounded-t-sm border-b bg-gray-100 border-slate-200">
                            <h2
                                id="modal-title"
                                className="text-sm text-slate-700 pr-10 leading-tight"
                            >
                                Certificate of Enrollment and Grade
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose(false);
                                }}
                                className="absolute top-2 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Close modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="border max-h-[550px] overflow-y-auto scroll-smooth ">
                            {/* Event Details Grid */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-gray-700 text-xs">
                                            Year Level:{" "}
                                            <span className="font-bold">
                                                {submission.year_level === 1
                                                    ? "1st Year"
                                                    : submission.year_level ===
                                                        2
                                                      ? "2nd Year"
                                                      : submission.year_level ===
                                                          3
                                                        ? "3rd Year"
                                                        : submission.year_level ===
                                                            4
                                                          ? "4th Year"
                                                          : "5th Year"}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 text-xs">
                                            Semester:&nbsp;{" "}
                                            <span className="font-bold">
                                                {submission?.semester}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {filePreviews.length > 0 && (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1 text-sm text-gray-700">
                                        {filePreviews.map(
                                            (filePreview, index) => (
                                                <li
                                                    key={
                                                        filePreview.id || index
                                                    }
                                                    className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                                >
                                                    <div className="flex items-center">
                                                        {isImage(
                                                            filePreview.file_type,
                                                        ) ? (
                                                            <img
                                                                src={
                                                                    filePreview.file_url
                                                                }
                                                                alt={
                                                                    filePreview.name
                                                                }
                                                                className="w-12 h-12 object-cover rounded mr-2"
                                                            />
                                                        ) : isPdf(
                                                              filePreview.file_type,
                                                          ) ? (
                                                            <img
                                                                src={pdfIcon}
                                                                alt={
                                                                    filePreview.name
                                                                }
                                                                className="w-12 h-12 object-cover rounded mr-2"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}

                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-700 flex items-center">
                                                                <p
                                                                    className="truncate max-w-[150px]"
                                                                    title={
                                                                        filePreview.file_name
                                                                    }
                                                                >
                                                                    {
                                                                        filePreview.file_name
                                                                    }
                                                                </p>
                                                            </div>
                                                            {isPdf(
                                                                filePreview.file_type,
                                                            ) && (
                                                                <button
                                                                    onClick={() =>
                                                                        window.open(
                                                                            filePreview.file_url,
                                                                            "_blank",
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                >
                                                                    Click to
                                                                    view PDF
                                                                </button>
                                                            )}
                                                            {isImage(
                                                                filePreview.file_type,
                                                            ) && (
                                                                <button
                                                                    onClick={() =>
                                                                        window.open(
                                                                            filePreview.file_url,
                                                                            "_blank",
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                >
                                                                    Click to
                                                                    view image
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 p-3.5 border-t border-gray-300">
                                <button
                                    onClick={() => {
                                        onClose(false);
                                        setIsRevoked(false);
                                        setAction("");
                                    }}
                                    type="button"
                                    className="w-[20%] text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default CoeGradesDetailsModal;
