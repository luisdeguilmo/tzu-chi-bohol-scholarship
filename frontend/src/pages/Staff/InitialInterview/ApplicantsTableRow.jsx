import { ArrowRight, DownloadIcon, Eye, XCircle } from "lucide-react";
import TableRow from "../../../components/TableRow";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { formatDateTime } from "../../../utils/formatDateTime";

const ApplicantsTableRow = ({
    loading,
    currentItems,
    selectedApplicants,
    onApprove,
    onReject,
}) => {
    const { fetchApplicantData } = useApplicantData();
    const { viewPdf, downloadPdf } = usePdfActions("new", fetchApplicantData);

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
                            {formatDateTime(info.created_at)}
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-center font-medium">
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() =>
                                        viewPdf({
                                            applicationId: info.application_id,
                                            scholarId: null,
                                        })
                                    }
                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    title="View PDF"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        downloadPdf({
                                            applicationId: info.application_id,
                                            scholarId: null,
                                        })
                                    }
                                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    title="Download PDF"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onApprove(info)}
                                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    // disabled={loading}
                                    title="Next Stage"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onReject(info)}
                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    // disabled={loading}
                                    title="Reject"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </TableRow>
                ))}
        </>
    );
};

export default ApplicantsTableRow;
