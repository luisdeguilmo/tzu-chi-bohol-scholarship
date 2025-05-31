import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // Using axios for better error handling

function useScholarshipCriteriaSubmit(onSuccess) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Base URL configuration - makes it easier to update in one place
    const API_BASE_URL = "http://localhost:8000/app/views";

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

    const handleStrandSubmit = async (
        e,
        text,
        setText,
        description,
        setDescription,
        setIsOpen
    ) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Create the data structure that matches your backend expectations
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
                setText("");
                setDescription("");
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
            return handleError(error, "Strand submission error:");
        }
    };

    const handleCourseSubmit = async (e, text, setText, setIsOpen) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setText("");
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
            return handleError(error, "Course submission error:");
        }
    };

    const handleProcedureSubmit = async (e, text, setText, setIsOpen) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setText("");
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
            return handleError(error, "Procedure submission error:");
        }
    };

    const handleQualificationSubmit = async (e, text, setText, setIsOpen) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setText("");
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
            return handleError(error, "Qualification submission error:");
        }
    };

    const handleRequirementSubmit = async (
        e,
        quantity,
        setQuantity,
        description,
        setDescription,
        submit,
        setSubmit,
        setIsOpen
    ) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setQuantity("");
                setDescription("");
                setSubmit("");
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
            return handleError(error, "Requirement submission error:");
        }
    };

    const handleInstructionSubmit = async (e, text, setText, setIsOpen) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setText("");
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
            return handleError(error, "Instruction submission error:");
        }
    };

    return {
        handleStrandSubmit,
        handleCourseSubmit,
        handleProcedureSubmit,
        handleQualificationSubmit,
        handleRequirementSubmit,
        handleInstructionSubmit,
        isLoading,
        error,
    };
}

export default useScholarshipCriteriaSubmit;
