import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useStaffAccounts = () => {
    const [staffAccounts, setStaffAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStaffAccounts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/staff-accounts.php`
            );
            setStaffAccounts(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching staff data:", err);
            setError("Failed to load staff data. Please try again.");
            setLoading(false);
        }
    };

    const addStaff = async (firstName, lastName, email, password) => {
        const data = {
            staff: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            },
        };

        try {
            const response = await fetch(
                `${BASE_URL}app/views/staff-accounts.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (result.success) {
                toast.success(result.message + ".");
                await fetchStaffAccounts();
                return true;
            } else {
                alert("Error: " + result.message);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to create staff account. Please try again.");
            return false;
        }
    };

    const editStaff = async (id) => {
        try {
            // Create the data structure
            const data = {
                staff: {
                    id: id,
                    name: newName,
                    email: newEmail,
                    // role: newRole,
                },
            };

            const response = await fetch(
                `${BASE_URL}app/views/staff-accounts.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            // Check for success and update the UI
            if (result.success) {
                // Update the local state to reflect the change
                const updatedStaffAccounts = staffAccounts.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              name: newName,
                              email: newEmail,
                              //   role: newRole,
                          }
                        : item
                );

                toast.success("Staff account updated successfully.");
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error updating staff account:", error);
            alert("Failed to update staff account");
        }
    };

    const deleteStaff = async (id, index) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `${BASE_URL}app/views/staff-accounts.php?id=${id}`
            );

            // Update local state after successful deletion
            const updatedStaffAccounts = staffAccounts.filter(
                (staff) => staff.id !== id
            );

            toast.success("Staff account deleted successfully.");

            if (index === 0) goToPreviousPage();
        } catch (error) {
            console.error("Error deleting staff account:", error);
            alert("Failed to delete staff account");
        }
    };

    useEffect(() => {
        fetchStaffAccounts();
    }, []);

    return {
        staffAccounts,
        addStaff,
        editStaff,
        deleteStaff,
        fetchStaffAccounts,
    };
};
