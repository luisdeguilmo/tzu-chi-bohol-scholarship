import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import { useExamination } from "./useExamination";

export const useAssignBatch = (endpoint) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const assignStudents = async (selectedApplicants, selectedBatch) => {
        if (selectedApplicants.length === 0) {
            alert("Please select at least one applicant");
            return;
        }

        if (!selectedBatch) {
            alert("Please select a batch");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_URL}app/api/${endpoint}.php`,
                {
                    applicantIds: selectedApplicants,
                    batch: selectedBatch,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                // Show success notification
                toast.success(response.data.message + ".");
                // await fetchApplications(tab);
                return true;
            } else {
                alert("Error: " + response.data.message);
                return false;
            }

            setLoading(false);
        } catch (err) {
            console.error("Error assigning batch:", err);
            setError(
                "Failed to assign batch to applicants: " +
                    (err.response?.data?.message || err.message),
            );
            setLoading(false);
            return false;
        }
    };

    const unassignStudents = async (selectedApplicants, selectedBatch) => {
        if (selectedApplicants.length === 0) {
            alert("Please select at least one applicant");
            return;
        }

        if (!selectedBatch) {
            alert("Please select a batch");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_URL}app/api/${endpoint}.php`,
                {
                    applicantIds: selectedApplicants,
                    batch: "Unassigned",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                // Show success notification
                toast.success(response.data.message + ".");
                // fetchApplications(tab);
                return true;
            } else {
                alert("Error: " + response.data.message);
                return false;
            }

            setLoading(false);
        } catch (err) {
            console.error("Error assigning batch:", err);
            setError(
                "Failed to assign batch to applicants: " +
                    (err.response?.data?.message || err.message),
            );
            setLoading(false);
            return false;
        }
    };

    return { assignStudents, unassignStudents };
};
