import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useScholarshipCriteria = (endpoint, entityName, filter) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [strands, setStrands] = useState([]);
    const token = localStorage.getItem("token");

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/${endpoint}.php?filter=${filter}`,
            );

            setItems(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(`Error fetching ${entityName} data:`, err);
            setError(`Failed to load ${entityName} data. Please try again.`);
            setLoading(false);
        }
    };

    const updateVisibility = async (id, course, is_visible) => {
        try {
            const data = {
                course: {
                    // Remove 's' from endpoint (strands -> strand)
                    id: id,
                    course: course,
                    is_visible: is_visible,
                },
            };

            const response = await fetch(
                `${BASE_URL}app/api/course-visibility.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json();

            if (result.success) {
                const updatedItems = items.map((item) =>
                    item.id === id
                        ? { course: course, is_visible: is_visible, ...item }
                        : item,
                );
                setItems(updatedItems);
                // toast.success(`${entityName} updated successfully.`);
                return true;
            } else {
                throw new Error(result.message || "Update failed");
            }
        } catch (error) {
            console.error(`Error updating ${entityName}:`, error);
            toast.error(`Failed to update ${entityName}`);
            return false;
        }
    };

    const updateItem = async (id, endpoint, updateData) => {
        try {
            const data = {
                [endpoint]: {
                    // Remove 's' from endpoint (strands -> strand)
                    id: id,
                    ...updateData,
                },
            };

            const response = await fetch(
                `${BASE_URL}app/api/${endpoint + "s"}.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json();

            if (result.success) {
                const updatedItems = items.map((item) =>
                    item.id === id ? { ...item, ...updateData } : item,
                );
                setItems(updatedItems);
                toast.success(`${entityName} updated successfully.`);
                return true;
            } else {
                throw new Error(result.message || "Update failed");
            }
        } catch (error) {
            console.error(`Error updating ${entityName}:`, error);
            toast.error(`Failed to update ${entityName}`);
            return false;
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${BASE_URL}app/api/${endpoint}.php?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedItems = items.filter((item) => item.id !== id);
            setItems(updatedItems);
            toast.success(`${entityName} deleted successfully.`);
            return true;
        } catch (error) {
            console.error(`Error deleting ${entityName}:`, error);
            toast.error(`Failed to delete ${entityName}`);
            return false;
        }
    };

    // useEffect(() => {
    //     fetchStrands();
    // }, []);

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    return {
        items,
        strands,
        loading,
        error,
        fetchItems,
        updateItem,
        deleteItem,
        updateVisibility,
        // fetchStrands,
    };
};
