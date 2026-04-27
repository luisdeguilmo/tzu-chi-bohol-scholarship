import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";
import { useAccountStatus } from "../../../hooks/useAccountStatus";
import { formatTime } from "../../../utils/formatTime";

function ActivityFormModal({ isOpen, setIsOpen, onSuccess }) {
    const [activityName, setActivityName] = useState("");
    const [activityLocation, setActivityLocation] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [conversionStatus, setConversionStatus] = useState({});
    const { user } = useAuth();
    const { accountStatus } = useAccountStatus(user.user_id);
    const fileInputRef = useRef(null);
    const token = localStorage.getItem("token");

    // Move this to environment variables or server-side
    const CLOUDCONVERT_API_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTIyMmViOTZjYTQzZTMyZWM0YTliYTdiOTNkODFhNTBmZDZkYTFmNjUzNzdiMTRkODhjMzVkM2JhM2U1NzEyNDM3MmM4MDYwYjhkZThhMjkiLCJpYXQiOjE3NTAzMjA3NzQuOTAzMzE1LCJuYmYiOjE3NTAzMjA3NzQuOTAzMzE2LCJleHAiOjQ5MDU5OTQzNzQuODk3ODAzLCJzdWIiOiI3MjI0MzYxOCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwid2ViaG9vay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.";

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
            isConverting: false,
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
        setActivityName("");
        setActivityLocation("");
        setActivityDate("");
        setStartTime("");
        setEndTime("");
        setFiles([]);
        setFilePreviews([]);
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
                },
            );

            if (!jobResponse.ok) {
                throw new Error(`HTTP error! status: ${jobResponse.status}`);
            }

            const job = await jobResponse.json();
            const uploadTask = job.data.tasks.find(
                (task) => task.name === "upload-file",
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
                    `Upload failed! status: ${uploadResponse.status}`,
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
                    },
                );

                if (!statusResponse.ok) {
                    throw new Error(
                        `Status check failed! status: ${statusResponse.status}`,
                    );
                }

                jobStatus = await statusResponse.json();
            } while (
                jobStatus.data.status === "waiting" ||
                jobStatus.data.status === "processing"
            );

            if (jobStatus.data.status === "finished") {
                const exportTask = jobStatus.data.tasks.find(
                    (task) => task.name === "export-file",
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
                        `Download failed! status: ${pdfResponse.status}`,
                    );
                }

                const pdfBlob = await pdfResponse.blob();
                const pdfFile = new File(
                    [pdfBlob],
                    file.name.replace(/\.(doc|docx)$/i, ".pdf"),
                    { type: "application/pdf" },
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

    const handleSubmit = async () => {
        if (accountStatus === "not_renewed") {
            toast.error(
                `You can’t submit community service until your renewal application is approved.`,
            );
            return;
        }

        setIsSubmitting(true);
        setIsLoading(true);

        try {
            // Validate time inputs
            if (startTime >= endTime) {
                toast.error("Start time must be before end time");
                setIsSubmitting(false);
                return;
            }

            const activityData = {
                activity: {
                    activity_name: activityName,
                    activity_location: activityLocation,
                    activity_date: activityDate,
                    start_time: startTime,
                    end_time: endTime,
                    activity_status: "Pending",
                },
            };

            // Process files
            if (files.length > 0) {
                const uploadedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let processedFile = file;

                    try {
                        // Check if file is DOC or DOCX and convert to PDF
                        if (
                            file.type === "application/msword" ||
                            file.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                            toast.info(`Converting ${file.name} to PDF...`);
                            processedFile = await convertDocToPdf(file, i);

                            // Update the file preview
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

                activityData.uploaded_files = uploadedFiles;
            }

            // Submit the data
            const response = await fetch(`${BASE_URL}app/api/activities.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(activityData),
            });

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
                toast.error("Error: " + result.message);
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

    const isDocOrDocx = (fileType) => {
        return (
            fileType === "application/msword" ||
            fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
    };

    return (
        <InputModal
            label={"Submit Community Service"}
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
                <div className="grid md:grid-cols-2 gap-2">
                    <label className="py-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Activity Name
                        <input
                            type="text"
                            required
                            value={activityName}
                            onChange={(e) =>
                                handleChange(setActivityName, e.target.value)
                            }
                            placeholder="Enter activity name"
                            className="w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <label className="py-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Activity Location
                        <input
                            type="text"
                            required
                            value={activityLocation}
                            onChange={(e) =>
                                handleChange(
                                    setActivityLocation,
                                    e.target.value,
                                )
                            }
                            placeholder="Enter activity location"
                            className="w-full border text-xs text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <label className="relative py-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Date
                        {/* Fake placeholder */}
                        {/* {!activityDate && (
                            <span className="pointer-events-none absolute left-2.5 top-[34px] text-gray-400 text-xs">
                                Date
                            </span>
                        )} */}
                        <input
                            type="date"
                            required
                            value={activityDate}
                            placeholder="Date"
                            onClick={(e) => e.target.showPicker()}
                            onChange={(e) =>
                                handleChange(setActivityDate, e.target.value)
                            }
                            className="w-full border text-xs bg-white text-gray-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <div className="flex justify-between items-end gap-2">
                        <label className="relative flex-1 pb-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                            Start Time
                            {startTime && (
                                <span className="pointer-events-none absolute left-2.5 top-[28px] text-gray-800 text-xs">
                                    {formatTime(startTime)}
                                </span>
                            )}
                            <input
                                type="time"
                                required
                                value={startTime}
                                placeholder="Start time"
                                onClick={(e) => e.target.showPicker()}
                                onChange={(e) =>
                                    handleChange(setStartTime, e.target.value)
                                }
                                className="w-full border text-xs text-gray-800 bg-white border-gray-300 rounded-md py-[9px] px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <label className="relative flex-1 pb-1 flex flex-col gap-[1px] text-gray-500 text-xs">
                            End Time
                            {endTime && (
                                <span className="pointer-events-none absolute left-2.5 top-[28px] text-gray-800 text-xs">
                                    {formatTime(endTime)}
                                </span>
                            )}
                            <input
                                type="time"
                                required
                                value={endTime}
                                placeholder="End time"
                                onClick={(e) => e.target.showPicker()}
                                onChange={(e) =>
                                    handleChange(setEndTime, e.target.value)
                                }
                                className="w-full border text-xs text-gray-800 bg-white border-gray-300 rounded-md py-[9px] px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="">
                    <label className="py-1 flex flex-col gap-[1px] text-gray-500 text-xs">
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
                                                "image/",
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
                                                {isDocOrDocx(
                                                    filePreview.type,
                                                ) && (
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                        Will convert to PDF
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
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

                    {/* <div className="flex gap-2 mt-4">
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
                            }`}
                        >
                            {isSubmitting ? "Processing..." : "Submit"}
                        </button>
                    </div> */}
                </div>
            </div>
        </InputModal>
    );
}

export default ActivityFormModal;
