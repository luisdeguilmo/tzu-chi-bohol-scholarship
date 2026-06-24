import TableRow from "../../../components/TableRow";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { formatDateTime } from "../../../utils/formatDateTime";

const UnassignedTableRow = ({
    loading,
    currentItems,
    selectedApplicants,
    toggleApplicantSelection,
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
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {info.application_id}
                        </td>
                        <td className="py-2.5 flex whitespace-nowrap text-sm text-gray-700">
                            <div className="w-[25%]"></div>
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
                            {info.batch || "Unassigned"}
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {formatDateTime(info.created_at)}
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            {formatDateTime(info.approved_at)}
                        </td>
                        <td className="py-2.5 whitespace-nowrap font-medium">
                            <button
                                onClick={() =>
                                    viewPdf({
                                        applicationId: item.application_id,
                                        scholarId: null,
                                    })
                                }
                                className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </button>
                        </td>
                    </TableRow>
                ))}
        </>
    );
};

export default UnassignedTableRow;
