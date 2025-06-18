// import { useState } from "react";

// export const useTableEdit = () => {
//     const [edit, setEdit] = useState(false);
//     const [editData, setEditData] = useState({});
//     const [rowItemId, setRowItemId] = useState(0);

//     const startEdit = (id, initialData) => {
//         setEdit(true);
//         setEditData(initialData);
//         setRowItemId(id);
//     };

//     const updateEditData = (field, value) => {
//         setEditData(prev => ({ ...prev, [field]: value }));
//     };

//     const cancelEdit = () => {
//         setEdit(false);
//         setEditData({});
//         setRowItemId(0);
//     };

//     const isEditing = (id) => edit && rowItemId === id;

//     return {
//         edit,
//         editData,
//         rowItemId,
//         updateEditData,
//         startEdit,
//         cancelEdit,
//         isEditing,
//     };
// };

import { useState } from "react";

export const useTableEdit = () => {
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [rowItemId, setRowItemId] = useState(0);

    const startEdit = (id, initialData) => {
        setEdit(true);
        setEditData(initialData);
        setRowItemId(id);
    };

    const updateEditData = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const cancelEdit = () => {
        setEdit(false); 
        setEditData({});
        setRowItemId(0);
    };

    const isEditing = (id) => edit && rowItemId === id;

    return {
        edit,
        editData,
        rowItemId,
        updateEditData,
        startEdit,
        cancelEdit,
        isEditing,
    };
};