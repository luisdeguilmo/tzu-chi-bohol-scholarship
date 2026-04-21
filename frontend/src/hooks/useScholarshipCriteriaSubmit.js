import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // Using axios for better error handling
import BASE_URL from "../config";

function useScholarshipCriteriaSubmit(onSuccess) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Base URL configuration - makes it easier to update in one place
    const API_BASE_URL = `${BASE_URL}app/api`;

    // Generic error handler to provide consistent error handling
    const handleError = (error, errorMessage) => {
        console.error(errorMessage, error);
        setError(error.message || "An unexpected error occurred");
        toast.error(
            error.message || "Failed to submit the form. Please try again."
        );
        setIsLoading(false);
        return false;
    };

    const createStrand = async (text, description, onSuccess) => {
        const data = {
            strand: {
                strand: text,
                description: description,
            },
        };

        try {
            const formData = new FormData();
            formData.append("strand", JSON.stringify(data));

            // Using axios instead of fetch for better error handling
            const response = await axios.post(
                `${API_BASE_URL}/strands.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    // Setting timeout to prevent hanging requests
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            return handleError(error, "Strand submission error:");
        }
    };

    const createCourse = async (text, onSuccess) => {
        const data = { course_name: text };

        try {
            const formData = new FormData();
            formData.append("course_name", JSON.stringify(data));

            const response = await axios.post(
                `${API_BASE_URL}/courses.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            return handleError(error, "Course submission error:");
        }
    };

    const createProcedure = async (text, onSuccess) => {
        const data = { procedure: text };

        try {
            const formData = new FormData();
            formData.append("procedure", JSON.stringify(data));

            const response = await axios.post(
                `${API_BASE_URL}/procedures.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            return handleError(error, "Procedure submission error:");
        }
    };

    const createQualification = async (text, onSuccess) => {
        const data = { qualification: text };

        try {
            const formData = new FormData();
            formData.append("qualification", JSON.stringify(data));

            const response = await axios.post(
                `${API_BASE_URL}/qualifications.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            return handleError(error, "Qualification submission error:");
        }
    };

    const createRequirement = async (
        quantity,
        description,
        submit,
        onSuccess
    ) => {
        const data = {
            requirement: {
                quantity: quantity,
                description: description,
                submit: submit,
            },
        };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/requirements.php`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            return handleError(error, "Requirement submission error:");
        }
    };

    const createInstruction = async (text, onSuccess) => {
        const data = { instruction: text };

        try {
            const formData = new FormData();
            formData.append("instruction", JSON.stringify(data));

            const response = await axios.post(
                `${API_BASE_URL}/instructions.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 10000,
                }
            );

            const result = response.data;

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                if (onSuccess) onSuccess();
                return true;
            } else {
                toast.error("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            return handleError(error, "Instruction submission error:");
        }
    };

    return {
        createStrand,
        createCourse,
        createQualification,
        createRequirement,
        createProcedure,
        createInstruction,
        isLoading,
        error,
    };
}

export default useScholarshipCriteriaSubmit;
