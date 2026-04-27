import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

export const useCollegesUniversities = () => {
    const [collegesAndUniversities, setCollegesAndUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCollegesAndUniversities = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/colleges-universities.php`,
            );

            if (response.data) {
                setCollegesAndUniversities(response.data.data || []);
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
                `${BASE_URL}app/api/colleges-universities.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
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

    const updateCollegeOrUniversity = async (selectedId, collegeUniversity) => {
        const data = {
            id: selectedId,
            name: collegeUniversity,
        };

        try {
            setIsLoading(true);

            const response = await fetch(
                `${BASE_URL}app/api/colleges-universities.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
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

    const deleteCollegeOrUniversity = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.delete(
                `${BASE_URL}app/api/colleges-universities.php?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                toast.success("College/University deleted successfully");
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            setIsLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchCollegesAndUniversities();
    }, []);

    return {
        isLoading,
        collegesAndUniversities,
        addCollegeOrUniversity,
        updateCollegeOrUniversity,
        deleteCollegeOrUniversity,
        fetchCollegesAndUniversities,
    };
};
