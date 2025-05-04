import React, { useEffect } from "react";
import Modal from "react-modal";
import { FaTrashAlt } from "react-icons/fa";

Modal.setAppElement("#root");

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
    useEffect(() => {
        if (isOpen) {
            // Any focus logic if needed
        }
    }, [isOpen]);

    // Custom styles for the modal to make it look like a toast
    const customStyles = {
        content: {
            top: "",
            left: "50%",
            transform: "translateX(-50%)",
            height: "max-content",
            width: "400px",
            padding: "0",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            zIndex: 1000,
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Confirmation"
            style={customStyles}
            ariaHideApp={false}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <FaTrashAlt size={20} color="#dc2626" />
                        <h2
                            style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#1f2937",
                                margin: 0,
                            }}
                        >
                            Confirm Delete
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            borderRadius: "50%",
                            padding: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Close"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: "16px" }}>
                    <p
                        style={{
                            color: "#4b5563",
                            marginBottom: "16px",
                            fontSize: "14px",
                        }}
                    >
                        Are you sure you want to delete this item?
                    </p>

                    {/* Action buttons */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                            marginTop: "8px",
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "1px solid #d1d5db",
                                backgroundColor: "transparent",
                                color: "#374151",
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                            aria-label="Cancel delete"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelete}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#dc2626",
                                color: "white",
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                            aria-label="Confirm delete"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;

// // Demo component to show the modal in action
// const DeleteModalDemo = () => {
//   const [modalIsOpen, setModalIsOpen] = React.useState(false);

//   const openModal = () => setModalIsOpen(true);
//   const closeModal = () => setModalIsOpen(false);
//   const handleDelete = () => {
//     // Handle delete action
//     console.log("Deleted!");
//     closeModal();
//   };

//   return (
//     <div className="p-4">
//       <button
//         onClick={openModal}
//         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//       >
//         Show Delete Modal
//       </button>

//       <DeleteModal
//         isOpen={modalIsOpen}
//         onClose={closeModal}
//         onDelete={handleDelete}
//       />
//     </div>
//   );
// };

// export default DeleteModalDemo;
