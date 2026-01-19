import { useEffect, useRef, useState } from "react";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";
import { useAuth } from "../../../context/AuthContext";
import { useCommunityServicesSubmit } from "../../../hooks/useCommunityServicesSubmit";
import { toast } from "react-toastify";
import { useAccountStatus } from "../../../hooks/useAccountStatus";

const EditFormModal = ({ isOpen, setIsOpen, activity, onSuccess }) => {
    const [activityName, setActivityName] = useState(activity.activity_name);
    const [activityLocation, setActivityLocation] = useState(
        activity.activity_location
    );
    const [activityDate, setActivityDate] = useState(activity.activity_date);
    const [startTime, setStartTime] = useState(activity.start_time);
    const [endTime, setEndTime] = useState(activity.end_time);
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]); // Track existing server files
    const [existingFilesRemoved, setExistingFilesRemoved] = useState([]); // Track existing server files
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [conversionStatus, setConversionStatus] = useState({});
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const { accountStatus } = useAccountStatus(user.user_id);

    useEffect(() => {
        if (activity?.files?.length > 0) {
            // Store existing files separately without creating dummy File objects
            setExistingFiles(activity.files);
            // setExistingFilesRemoved(activity.files);

            // Create previews for existing files
            const existingPreviews = activity.files.map((file) => ({
                id: file.id, // Add ID to identify existing files
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                preview: file.file_type.startsWith("image/")
                    ? `${BASE_URL}public/${file.file_path}`
                    : null, // Only create preview URL for images
                isConverting: false,
                isExisting: true, // Flag to identify existing files
                originalFile: null, // No file object for existing files
            }));

            setFilePreviews(existingPreviews);
        }
    }, [activity]);

    const CLOUDCONVERT_API_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTIyMmViOTZjYTQzZTMyZWM0YTliYTdiOTNkODFhNTBmZDZkYTFmNjUzNzdiMTRkODhjMzVkM2JhM2U1NzEyNDM3MmM4MDYwYjhkZThhMjkiLCJpYXQiOjE3NTAzMjA3NzQuOTAzMzE1LCJuYmYiOjE3NTAzMjA3NzQuOTAzMzE2LCJleHAiOjQ5MDU5OTQzNzQuODk3ODAzLCJzdWIiOiI3MjI0MzYxOCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwid2ViaG9vay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.nwD5LxxkLos3LEJkPHefZTJyYPm3qHaCFFu5whQx7SNTZBNC8mbYShHivCQvDww9a524ZSlh7acKDVYrPWBNHubErUzoZx2QZNGs8UPc3K3WDLy382eXkXWgeUMtyaWfF9U7YvlSg46D9RWIeWHpqGJrimtLVDgVUoiKANimtUEBzNweOORNoQBezyO08RcrhsDThuYBv24XvB7s7bHr48kF0ZjoxATeBjn3dqvj-c8GtNwB-PeZzmvEO6gvIjWXZ1qwrzVehncPW-0FzZXo4CQCzGaH8vaiAFvXzbLPy88brqCr8r22Q1d6yxXPhAr9mftnZjVclfa0Qqt25Kz5opdFjMOCDBz1z5M2cRsKzB6_ZENdyiFAgQeLOnf8biB8yxGWnec6HTrVv486FEbr-Yqz7Gs-eFGRSdYNCK67h1SPiFYsypaj_ehUO18eNJMV_hvy0t9yrwfB8vS6tSaYvNTXd-IP8GD_R0TwTYxVF41QUGilKLtRQ8NLL8NtSiZA5-JAcKmEiYIdd6f0V5ZFZamFt8w2SeoQ9gYQS9Onz5NRLVw63V191Zszo3kUZ-tAoJ9_CwvBkDRJP0lzNFciOMpsxJGN5jRNC0OaxLAHabK61WaBL4YlucWU-e-MlxfPmpCXqd8K7omu7fgKJ3xbmxmF6YbJfMz_WPxKvIm5C-M";

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
            isConverting: false,
            isExisting: false, // New files are not existing
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

        // Clean up conversion status
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

        // Clean up object URLs only for new files
        filePreviews.forEach((preview) => {
            if (preview.preview && !preview.isExisting) {
                URL.revokeObjectURL(preview.preview);
            }
        });

        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        setActivityName("");
        setActivityLocation("");
        setActivityDate("");
        setStartTime("");
        setEndTime("");
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
        if (!CLOUDCONVERT_API_KEY) {
            throw new Error("CloudConvert API key not configured");
        }

        try {
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: {
                    status: "uploading",
                    message: "Uploading file...",
                },
            }));

            // Create a job
            const jobResponse = await fetch(
                "https://api.cloudconvert.com/v2/jobs",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tasks: {
                            "upload-file": {
                                operation: "import/upload",
                            },
                            "convert-file": {
                                operation: "convert",
                                input: "upload-file",
                                output_format: "pdf",
                            },
                            "export-file": {
                                operation: "export/url",
                                input: "convert-file",
                            },
                        },
                    }),
                }
            );

            if (!jobResponse.ok) {
                throw new Error(`HTTP error! status: ${jobResponse.status}`);
            }

            const job = await jobResponse.json();
            const uploadTask = job.data.tasks.find(
                (task) => task.name === "upload-file"
            );

            // Upload the file
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: {
                    status: "uploading",
                    message: "Uploading to CloudConvert...",
                },
            }));

            const formData = new FormData();
            Object.keys(uploadTask.result.form.parameters).forEach((key) => {
                formData.append(key, uploadTask.result.form.parameters[key]);
            });
            formData.append("file", file);

            const uploadResponse = await fetch(uploadTask.result.form.url, {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(
                    `Upload failed! status: ${uploadResponse.status}`
                );
            }

            // Wait for conversion to complete
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: {
                    status: "converting",
                    message: "Converting to PDF...",
                },
            }));

            let jobStatus;
            do {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const statusResponse = await fetch(
                    `https://api.cloudconvert.com/v2/jobs/${job.data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
                        },
                    }
                );

                if (!statusResponse.ok) {
                    throw new Error(
                        `Status check failed! status: ${statusResponse.status}`
                    );
                }

                jobStatus = await statusResponse.json();
            } while (
                jobStatus.data.status === "waiting" ||
                jobStatus.data.status === "processing"
            );

            if (jobStatus.data.status === "finished") {
                const exportTask = jobStatus.data.tasks.find(
                    (task) => task.name === "export-file"
                );
                const downloadUrl = exportTask.result.files[0].url;

                setConversionStatus((prev) => ({
                    ...prev,
                    [fileIndex]: {
                        status: "downloading",
                        message: "Downloading converted PDF...",
                    },
                }));

                const pdfResponse = await fetch(downloadUrl);
                if (!pdfResponse.ok) {
                    throw new Error(
                        `Download failed! status: ${pdfResponse.status}`
                    );
                }

                const pdfBlob = await pdfResponse.blob();
                const pdfFile = new File(
                    [pdfBlob],
                    file.name.replace(/\.(doc|docx)$/i, ".pdf"),
                    { type: "application/pdf" }
                );

                setConversionStatus((prev) => ({
                    ...prev,
                    [fileIndex]: {
                        status: "completed",
                        message: "Conversion completed!",
                    },
                }));

                return pdfFile;
            } else {
                throw new Error(`Conversion failed: ${jobStatus.data.status}`);
            }
        } catch (error) {
            console.error("CloudConvert error:", error);
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: { status: "error", message: "Conversion failed" },
            }));
            throw error;
        }
    };

    const { isLoading, editSubmit } = useCommunityServicesSubmit();

    const handleResubmit = () => {};

    const handleSubmit = async () => {
        if (accountStatus === "not_renewed") {
            toast.error(
                `You can’t resubmit community service until your renewal application is approved.`
            );
            return;
        }

        const success = await editSubmit(
            user,
            activity,
            activityName,
            activityLocation,
            activityDate,
            startTime,
            endTime,
            existingFiles,
            existingFilesRemoved,
            files,
            filePreviews,
            setFilePreviews,
            setIsSubmitting,
            convertDocToPdf,
            convertFileToBase64,
            setIsOpen,
            resetForm,
            onSuccess
        );

        if (success) {
            onSuccess();
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
                activity.activity_status === "Not Recorded"
                    ? "Resubmit Activity"
                    : "Edit Activity"
            }
            isOpen={isOpen}
            onClose={setIsOpen}
            resetFields={null}
            expandable={true}
            buttonLabel={"Resubmit"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        >
            <div>
                <div className="py-4 overflow-y-auto scroll-smooth h-[400px]">
                    <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Activity Name
                            <input
                                type="text"
                                required
                                value={activityName}
                                onChange={(e) =>
                                    handleChange(
                                        setActivityName,
                                        e.target.value
                                    )
                                }
                                placeholder="Enter activity name"
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Activity Location
                            <input
                                type="text"
                                required
                                value={activityLocation}
                                onChange={(e) =>
                                    handleChange(
                                        setActivityLocation,
                                        e.target.value
                                    )
                                }
                                placeholder="Enter activity location"
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Date
                            <input
                                type="date"
                                required
                                value={activityDate}
                                onChange={(e) =>
                                    handleChange(
                                        setActivityDate,
                                        e.target.value
                                    )
                                }
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <div className="flex gap-2">
                            <label className="w-[50%] py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                Start Time
                                <input
                                    type="time"
                                    required
                                    value={startTime}
                                    onChange={(e) =>
                                        handleChange(
                                            setStartTime,
                                            e.target.value
                                        )
                                    }
                                    className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>

                            <label className="w-[50%] py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                End Time
                                <input
                                    type="time"
                                    required
                                    value={endTime}
                                    onChange={(e) =>
                                        handleChange(setEndTime, e.target.value)
                                    }
                                    className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                        </div>
                    </div>

                    <label className="px-8 pt-2 pb-3 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Certificate of Appearance
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
                            className="px-2 py-2.5 flex justify-center gap-[1px] text-gray-600 text-xs rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
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
                                                    // Handle image load errors
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
                                                {/* {filePreview.isExisting && (
                                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                        Existing
                                                    </span>
                                                )} */}
                                                {!filePreview.isExisting &&
                                                    isDocOrDocx(
                                                        filePreview.type
                                                    ) && (
                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                            Will convert to PDF
                                                        </span>
                                                    )}
                                            </div>
                                            {/* <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div> */}
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

                    {activity.activity_status === "Not Recorded" && (
                        <div className="px-8 pt-6 pb-8">
                            <p className="text-xs mb-1 text-gray-700">
                                Feedback:{" "}
                            </p>
                            <p className="text-xs border bg-gray-50 px-2 py-2.5 rounded-md text-gray-700">
                                {activity.feedback}
                            </p>
                        </div>
                    )}
                </div>

                {/* <div className="pb-6 px-6 border-t">
                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            } ${
                                activity.activity_status === "Not Recorded"
                                    ? "hidden"
                                    : "block"
                            }`}
                        >
                            {isSubmitting ? "Processing..." : "Save"}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            } ${
                                activity.activity_status === "Not Recorded"
                                    ? "block"
                                    : "hidden"
                            }`}
                        >
                            {isSubmitting ? "Processing..." : "Resubmit"}
                        </button>
                    </div>
                </div> */}
            </div>
        </InputModal>
    );
};

export default EditFormModal;
