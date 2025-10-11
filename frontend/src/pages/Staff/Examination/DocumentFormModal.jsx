import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";

function DocumentFormModal({ isOpen, setIsOpen, onSuccess }) {
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    console.log(files);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const activityData = {
                activity: {
                    application_id: user?.user_id,
                    activity_status: "Pending",
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
                        return;
                    }
                }

                activityData.uploaded_files = uploadedFiles;
            }

            console.log("Submitting activity data:", activityData);

            // Submit the data
            const response = await fetch(
                `${BASE_URL}app/views/activities.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(activityData),
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

    return (
        <InputModal
            label={"Examination Files"}
            isOpen={isOpen}
            onClose={setIsOpen}
            resetFields={null}
            expandable={true}
        >
            <form onSubmit={handleSubmit} className="px-8 py-4">
                <div className="">
                    <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Files
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
                            className="p-2 flex justify-center items-center gap-[1px] text-gray-600 text-sm rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                            disabled={isSubmitting}
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
                            <span className="block text-xs">Click to Select</span>
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
                                            <div className="font-medium text-gray-700 flex items-center">
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

                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-gray-100 text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isSubmitting ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>
            </form>
        </InputModal>
    );
}

export default DocumentFormModal;