// CoeGradesFormModal.jsx

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";
import { useAccountStatus } from "../../../hooks/useAccountStatus";

function CoeGradesFormModal({ isOpen, setIsOpen, yearLevel, onSuccess }) {
    const [semester, setSemester] = useState("");
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const { accountStatus } = useAccountStatus(user?.user_id);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
            originalFile: file,
        }));

        setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

        console.log(filePreviews);
    };

    const handleAddFileClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        const newPreviews = [...filePreviews];
        if (newPreviews[index]?.preview) {
            URL.revokeObjectURL(newPreviews[index].preview);
        }
        newPreviews.splice(index, 1);
        setFilePreviews(newPreviews);

        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleChange = (setValue, value) => {
        setValue(value);
    };

    const handleCancel = (e) => {
        e.preventDefault();

        // Clean up object URLs
        filePreviews.forEach((preview) => {
            if (preview.preview) {
                URL.revokeObjectURL(preview.preview);
            }
        });

        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        // setYearLevel("");
        setSemester("");
        setFiles([]);
        setFilePreviews([]);
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

    const handleSubmit = async () => {
        if (accountStatus === "not_renewed") {
            toast.error(
                `You can't submit COE and grades until your renewal application is approved.`
            );
            return;
        }

        setIsSubmitting(true);
        setIsLoading(true);

        try {
            // Validate required fields
            if (!yearLevel || !semester) {
                toast.error("Please fill in all required fields");
                setIsSubmitting(false);
                setIsLoading(false);
                return;
            }

            const submissionData = {
                submission: {
                    scholar_id: user?.user_id,
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

                    try {
                        const base64Data = await convertFileToBase64(file);
                        uploadedFiles.push({
                            filename: file.name,
                            base64_data: base64Data,
                            file_type: file.type,
                            file_size: file.size,
                        });
                    } catch (error) {
                        console.error("Error processing file:", error);
                        toast.error(`Failed to process file: ${file.name}`);
                        setIsSubmitting(false);
                        setIsLoading(false);
                        return;
                    }
                }

                submissionData.uploaded_files = uploadedFiles;
            }

            console.log("Submitting COE and grades data:", submissionData);

            // Submit the data
            const response = await fetch(
                `${BASE_URL}app/views/coe-grades.php`,
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
                toast.success(result.message + ".");

                // Clean up object URLs
                filePreviews.forEach((preview) => {
                    if (preview.preview) {
                        URL.revokeObjectURL(preview.preview);
                    }
                });

                resetForm();
                setIsOpen(false);

                if (onSuccess) onSuccess();
                setIsLoading(false);
            } else {
                toast.error(result.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    console.log(filePreviews);

    return (
        <InputModal
            label={"Submit COE and Grades"}
            isOpen={isOpen}
            onClose={setIsOpen}
            resetFields={null}
            expandable={true}
            buttonLabel={"Submit"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        >
            <div className="p-6">
                <div className="grid md:grid-cols-1 gap-2">
                    {/* <label className="py-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Year Level
                        <select
                            required
                            value={yearLevel}
                            onChange={(e) =>
                                handleChange(setYearLevel, e.target.value)
                            }
                            className="w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="">Select year level</option>
                            <option value={1}>1st Year</option>
                            <option value={2}>2nd Year</option>
                            <option value={3}>3rd Year</option>
                            <option value={4}>4th Year</option>
                            <option value={5}>5th Year</option>
                        </select>
                    </label> */}

                    <label className="py-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Semester
                        <select
                            required
                            value={semester}
                            onChange={(e) =>
                                handleChange(setSemester, e.target.value)
                            }
                            className="w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="" disabled>
                                -- Select --
                            </option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                        </select>
                    </label>
                </div>

                <div className="">
                    <label className="py-1 mt-2 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Upload Documents (COE and Grades)
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept=".jpeg,.jpg,.png"
                            style={{ display: "none" }}
                        />
                        <button
                            type="button"
                            onClick={handleAddFileClick}
                            className="py-2.5 px-2 flex justify-center items-center gap-[1px] text-gray-600 text-xs rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
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
                        <ul className="mt-2 w-full grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                            {filePreviews.map((filePreview, index) => (
                                <li
                                    key={index}
                                    className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                >
                                    <div className="flex items-center">
                                        {filePreview.type &&
                                            filePreview.type.startsWith(
                                                "image/"
                                            ) && (
                                                <img
                                                    src={filePreview.preview}
                                                    alt={filePreview.name}
                                                    className="w-12 h-12 object-cover rounded mr-2"
                                                />
                                            )}
                                        <div>
                                            <div className="font-medium text-gray-700">
                                                {filePreview.name}
                                            </div>
                                            <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div>
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
                </div>
            </div>
        </InputModal>
    );
}

export default CoeGradesFormModal;
