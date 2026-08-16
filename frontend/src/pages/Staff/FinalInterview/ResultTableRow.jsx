import { Upload } from "lucide-react";
import TableRow from "../../../components/TableRow";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { formatDateTime } from "../../../utils/formatDateTime";

const ResultTableRow = ({
    loading,
    currentItems,
    selectedApplicants,
    onOpenModal,
}) => {
    const { fetchApplicantData } = useApplicantData();
    const { viewPdf } = usePdfActions(fetchApplicantData);

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
                    <TableRow
                        key={index}
                        selectedItems={selectedApplicants}
                        id={info.application_id}
                    >
                        <td className="py-2.5 whitespace-nowrap text-center text-gray-700 font-bold">
                            {info.application_id}
                        </td>
                        {/* {activeTab === "old" && (
                        <td className="py-3 whitespace-nowrap text-gray-900 font-bold">
                            {info.scholar_id}
                        </td>
                    )} */}
                        <td className="py-2.5 flex justify-start text-center whitespace-nowrap text-sm text-gray-700">
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
                        <td className="py-2.5 whitespace-nowrap text-center text-gray-500">
                            {formatDateTime(
                                info?.is_initial_interview_passed
                                    ? info.final_interview_approved_at
                                    : info.final_interview_rejected_at,
                            ) || "--"}
                        </td>
                        <td className="py-2.5 whitespace-nowrap font-medium">
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium
                    ${
                        info.is_initial_interview_passed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                            >
                                {info.is_initial_interview_passed
                                    ? "Passed"
                                    : "Failed"}
                            </span>
                        </td>
                        <td className="py-2.5 text-center whitespace-nowrap font-medium">
                            <button
                                title="Upload File(s)"
                                onClick={() => onOpenModal(info.application_id)}
                                className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                        </td>
                    </TableRow>
                ))}
        </>
    );
};

export default ResultTableRow;
