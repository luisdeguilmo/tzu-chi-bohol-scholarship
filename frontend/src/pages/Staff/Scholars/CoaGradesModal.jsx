import { useEffect, useState } from "react";
import InputModal from "../../../components/InputModal";
import { useSubmissions } from "../../../hooks/useSubmissions";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import BASE_URL from "../../../config";

function CoaGradesModal({ scholarId, isOpen, onClose }) {
    const URL = `${BASE_URL}public/`;
    const { loading, submissions, fetchSubmissions } = useSubmissions(
        "all",
        scholarId,
        0
    );

    useEffect(() => {
        if (scholarId) {
            fetchSubmissions();
        }
    }, [scholarId]);

    const handleCancel = (e) => {
        e.preventDefault();
        onClose(false);
    };

    console.log(submissions);

    const [open, setOpen] = useState(null);

    const toggle = (id) => setOpen(open === id ? null : id);

    const isPdf = (type) => type === "application/pdf";
    const isImage = (type) => type && type.startsWith("image/");

    return (
        <InputModal
            label={"Certificate of Enrollment and Grades"}
            isOpen={isOpen}
            resetFields={null}
            onClose={onClose}
            onCancel={handleCancel}
            buttonLabel={"Save"}
            disabledButtonSave={true}
        >
            {loading && (
                <div className="p-6 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                    <span className="ml-2 text-sm text-gray-600">
                        Loading submissions...
                    </span>
                </div>
            )}

            <div className={`max-h-[500px] p-6 space-y-3 ${loading ? "hidden" : "block"}`}>
                {submissions.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-2">
                        No files submitted yet.
                    </p>
                ) : (
                    <>
                        {submissions.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                            >
                                {/* Header */}
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="text-left">
                                        <h3 className="text-xs font-medium text-gray-900">
                                            {item.year_level === 1
                                                ? "1st Year"
                                                : item.year_level === 2
                                                  ? "2nd Year"
                                                  : item.year_level === 3
                                                    ? "3rd Year"
                                                    : item.year_level === 4
                                                      ? "4th Year"
                                                      : "5th Year"}
                                        </h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            {item.semester}
                                        </p>
                                    </div>

                                    {open === item.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {open === item.id && (
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                            {item.files.map(
                                                (filePreview, index) => (
                                                    <li
                                                        key={
                                                            filePreview.id ||
                                                            index
                                                        }
                                                        className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                                    >
                                                        <div className="flex items-center w-full">
                                                            {/* PDF Preview */}
                                                            {isPdf(
                                                                filePreview.file_type
                                                            ) && (
                                                                <div className="w-12 h-12 bg-red-100 rounded mr-2 flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors flex-shrink-0">
                                                                    <svg
                                                                        onClick={() =>
                                                                            window.open(
                                                                                URL +
                                                                                    filePreview.file_path,
                                                                                "_blank"
                                                                            )
                                                                        }
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

                                                            {/* Image Preview */}
                                                            {isImage(
                                                                filePreview.file_type
                                                            ) && (
                                                                <img
                                                                    src={`${URL}${filePreview.file_path}`}
                                                                    alt={
                                                                        filePreview.file_name
                                                                    }
                                                                    className="w-12 h-12 object-cover rounded mr-2 flex-shrink-0"
                                                                />
                                                            )}

                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-gray-700">
                                                                    <p className="truncate">
                                                                        {
                                                                            filePreview.file_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {isPdf(
                                                                    filePreview.file_type
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                URL +
                                                                                    filePreview.file_path,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                    >
                                                                        Click to
                                                                        view PDF
                                                                    </button>
                                                                )}
                                                                {isImage(
                                                                    filePreview.file_type
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                URL +
                                                                                    filePreview.file_path,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                    >
                                                                        Click to
                                                                        view
                                                                        image
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </InputModal>
    );
}

export default CoaGradesModal;
