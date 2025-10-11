import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useCoursesAccepted = (id) => {
    const [coursesAccepted, setCoursesAccepted] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const resetCoursesAccepted = () => {
        setCoursesAccepted([]); // or however you manage this state
    };

    const fetchCoursesAccepted = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/courses-accepted.php?id=${id}`
            );

            if (response.data) {
                setCoursesAccepted(response.data.data || []);
                setIsLoading(false);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("Error: ", error);
        }
    };

    const addCollegeOrUniversity = async (collegeUniversity) => {
        const data = {
            college_university: collegeUniversity,
        };

        try {
            const response = await fetch(
                `${BASE_URL}app/views/colleges-universities.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                return true;
            } else {
                alert("Error: " + result.message);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            return false;
        }
    };

    const deleteCollegeOrUniversity = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.delete(
                `${BASE_URL}app/views/colleges-universities.php?id=${id}`
            );

            if (response.data) {
                toast.success("College/University deleted successfully");
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
        if (id) {
            fetchCoursesAccepted();
        }
    }, [id]);

    return {
        isLoading,
        coursesAccepted,
        resetCoursesAccepted,
        fetchCoursesAccepted,
    };
};
