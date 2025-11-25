import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import InputModal from "./InputModal";

function FileUploadFormModal({
    label,
    type,
    isOpen,
    setIsOpen,
    applicationFiles,
    selectedId,
    onReUploadFiles,
    isLoading,
    onRefresh,
}) {
    const BASE_PUBLIC_URL = `${BASE_URL}public/`;

    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const [existingFiles, setExistingFiles] = useState([]);
    const [existingFilesRemoved, setExistingFilesRemoved] = useState([]);

    useEffect(() => {
        if (applicationFiles[0]?.files?.length > 0) {
            setExistingFiles(applicationFiles[0].files);
            console.log("Existing Files: ", applicationFiles[0].files);

            const existingPreviews = applicationFiles[0].files.map((file) => ({
                id: file.id,
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                file_path: file.file_path,
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

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        console.log(selectedFiles);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name
                .replaceAll("(", "")
                .replaceAll(")", "")
                .replaceAll(" ", "_")
                .replaceAll("-", "_"),
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
            originalFile: file,
            isExisting: false,
        }));

        setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

        console.log(newPreviews);
    };

    const handleAddFileClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        const fileToRemove = filePreviews[index];

        if (fileToRemove.isExisting) {
            // Remove from existing files array
            const fileId = fileToRemove.id;
            setExistingFiles((prev) =>
                prev.filter((file) => file.id !== fileId)
            );

            setExistingFilesRemoved([...existingFilesRemoved, { id: fileId }]);
        } else {
            // Remove from new files array
            const newFilesIndex = files.findIndex(
                (file) => file === fileToRemove.originalFile
            );
            if (newFilesIndex !== -1) {
                const newFiles = [...files];
                newFiles.splice(newFilesIndex, 1);
                setFiles(newFiles);
            }

            // Clean up object URL for new files
            if (fileToRemove.preview && !fileToRemove.isExisting) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
        }

        // Remove from previews
        const newPreviews = [...filePreviews];
        newPreviews.splice(index, 1);
        setFilePreviews(newPreviews);
    };

    const isImage = (type) => type && type.startsWith("image/");

    const handleCancel = (e) => {
        e.preventDefault();

        // Clean up object URLs for new files only
        filePreviews.forEach((preview) => {
            if (preview.preview && !preview.isExisting) {
                URL.revokeObjectURL(preview.preview);
            }
        });

        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        setFiles([]);
        setFilePreviews([]);
        setExistingFilesRemoved([]);
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

    const handleReUploadFiles = async () => {
        const success = await onReUploadFiles(
            type,
            selectedId,
            existingFiles,
            existingFilesRemoved,
            files,
            filePreviews,
            setIsSubmitting,
            convertFileToBase64,
            setIsOpen,
            resetForm
            // onSuccess
        );

        if (success) {
            setIsOpen(false);
            setIsSubmitting(false);
            onRefresh();
        }
    };

    console.log(filePreviews);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const activityData = {
                [type]: {
                    application_id: selectedId,
                    type: type,
                },
            };

            // Process new files for upload
            if (files.length > 0) {
                const uploadedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    try {
                        const base64Data = await convertFileToBase64(file);
                        uploadedFiles.push({
                            filename: file.name
                                .replaceAll("(", "")
                                .replaceAll(")", "")
                                .replaceAll(" ", "_")
                                .replaceAll("-", "_"),
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

            // Include files marked for removal
            if (existingFilesRemoved.length > 0) {
                activityData.removed_file_ids = existingFilesRemoved;
            }

            console.log("Submitting activity data:", activityData);

            // Submit the data
            const response = await fetch(
                `${BASE_URL}app/views/application-files.php`,
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

                // Clean up object URLs for new files
                filePreviews.forEach((preview) => {
                    if (preview.preview && !preview.isExisting) {
                        URL.revokeObjectURL(preview.preview);
                    }
                });

                resetForm();
                setIsOpen(false);
            } else {
                toast.error("Error: " + result.message);
                console.log("Error: " + result.message);
            }
        } catch (error) {
            console.log("Submission error:", error.message);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log(filePreviews);

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            onClose={setIsOpen}
            resetFields={resetForm}
            expandable={true}
            onCancel={handleCancel}
            onSubmit={handleReUploadFiles}
            buttonLabel={"Upload"}
            isLoading={isLoading}
        >
            <div className="px-8 py-4">
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
                            <span className="block text-xs">
                                Click to Select
                            </span>
                        </button>
                    </label>

                    {filePreviews.length > 0 && (
                        <ul className="mt-2 w-full text-sm text-gray-700 grid md:grid-cols-2 gap-2">
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
                                            <div className="w-full md:w-[150px] lg:w-[100px] font-medium text-gray-700 flex items-center text-[10px]">
                                                <p className="truncate">
                                                    {filePreview.name}
                                                </p>
                                                {isImage(
                                                    filePreview.file_type
                                                ) && (
                                                    <img
                                                        src={`${BASE_PUBLIC_URL}/${filePreview.file_path}`}
                                                        alt={
                                                            filePreview.file_name
                                                        }
                                                        className="w-12 h-12 object-cover rounded mr-2"
                                                    />
                                                )}
                                                {/* {filePreview.isExisting && (
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                        Saved
                                                    </span>
                                                )} */}
                                            </div>
                                            {/* <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div> */}
                                            {isImage(filePreview.type) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.open(
                                                            BASE_PUBLIC_URL +
                                                                filePreview.file_path,
                                                            "_blank"
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1"
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

                    {/* <div className="flex gap-2 mt-4">
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
                            disabled={isSubmitting || filePreviews.length < 1}
                            className={`${filePreviews.length < 1 ? "bg-green-300" : "bg-green-600 hover:bg-green-700"} flex-1 text-sm text-white px-4 py-2 rounded-lg transition-colors ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isSubmitting ? "Uploading..." : "Upload"}
                        </button>
                    </div> */}
                </div>
            </div>
        </InputModal>
    );
}

export default FileUploadFormModal;
