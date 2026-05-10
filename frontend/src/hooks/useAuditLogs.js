import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useAuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/audit-logs.php`,
            );
            setAuditLogs(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    const createAudit = async (
        action,
        entityType,
        entityId,
        description,
        oldValues,
        newValues,
    ) => {
        const data = {
            action: action,
            entity_type: entityType,
            entity_id: entityId,
            description: description,
            old_values: oldValues,
            new_values: newValues,
        };

        try {
            setLoading(true);

            const response = await fetch(`${BASE_URL}app/api/audit-logs.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Important for JSON body
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                setLoading(false);
                return true;
            } else {
                alert("Error: " + result.message);
                setLoading(false);
                return false;
            }
            // if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    return {
        loading,
        auditLogs,
        fetchAuditLogs,
        createAudit,
    };
};
