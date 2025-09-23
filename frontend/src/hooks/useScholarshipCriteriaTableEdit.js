import { useState } from "react";

export const useScholarshipCriteriaTableEdit = () => {
    const [edit, setEdit] = useState(false);
    const [newText, setNewText] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [newSubmit, setNewSubmit] = useState("");
    const [rowItemId, setRowItemId] = useState(0);

    const startEdit = (value, id) => {
        setEdit(true);
        setNewText(value);
        setRowItemId(id);
    };

    const cancelEdit = () => {
        setEdit(false);
        setNewText(value);
        setRowItemId(0);
    };

    const startStrandEdit = (value, description, id) => {
        setEdit(true);
        setNewText(value);
        setNewDescription(description);
        setRowItemId(id);
    };

    const cancelStrandEdit = () => {
        setEdit(false);
        setNewText("");
        setNewDescription("");
        setRowItemId(0);
    };

    const startRequirementEdit = (quantity, description, submit) => {
        setEdit(true);
        setNewQuantity(quantity);
        setNewDescription(description);
        setNewSubmit(submit);
        setRowItemId(id);
    };

    const cancelRequirementEdit = () => {
        setEdit(false);
        setNewQuantity("");
        setNewDescription("");
        setNewSubmit("");
        setRowItemId(0);
    };

    const isEditing = (id) => edit && rowItemId === id;

    return {
        edit,
        newText, 
        newDescription,
        newQuantity,
        newSubmit,
        rowItemId,
        setNewText,
        setNewDescription,
        setNewQuantity,
        setNewSubmit,
        startEdit, 
        cancelEdit,
        startStrandEdit,
        cancelStrandEdit,
        startRequirementEdit,
        cancelRequirementEdit,
        isEditing
    };
};
