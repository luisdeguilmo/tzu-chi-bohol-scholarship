import { useEffect, useRef, useState } from "react";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useAccountStatus } from "../../../hooks/useAccountStatus";

const EditFormModal = ({ isOpen, setIsOpen, submission, onSuccess }) => {
    const [yearLevel, setYearLevel] = useState(submission.year_level || "");
    const [semester, setSemester] = useState(submission.semester || "");
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [existingFilesRemoved, setExistingFilesRemoved] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [conversionStatus, setConversionStatus] = useState({});
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const { accountStatus } = useAccountStatus(user.user_id);

    const CLOUDCONVERT_API_KEY = "YOUR_API_KEY";

    useEffect(() => {
        if (submission?.files?.length > 0) {
            setExistingFiles(submission.files);

            const existingPreviews = submission.files.map((file) => ({
                id: file.id,
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                preview: file.file_type.startsWith("image/")
                    ? `${BASE_URL}public/${file.file_path}`
                    : null,
                isConverting: false,
                isExisting: true,
                originalFile: null,
            }));

            setFilePreviews(existingPreviews);
        }
    }, [submission]);

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
            isConverting: false,
            isExisting: false,
            originalFile: file,
        }));

        setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleAddFileClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        const fileToRemove = filePreviews[index];

        if (fileToRemove.isExisting) {
            const fileId = fileToRemove.id;
            setExistingFiles((prev) =>
                prev.filter((file) => file.id !== fileId)
            );
            setExistingFilesRemoved([...existingFilesRemoved, { id: fileId }]);
        } else {
            const newFilesIndex = files.findIndex(
                (file) => file === fileToRemove.originalFile
            );
            if (newFilesIndex !== -1) {
                const newFiles = [...files];
                newFiles.splice(newFilesIndex, 1);
                setFiles(newFiles);
            }

            if (fileToRemove.preview && !fileToRemove.isExisting) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
        }

        const newPreviews = [...filePreviews];
        newPreviews.splice(index, 1);
        setFilePreviews(newPreviews);

        setConversionStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[index];
            return newStatus;
        });
    };

    const handleChange = (setValue, value) => {
        setValue(value);
    };

    const handleCancel = (e) => {
        e.preventDefault();

        filePreviews.forEach((preview) => {
            if (preview.preview && !preview.isExisting) {
                URL.revokeObjectURL(preview.preview);
            }
        });

        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        setYearLevel("");
        setSemester("");
        setFiles([]);
        setFilePreviews([]);
        setExistingFiles([]);
        setConversionStatus({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const convertDocToPdf = async (file, fileIndex) => {
        // Keep your existing CloudConvert implementation
        // ... (same as in your original code)
    };

    const handleSubmit = async () => {
        if (accountStatus === "not_renewed") {
            toast.error(
                `You can't resubmit COE and grades until your renewal application is approved.`
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const submissionData = {
                submission: {
                    application_id: user?.user_id,
                    year_level: yearLevel,
                    semester: semester,
                    submission_status: "Pending",
                },
            };

            // Process files
            if (files.length > 0) {
                const uploadedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let processedFile = file;

                    try {
                        if (
                            file.type === "application/msword" ||
                            file.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                            toast.info(`Converting ${file.name} to PDF...`);
                            processedFile = await convertDocToPdf(file, i);

                            setFilePreviews((prev) => {
                                const newPreviews = [...prev];
                                if (newPreviews[i]) {
                                    newPreviews[i] = {
                                        ...newPreviews[i],
                                        name: processedFile.name,
                                        type: processedFile.type,
                                        size: processedFile.size,
                                    };
                                }
                                return newPreviews;
                            });
                        }

                        const base64Data =
                            await convertFileToBase64(processedFile);
                        uploadedFiles.push({
                            filename: processedFile.name,
                            base64_data: base64Data,
                            file_type: processedFile.type,
                            file_size: processedFile.size,
                        });
                    } catch (error) {
                        console.error("Error processing file:", error);
                        toast.error(`Failed to process file: ${file.name}`);
                        setIsSubmitting(false);
                        return;
                    }
                }

                submissionData.uploaded_files = uploadedFiles;
            }

            submissionData.existing_files = existingFiles;
            submissionData.removed_files = existingFilesRemoved;

            const response = await fetch(
                `${BASE_URL}app/views/coe_grades.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submissionData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                resetForm();
                setIsOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error("Error: " + result.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDocOrDocx = (fileType) => {
        return (
            fileType === "application/msword" ||
            fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
    };

    return (
        <InputModal
            label={
                submission.submission_status === "Not Recorded"
                    ? "Resubmit COE and Grades"
                    : "Edit COE and Grades"
            }
            isOpen={isOpen}
            onClose={setIsOpen}
            resetFields={null}
            expandable={true}
            buttonLabel={"Resubmit"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
        >
            <div>
                <div className="py-4 overflow-y-auto scroll-smooth h-[400px]">
                    <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Year Level
                            <select
                                required
                                value={yearLevel}
                                onChange={(e) =>
                                    handleChange(setYearLevel, e.target.value)
                                }
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select year level</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="5th Year">5th Year</option>
                            </select>
                        </label>

                        <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Semester
                            <select
                                required
                                value={semester}
                                onChange={(e) =>
                                    handleChange(setSemester, e.target.value)
                                }
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select semester</option>
                                <option value="1st Semester">
                                    1st Semester
                                </option>
                                <option value="2nd Semester">
                                    2nd Semester
                                </option>
                                <option value="Summer">Summer</option>
                            </select>
                        </label>
                    </div>

                    <label className="px-8 pt-2 pb-3 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Upload Documents (COE and Grades)
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx"
                            style={{ display: "none" }}
                        />
                        <button
                            type="button"
                            onClick={handleAddFileClick}
                            className="px-2 py-2.5 flex justify-center gap-[1px] text-gray-600 text-xs rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                            disabled={isSubmitting}
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
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add File
                        </button>
                    </label>

                    {filePreviews.length > 0 && (
                        <ul className="px-8 mt-2 w-full text-sm text-gray-700 grid md:grid-cols-2 gap-2">
                            {filePreviews.map((filePreview, index) => (
                                <li
                                    key={
                                        filePreview.isExisting
                                            ? `existing-${filePreview.id}`
                                            : `new-${index}`
                                    }
                                    className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                >
                                    <div className="flex items-center">
                                        {filePreview.type &&
                                        filePreview.type.startsWith("image/") &&
                                        filePreview.preview ? (
                                            <img
                                                src={filePreview.preview}
                                                alt={filePreview.name}
                                                className="w-12 h-12 object-cover rounded mr-2"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-red-100 rounded mr-2 flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
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
                                            <div className="font-medium text-gray-700 flex items-center">
                                                {filePreview.name}
                                                {!filePreview.isExisting &&
                                                    isDocOrDocx(
                                                        filePreview.type
                                                    ) && (
                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                            Will convert to PDF
                                                        </span>
                                                    )}
                                            </div>
                                            {conversionStatus[index] && (
                                                <div
                                                    className={`text-xs mt-1 ${
                                                        conversionStatus[index]
                                                            .status === "error"
                                                            ? "text-red-500"
                                                            : conversionStatus[
                                                                    index
                                                                ].status ===
                                                                "completed"
                                                              ? "text-green-500"
                                                              : "text-blue-500"
                                                    }`}
                                                >
                                                    {
                                                        conversionStatus[index]
                                                            .message
                                                    }
                                                </div>
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

                    {submission.submission_status === "Not Recorded" && (
                        <div className="px-8 pt-6 pb-8">
                            <p className="text-xs mb-1 text-gray-700">
                                Feedback:{" "}
                            </p>
                            <p className="text-xs border bg-gray-50 px-2 py-2.5 rounded-md text-gray-700">
                                {submission.feedback}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </InputModal>
    );
};

export default EditFormModal;
