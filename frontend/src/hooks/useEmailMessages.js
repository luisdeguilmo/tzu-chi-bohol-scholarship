import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useEmailMessages = (stage) => {
    const [emailMessages, setEmailMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchEmailMessages = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/email-messages.php?stage=${stage}`
            );

            if (response.data) {
                setEmailMessages(response.data.data || []);
                setIsLoading(false);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("Error: ", error);
        }
    };

    const updateMessage = async (stage, passedMessage, failedMessage) => {
        const data = {
            stage: stage,
            passedMessage: passedMessage,
            failedMessage: failedMessage,
        };

        try {
            setIsLoading(true);

            const response = await fetch(
                `${BASE_URL}app/views/email-messages.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                setIsLoading(false);
                return true;
            } else {
                alert("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setIsLoading(false);
            return false;
        }
    };

    const deleteCourse = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.delete(
                `${BASE_URL}app/views/courses-accepted.php?id=${id}`
            );

            if (response.data) {
                toast.success("Course deleted successfully");
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            console.log("Error: ", error);
            setIsLoading(false);
            return false;
        }
    };

    useEffect(() => {
        if (stage) {
            fetchEmailMessages();
        }
    }, [stage]);

    return {
        isLoading,
        emailMessages,
        updateMessage,
        deleteCourse,
        fetchEmailMessages,
    };
};
