import { useEffect, useRef, useState } from "react";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";
import { useAuth } from "../../../context/AuthContext";
import { useCommunityServicesSubmit } from "../../../hooks/useCommunityServicesSubmit";
import { toast } from "react-toastify";
import pdfIcon from "../../../assets/pdf.png";
import { UploadCloud } from "lucide-react";
import { formatTime } from "../../../utils/formatTime";

const EditFormModal = ({ isOpen, setIsOpen, activity, onSuccess }) => {
    const [activityName, setActivityName] = useState(activity.activity_name);
    const [activityLocation, setActivityLocation] = useState(
        activity.activity_location,
    );
    const [activityDate, setActivityDate] = useState(activity.activity_date);
    const [startTime, setStartTime] = useState(activity.start_time);
    const [endTime, setEndTime] = useState(activity.end_time);
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [existingFilesRemoved, setExistingFilesRemoved] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        if (activity?.files?.length > 0) {
            setExistingFiles(activity.files);

            const existingPreviews = activity.files.map((file) => ({
                id: file.id,
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                file_url: file?.file_url,
                preview: file.file_type.startsWith("image/")
                    ? `${BASE_URL}public/${file.file_path}`
                    : null,
                isExisting: true,
                originalFile: null,
            }));

            setFilePreviews(existingPreviews);
        }
    }, [activity]);

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
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
                prev.filter((file) => file.id !== fileId),
            );
            setExistingFilesRemoved([...existingFilesRemoved, { id: fileId }]);
        } else {
            const newFilesIndex = files.findIndex(
                (file) => file === fileToRemove.originalFile,
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
        setActivityName("");
        setActivityLocation("");
        setActivityDate("");
        setStartTime("");
        setEndTime("");
        setFiles([]);
        setFilePreviews([]);
        setExistingFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isPdf = (type) => type === "application/pdf";
    const isImage = (type) => type && type.startsWith("image/");

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

    const { isLoading, editSubmit } = useCommunityServicesSubmit();

    const handleSubmit = async () => {
        if (user?.account_status === "not_renewed") {
            toast.error(
                `You can't resubmit community service until your renewal application is approved.`,
            );
            return;
        }

        const success = await editSubmit(
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
            convertFileToBase64,
            setIsOpen,
            resetForm,
            onSuccess,
        );

        if (success) {
            onSuccess();
        }
    };

    return (
        <InputModal
            label={
                activity.activity_status === "Not Recorded"
                    ? "Resubmit Duty Report"
                    : "Edit Duty Report"
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
                        <label className="py-1 flex flex-col gap-[1px] text-gray-800 text-xs">
                            Activity Name
                            <input
                                type="text"
                                required
                                value={activityName}
                                onChange={(e) =>
                                    handleChange(
                                        setActivityName,
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter activity name"
                                className="mt-2 w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <label className="py-1 flex flex-col gap-[1px] text-gray-800 text-xs">
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
                                className="mt-2 w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <label className="py-1 flex flex-col gap-[1px] text-gray-800 text-xs">
                            Date
                            <input
                                type="date"
                                required
                                value={activityDate}
                                onChange={(e) =>
                                    handleChange(
                                        setActivityDate,
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <div className="flex gap-2">
                            <label className="relative w-[50%] py-1 flex flex-col gap-[1px] text-gray-800 text-xs">
                                Start Time
                                {startTime && (
                                    <span className="pointer-events-none absolute left-2.5 top-[39px] text-gray-800 text-xs">
                                        {formatTime(startTime)}
                                    </span>
                                )}
                                <input
                                    type="time"
                                    required
                                    value={startTime}
                                    onChange={(e) =>
                                        handleChange(
                                            setStartTime,
                                            e.target.value,
                                        )
                                    }
                                    className="mt-2 w-full border text-xs border-gray-300 rounded-md py-[9px] px-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>

                            <label className="relative w-[50%] py-1 flex flex-col gap-[1px] text-gray-800 text-xs">
                                End Time
                                {endTime && (
                                    <span className="pointer-events-none absolute left-2.5 top-[39px] text-gray-800 text-xs">
                                        {formatTime(endTime)}
                                    </span>
                                )}
                                <input
                                    type="time"
                                    required
                                    value={endTime}
                                    onChange={(e) =>
                                        handleChange(setEndTime, e.target.value)
                                    }
                                    className="mt-2 w-full border text-xs border-gray-300 rounded-md py-[9px] px-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                        </div>
                    </div>

                    <label className="px-8 pt-2 pb-3 flex flex-col gap-[1px] text-gray-800 text-xs">
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
                            className="mt-2 px-2 py-2.5 flex justify-center gap-[1px] text-gray-600 text-xs rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
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

                    <p className="px-8 pt-2 pb-1 flex flex-col gap-[1px] text-gray-800 text-xs">
                        Attached Files:{" "}
                    </p>

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
                                        {isImage(filePreview.type) ? (
                                            <img
                                                src={
                                                    filePreview?.file_url
                                                        ? filePreview?.file_url
                                                        : filePreview.preview
                                                }
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
                                                    title={filePreview.name}
                                                    className="truncate"
                                                >
                                                    {filePreview.name}
                                                </span>
                                            </div>
                                            {/* <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div> */}

                                            {isPdf(filePreview.type) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();

                                                        window.open(
                                                            filePreview?.file_url
                                                                ? filePreview.file_url
                                                                : filePreview.preview,
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
                                                            filePreview?.file_url
                                                                ? filePreview.file_url
                                                                : filePreview.preview,
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

                    {activity.activity_status === "Not Recorded" && (
                        <div className="px-8 pt-6 pb-8">
                            <p className="text-xs mb-1 text-gray-800">
                                Feedback:{" "}
                            </p>
                            <p className="text-xs mt-2 rounded-md text-gray-600">
                                {activity.feedback}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </InputModal>
    );
};

export default EditFormModal;
