import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";
import { Check, PencilLine, X } from "lucide-react";

const BatchesTableRow = ({
    loading,
    tab,
    currentItems,
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
                },
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

    return (
        <>
            {loading && (
                <tr>
                    <td colSpan={6} className="p-6">
                        <div className="mt-4 flex flex-col items-center gap-4">
                            <div className="flex items-end gap-1 h-10">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-emerald-500 rounded-full animate-bounce"
                                        style={{
                                            height: "10px",
                                            animationDelay: `${i * 100}ms`,
                                        }}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-slate-500">
                                Loading data...
                            </p>
                        </div>
                    </td>
                </tr>
            )}

            {!loading &&
                currentItems.map((info, index) => (
                    <tr
                        key={index}
                        className={`transition-colors text-center text-xs ${
                            selectedApplicants.includes(info.application_id)
                                ? "bg-gray-50"
                                : ""
                        } border-b border-gray-100`}
                    >
                        <td className="py-2.5 pl-3 text-left whitespace-nowrap text-gray-500">
                            <input
                                type="checkbox"
                                className="h-3.5 w-3.5 accent-green-600 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                checked={selectedApplicants.includes(
                                    info.application_id,
                                )}
                                onChange={() =>
                                    toggleApplicantSelection(
                                        info.application_id,
                                    )
                                }
                            />
                        </td>
                        <td className="py-2.5 whitespace-nowrap font-bold text-gray-700">
                            {info.application_id}
                        </td>
                        <td className="py-2.5 flex whitespace-nowrap text-sm text-gray-700">
                            <div className="w-[30%]"></div>
                            <div className="w-[max-content] flex items-center text-left gap-2">
                                <img
                                    src={info[0].profile}
                                    alt="Profile"
                                    className="w-10 h-10 object-cover rounded-full mx-auto"
                                />
                                <div>
                                    <p className="font-bold text-xs">
                                        {info.last_name +
                                            ", " +
                                            info.first_name}{" "}
                                        {info.middle_name
                                            ? info.middle_name[0] + "."
                                            : ""}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        {info.email}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {info.batch}
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {formatDateTime(info.schedule) || "Not Set"}
                        </td>
                        <td className="py-2.5 text-center whitespace-nowrap text-gray-500">
                            {edit && editingId === info.application_id ? (
                                <input
                                    className="p-1 w-16 text-center border-[1px] outline-green-500"
                                    type="text"
                                    onChange={(e) =>
                                        handleChange(e.target.value)
                                    }
                                    value={score}
                                />
                            ) : (
                                <span>{info.score}</span>
                            )}
                        </td>

                        <td className="py-2.5 whitespace-nowrap font-medium">
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (
                                            edit &&
                                            editingId === info.application_id
                                        ) {
                                            handleAddScore(info.application_id);
                                        } else {
                                            handleButtonState(
                                                info.application_id,
                                                info.score || "",
                                            );
                                        }
                                    }}
                                    title={
                                        edit &&
                                        editingId === info.application_id
                                            ? "Save Changes"
                                            : info.score != null
                                              ? "Edit Score"
                                              : "Add Score"
                                    }
                                    className={`inline-flex items-center ${
                                        (edit && editingId) ===
                                        info.application_id
                                            ? "text-green-600 hover:text-green-900"
                                            : info.score != null
                                              ? "text-blue-600 hover:text-blue-900"
                                              : "text-green-600 hover:text-green-900"
                                    }`}
                                >
                                    {(edit && editingId) ===
                                    info.application_id ? (
                                        <Check className="w-4 h-4 mr-1" />
                                    ) : info.score != null ? (
                                        <PencilLine className="w-4 h-4 mr-1" />
                                    ) : (
                                        <PencilLine className="w-4 h-4 mr-1" />
                                    )}
                                </button>

                                {edit && editingId === info.application_id && (
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
                        </td>
                    </tr>
                ))}
        </>
    );
};

export default BatchesTableRow;
