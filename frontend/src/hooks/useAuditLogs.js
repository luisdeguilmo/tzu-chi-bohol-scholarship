import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useAuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}app/api/audit-logs.php`);
            setAuditLogs(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    return {
        loading,
        auditLogs,
        fetchAuditLogs,
    };
};
