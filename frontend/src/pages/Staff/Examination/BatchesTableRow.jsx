import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import axios from "axios";
import { toast } from "react-toastify";

const BatchesTableRow = ({
    tab,
    currentItems,
    selectedApplicants,
    toggleApplicantSelection,
    profilePics,
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
            const response = await axios.post(
                `http://localhost:8000/app/views/scores.php`, // Updated endpoint
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Check for success and update the UI
            if (response.data.success) {
                // Update the local state to reflect the change
                // const updatedApplicants = applicantsEachBatch.map((item) =>
                //     item.applicationInfo.application_id === id
                //         ? {
                //               ...item,
                //               applicationInfo: {
                //                   ...item.applicationInfo,
                //                   score: score,
                //               },
                //           }
                //         : item
                // );
                // setApplicantsEachBatch(updatedApplicants);
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
                            ? "bg-green-50"
                            : ""
                    } border-b border-gray-100`}
                >
                    <td className="py-3 whitespace-nowrap text-gray-500">
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
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {info.application_id}
                    </td>
                    <td className="py-3 flex whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex text-left gap-2">
                            <img
                                src={profilePics[info.application_id]}
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold">
                                    {info.first_name + " " + info.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {info.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {info.batch}
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {formatDateTime(info.schedule) || "Not Set"}
                    </td>
                    <td className="py-3 text-center whitespace-nowrap text-gray-500">
                        {edit && editingId === info.application_id ? (
                            <input
                                className="p-1 w-16 text-center border-[1px] outline-green-500"
                                type="text"
                                onChange={(e) => handleChange(e.target.value)}
                                value={score}
                            />
                        ) : (
                            <span>{info.score}</span>
                        )}
                    </td>

                    <td className="py-3 whitespace-nowrap font-medium">
                        <button
                            onClick={() => {
                                if (edit && editingId === info.application_id) {
                                    handleAddScore(info.application_id);
                                } else {
                                    handleButtonState(
                                        info.application_id,
                                        info.score || ""
                                    );
                                }
                            }}
                            title={
                                edit && editingId === info.application_id
                                    ? "Save Changes"
                                    : info.score != null
                                    ? "Edit Score"
                                    : "Add Score"
                            }
                            className={`inline-flex items-center ${
                                info.score != null
                                    ? "text-blue-600 hover:text-blue-900"
                                    : "text-green-600 hover:text-green-900"
                            }`}
                        >
                            {(edit && editingId) === info.application_id ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 12l2 2 4-4M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"
                                    />
                                </svg>
                            ) : info.score != null ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z"
                                    />
                                </svg>
                            )}
                            {/* {edit && editingId === info.application_id
                                ? "Save"
                                : info.score != null
                                ? "Edit Score"
                                : "Add Score"} */}
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default BatchesTableRow;
