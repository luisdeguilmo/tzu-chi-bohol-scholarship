import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useCollegesUniversities = (filter) => {
    const [collegesAndUniversities, setCollegesAndUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchCollegesAndUniversities = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/colleges-universities.php?filter=${filter}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
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

    const addCollegeOrUniversity = async (collegeUniversity, type) => {
        const data = {
            college_university: collegeUniversity,
            type: type,
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

    const updateVisibility = async (id, name, is_visible) => {
        try {
            const data = {
                id: id,
                name: name,
                is_visible: is_visible,
            };

            const response = await fetch(
                `${BASE_URL}app/api/colleges-universities.php`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json();

            if (result.success) {
                // toast.success(result.message + ".");
                setIsLoading(false);
                return true;
            } else {
                alert("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error(`Error updating ${entityName}:`, error);
            toast.error(`Failed to update ${entityName}`);
            return false;
        }
    };

    const updateCollegeOrUniversity = async (
        selectedId,
        collegeUniversity,
        type,
    ) => {
        const data = {
            id: selectedId,
            name: collegeUniversity,
            type: type,
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
        updateVisibility,
        deleteCollegeOrUniversity,
        fetchCollegesAndUniversities,
    };
};
