import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";
import { ClipboardEdit, PenLine } from "lucide-react";

const OrientationTableRow = ({
    tab,
    currentItems,
    selectedApplicants,
    toggleApplicantSelection,
    profilePics,
    onRefresh,
    onOpenModal,
    onSelectScholarId,
    onSelectScholar,
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
                `${BASE_URL}/app/views/scores.php`, // Updated endpoint
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

    console.log(selectedApplicants);

    return (
        <>
            {currentItems.map((info, index) => (
                <tr
                    key={index}
                    className={`transition-colors text-center text-xs ${
                        selectedApplicants.includes(info.application_id)
                            ? "bg-gray-50"
                            : ""
                    } border-b border-gray-100`}
                >
                    <td className="py-2 pl-3 text-left whitespace-nowrap text-gray-500">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-green-600 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={selectedApplicants.includes(
                                info.application_id
                            )}
                            onChange={() =>
                                toggleApplicantSelection(info.application_id)
                            }
                        />
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {info.application_id}
                    </td>
                    <td className="py-2 flex whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex items-center text-left gap-2">
                            <img
                                src={profilePics[info.application_id]}
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold text-xs">
                                    {info.first_name + " " + info.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {info.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-2 text-center whitespace-nowrap text-gray-500">
                        {info.batch}
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium ${
                                info.is_attended_orientation
                                    ? "bg-green-100 text-green-800"
                                    : info.is_not_attended_orientation
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {info.is_attended_orientation
                                ? "Attended"
                                : info.is_not_attended_orientation
                                  ? "Not Attended"
                                  : "Pending"}
                        </span>
                    </td>
                    <td className="py-2 text-center whitespace-nowrap text-gray-500">
                        {formatDateTime(info.schedule) || "Not Set"}
                    </td>

                    <td className="py-2 whitespace-nowrap font-medium">
                        <button
                            onClick={() => {
                                onSelectScholarId(info.application_id);
                                onSelectScholar(info);
                                onOpenModal(true);
                            }}
                            title={"Change Status"}
                            className={`inline-flex items-center ${
                                info.score != null
                                    ? "text-blue-600 hover:text-blue-900"
                                    : "text-green-600 hover:text-green-900"
                            }`}
                        >
                            <PenLine className="w-4 h-4 mr-1" />
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default OrientationTableRow;
