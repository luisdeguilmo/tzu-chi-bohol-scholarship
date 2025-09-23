import { formatDateTime } from "../../../utils/formatDateTime";

const ExaminationResultTable = ({
    index,
    applicationInfo,
    personalInfo,
    getSchedule,
    handleChange,
    edit,
    editingId,
    score,
}) => {
    return (
        <>
            <td className="py-3 whitespace-nowrap text-gray-500">
                {applicationInfo.application_id}
            </td>
            <td className="py-3 whitespace-nowrap text-gray-500">
                {personalInfo.last_name +
                    ", " +
                    personalInfo.middle_name +
                    ", " +
                    personalInfo.first_name}
            </td>
            <td className="py-3 whitespace-nowrap text-gray-500">
                {applicationInfo.batch}
            </td>
            <td className="py-3 whitespace-nowrap text-gray-500">
                {formatDateTime(personalInfo.created_at)}
            </td>
            <td className="py-3 whitespace-nowrap text-gray-500">
                {formatDateTime(getSchedule(applicationInfo.batch)) ||
                    "Not Set"}
            </td>
            <td className="py-3 text-center whitespace-nowrap text-gray-500">
                {edit && editingId === applicationInfo.application_id ? (
                    <input
                        className="p-1 w-16 text-center border-[1px] outline-green-500"
                        type="text"
                        onChange={(e) => handleChange(e.target.value)}
                        value={score}
                    />
                ) : (
                    <span>{applicationInfo.score || "0"}</span>
                )}
            </td>

            <td className="py-3 whitespace-nowrap font-medium">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium
                    ${
                        applicationInfo.score > 50
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {applicationInfo.score > 50 ? "Passed" : "Failed"}
                </span>
            </td>
        </>
    );
};

export default ExaminationResultTable;
