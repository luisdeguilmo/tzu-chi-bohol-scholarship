import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";
import { formatTime } from "../../../utils/formatTime";
import pdfIcon from "../../../assets/pdf.png";

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
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const token = localStorage.getItem("token");

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

    const handleChange = (setValue, value) => {
        setValue(value);
    };

    const isPdf = (type) => type === "application/pdf";
    const isImage = (type) => type && type.startsWith("image/");

    const handleCancel = (e) => {
        e.preventDefault();

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
        if (user?.account_status === "not_renewed") {
            toast.error(
                `You can't submit community service until your renewal application is approved.`,
            );
            return;
        }

        setIsSubmitting(true);
        setIsLoading(true);

        try {
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

    return (
        <InputModal
            label={"Submit Duty Report"}
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
                    <label className="py-2.5 flex flex-col gap-[1px] text-gray-500 text-xs">
                        Upload files
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept=".jpeg,.jpg,.png,.gif,.pdf"
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
                            Add file
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
                                        {isImage(filePreview.type) ? (
                                            <img
                                                src={filePreview.preview}
                                                alt={filePreview.name}
                                                className="w-12 h-12 object-cover rounded mr-2"
                                            />
                                        ) : isPdf(filePreview.type) ? (
                                            <img
                                                src={pdfIcon}
                                                alt={filePreview.name}
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
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <div className="w-full md:w-[150px] lg:w-[130px] font-medium text-gray-700 flex items-center text-xs">
                                                <span
                                                    title={
                                                        filePreview.file_name
                                                    }
                                                    className="truncate"
                                                >
                                                    {filePreview.name}
                                                </span>
                                            </div>
                                            <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div>

                                            {isPdf(filePreview.type) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();

                                                        window.open(
                                                            filePreview.preview,
                                                            "_blank",
                                                        );
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1.5"
                                                >
                                                    Click to view PDF
                                                </button>
                                            )}

                                            {isImage(filePreview.type) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        window.open(
                                                            filePreview.preview,
                                                            "_blank",
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-1.5"
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
                </div>
            </div>
        </InputModal>
    );
}

export default ActivityFormModal;
