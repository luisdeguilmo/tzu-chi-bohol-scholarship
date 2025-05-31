import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useScholarshipCriteria = (endpoint, entityName) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/${endpoint}.php`
            );
            
            setItems(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(`Error fetching ${entityName} data:`, err);
            setError(`Failed to load ${entityName} data. Please try again.`);
            setLoading(false);
        }
    };

    const updateItem = async (id, updateData) => {
        try {
            const data = {
                [endpoint.slice(0, -1)]: { // Remove 's' from endpoint (strands -> strand)
                    id: id,
                    ...updateData,
                },
            };

            const response = await fetch(
                `http://localhost:8000/app/views/${endpoint}.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (result.success) {
                const updatedItems = items.map((item) =>
                    item.id === id ? { ...item, ...updateData } : item
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
            await axios.delete(
                `http://localhost:8000/app/views/${endpoint}.php?id=${id}`
            );

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

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    return {
        items,
        loading,
        error,
        fetchItems,
        updateItem,
        deleteItem,
    };
};