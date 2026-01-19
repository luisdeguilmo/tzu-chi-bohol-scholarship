import { toast } from "react-toastify";
import BASE_URL from "../config";
import { useState } from "react";

export const useCommunityServicesSubmit = () => {
    const [isLoading, setIsLoading] = useState(false);

    const resubmit = async (
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
    ) => {
        setIsSubmitting(true);

        try {
            // Validate time inputs
            if (startTime >= endTime) {
                toast.error("Start time must be before end time");
                setIsSubmitting(false);
                return;
            }

            const activityData = {
                activity: {
                    application_id: user?.user_id,
                    activity_id: activity.id,
                    activity_name: activityName,
                    activity_location: activityLocation,
                    activity_date: activityDate,
                    start_time: startTime,
                    end_time: endTime,
                    activity_status: "Pending",
                    batch_id: activity.batch_id,
                },
            };

            // Include existing files that weren't removed
            if (existingFiles.length > 0) {
                activityData.existing_files = existingFiles.map((file) => ({
                    id: file.id,
                    file_name: file.file_name,
                    file_path: file.file_path,
                    file_type: file.file_type,
                    file_size: file.file_size,
                }));
            } else {
                activityData.existing_files = [];
            }

            if (existingFilesRemoved.length > 0) {
                activityData.existing_files_removed = existingFilesRemoved;
            } else {
                activityData.existing_files_removed = [];
            }

            // Process new files only
            if (files.length > 0) {
                const uploadedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let processedFile = file;

                    // Find the corresponding preview index for conversion status
                    const previewIndex = filePreviews.findIndex(
                        (preview) => preview.originalFile === file
                    );

                    try {
                        // Check if file is DOC or DOCX and convert to PDF
                        if (
                            file.type === "application/msword" ||
                            file.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                            toast.info(`Converting ${file.name} to PDF...`);
                            processedFile = await convertDocToPdf(
                                file,
                                previewIndex
                            );

                            // Update the file preview
                            if (previewIndex !== -1) {
                                setFilePreviews((prev) => {
                                    const newPreviews = [...prev];
                                    newPreviews[previewIndex] = {
                                        ...newPreviews[previewIndex],
                                        name: processedFile.name,
                                        type: processedFile.type,
                                        size: processedFile.size,
                                    };
                                    return newPreviews;
                                });
                            }
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
            const response = await fetch(
                `${BASE_URL}app/views/activities.php`,
                {
                    method: "PUT",
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

                // Clean up object URLs only for new files
                filePreviews.forEach((preview) => {
                    if (preview.preview && !preview.isExisting) {
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

    const editSubmit = async (
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
    ) => {
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
                    application_id: user?.user_id,
                    activity_id: activity.id,
                    activity_name: activityName,
                    activity_location: activityLocation,
                    activity_date: activityDate,
                    start_time: startTime,
                    end_time: endTime,
                    activity_status: "Pending",
                    batch_id: activity.batch_id,
                },
            };

            // Include existing files that weren't removed
            if (existingFiles.length > 0) {
                activityData.existing_files = existingFiles.map((file) => ({
                    id: file.id,
                    file_name: file.file_name,
                    file_path: file.file_path,
                    file_type: file.file_type,
                    file_size: file.file_size,
                }));
            } else {
                activityData.existing_files = [];
            }

            if (existingFilesRemoved.length > 0) {
                activityData.existing_files_removed = existingFilesRemoved;
            } else {
                activityData.existing_files_removed = [];
            }

            // Process new files only
            if (files.length > 0) {
                const uploadedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let processedFile = file;

                    // Find the corresponding preview index for conversion status
                    const previewIndex = filePreviews.findIndex(
                        (preview) => preview.originalFile === file
                    );

                    try {
                        // Check if file is DOC or DOCX and convert to PDF
                        if (
                            file.type === "application/msword" ||
                            file.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                            toast.info(`Converting ${file.name} to PDF...`);
                            processedFile = await convertDocToPdf(
                                file,
                                previewIndex
                            );

                            // Update the file preview
                            if (previewIndex !== -1) {
                                setFilePreviews((prev) => {
                                    const newPreviews = [...prev];
                                    newPreviews[previewIndex] = {
                                        ...newPreviews[previewIndex],
                                        name: processedFile.name,
                                        type: processedFile.type,
                                        size: processedFile.size,
                                    };
                                    return newPreviews;
                                });
                            }
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
            const response = await fetch(
                `${BASE_URL}app/views/activities.php`,
                {
                    method: "PUT",
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

                // Clean up object URLs only for new files
                filePreviews.forEach((preview) => {
                    if (preview.preview && !preview.isExisting) {
                        URL.revokeObjectURL(preview.preview);
                    }
                });

                resetForm();
                setIsOpen(false);

                setIsLoading(false);

                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit the form. Please try again.");
            setIsLoading(false);
            setIsSubmitting(false);
            return false;
        }
    };

    return { isLoading, editSubmit };
};
