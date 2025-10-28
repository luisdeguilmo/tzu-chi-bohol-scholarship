import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useApplicationFiles = (type, applicationId) => {
    const [applicationFiles, setApplicationFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplicationFiles = async (type, applicationId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/application-files.php?type=${type}&id=${applicationId}`
            );
            // Set application periods data
            setApplicationFiles(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    const reUploadFiles = async (
        type,
        applicationId,
        existingFiles,
        existingFilesRemoved,
        files,
        filePreviews,
        setIsSubmitting,
        convertFileToBase64,
        setIsOpen,
        resetForm,
        onSuccess
    ) => {
        setIsSubmitting(true);

        console.log(existingFilesRemoved);

        try {
            setLoading(true);
            const activityData = {
                [type]: {
                    application_id: applicationId,
                    type: type,
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

                        const base64Data =
                            await convertFileToBase64(processedFile);
                        uploadedFiles.push({
                            filename: processedFile.name
                                .replaceAll("(", "")
                                .replaceAll(")", "")
                                .replaceAll(" ", "_")
                                .replaceAll("-", "_"),
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

                console.log("File Reviews: ", filePreviews);
                console.log("Activity Data: ", activityData);
            }

            console.log("Submitting activity data:", activityData);

            // Submit the data
            const response = await fetch(
                `${BASE_URL}app/views/application-files.php?type=${type}`,
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

                // if (onSuccess) onSuccess();
                setLoading(false);
                return false;
            } else {
                toast.error("Error: " + result.message);
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit the form. Please try again.");
            setIsSubmitting(false);
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        if (type && applicationId) {
            fetchApplicationFiles(type, applicationId);
        }
    }, [type, applicationId]);

    return { loading, applicationFiles, fetchApplicationFiles, reUploadFiles };
};
