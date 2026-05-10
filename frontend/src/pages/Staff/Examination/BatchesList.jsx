import { Check, Eye, Pencil, PencilLine, X } from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";

export const BatchesList = ({
    tab,
    item,
    index,
    tableHeaders,
    profilePics,
    selectedApplicants,
    toggleApplicantSelection,
    onRefresh,
}) => {
    const [edit, setEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [score, setScore] = useState(0);

    const handleButtonState = (id, value) => {
        setEdit(true);
        setEditingId(id);
        setScore(value || ""); // Set initial value
    };

    const handleChange = (value) => {
        setScore(value);
    };

    const handleAddScore = async (id) => {
        setEdit(false);
        setEditingId(null);

        // Check if the user cancelled or submitted an empty string
        if (!score || score < 0) {
            return; // Exit if cancelled or empty
        }

        try {
            // Create the data structure for the update
            const data = {
                id: id,
                score: score, // Changed from procedure to score
            };

            // Send the PUT request with the data in the body
            const response = await axios.put(
                `${BASE_URL}/app/api/scores.php`, // Updated endpoint
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Check for success and update the UI
            if (response.data.success) {
                onRefresh(tab);

                // Show success message
                toast.success("Score updated successfully.");
            } else {
                toast.error("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating score:", error);
            toast.error("Failed to update score");
        }
    };

    return (
        <div className="relative p-4 border rounded-md bg-gray-50">
            <div className="absolute top-4 right-4 text-left whitespace-nowrap text-gray-500">
                <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-green-600 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={selectedApplicants.includes(item.application_id)}
                    onChange={() =>
                        toggleApplicantSelection(item.application_id)
                    }
                />
            </div>
            <div className="mb-2 font-normal text-gray-600">
                <div className="w-[max-content] flex items-center text-left gap-2">
                    <img
                        src={item[0].profile}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full mx-auto"
                    />
                    <div>
                        <p className="font-bold text-xs">
                            {item.first_name + " " + item.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                    </div>
                </div>
            </div>
            <div key={index} className="flex gap-6 ">
                <div className="space-y-2">
                    {tableHeaders
                        .filter((item) => item.name !== "Applicant")
                        .map((header, index) => (
                            <p
                                key={index}
                                className="text-xs font-bold text-gray-800"
                            >
                                {header.name}
                            </p>
                        ))}
                </div>
                <div className="text-xs space-y-2">
                    <p className="font-normal text-gray-600">
                        {item.application_id}
                    </p>
                    <p className="font-normal text-gray-600">{item.batch}</p>
                    <p className="font-normal text-gray-600">
                        {formatDateTime(item.schedule) || "Not Set"}
                    </p>
                    <p className="font-normal text-gray-600">
                        {edit && editingId === item.application_id ? (
                            <input
                                className="p-1 w-16 text-center border-[1px] outline-green-500"
                                type="text"
                                onChange={(e) => handleChange(e.target.value)}
                                value={score}
                            />
                        ) : (
                            <span>{item.score || "--"}</span>
                        )}
                    </p>

                    <button
                        onClick={() => {
                            if (edit && editingId === item.application_id) {
                                handleAddScore(item.application_id);
                            } else {
                                handleButtonState(
                                    item.application_id,
                                    item.score || ""
                                );
                            }
                        }}
                        title={
                            edit && editingId === item.application_id
                                ? "Save Changes"
                                : item.score != null
                                  ? "Edit Score"
                                  : "Add Score"
                        }
                        className={`inline-flex items-center ${
                            (edit && editingId) === item.application_id
                                ? "text-green-600 hover:text-green-900"
                                : item.score != null
                                  ? "text-blue-600 hover:text-blue-900"
                                  : "text-green-600 hover:text-green-900"
                        }`}
                    >
                        {(edit && editingId) === item.application_id ? (
                            <Check className="w-4 h-4 mr-1" />
                        ) : item.score != null ? (
                            <PencilLine className="w-4 h-4 mr-1" />
                        ) : (
                            <PencilLine className="w-4 h-4 mr-1" />
                        )}
                    </button>

                    {edit && editingId === item.application_id && (
                        <button
                            onClick={() => {
                                setEdit(false);
                                setEditingId(null);
                            }}
                            title={"Cancel"}
                            className={`inline-flex items-center text-red-600 hover:text-red-900`}
                        >
                            <X className="w-4 h-4 mr-1" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
