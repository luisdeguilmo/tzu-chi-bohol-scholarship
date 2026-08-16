import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";
import { PenLine } from "lucide-react";

const OrientationTableRow = ({
    loading,
    tab,
    currentItems,
    selectedApplicants,
    toggleApplicantSelection,
    onRefresh,
    onOpenModal,
    onSelectScholarId,
    onSelectScholar,
}) => {
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
                        <td className="py-2.5 text-center whitespace-nowrap text-gray-500">
                            {info.batch_for_orientation}
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
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
                        <td className="py-2.5 text-center whitespace-nowrap text-gray-500">
                            {formatDateTime(info.schedule) || "Not Set"}
                        </td>

                        <td className="py-2.5 whitespace-nowrap font-medium">
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
