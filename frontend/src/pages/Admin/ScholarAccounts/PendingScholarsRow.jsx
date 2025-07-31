const PendingScholarsRow = ({
    currentItems,
    selectedScholars,
    toggleScholarSelection,
    profilePics,
}) => {
    return (
        <>
            {currentItems.map((scholar) => (
                <tr
                    key={scholar.application_id}
                    className={`transition-colors text-center ${
                        selectedScholars.includes(scholar.application_id)
                            ? "bg-green-50"
                            : ""
                    } text-xs`}
                >
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={selectedScholars.includes(
                                scholar.application_id
                            )}
                            onChange={() =>
                                toggleScholarSelection(scholar.application_id)
                            }
                            disabled={scholar.application_status !== "Pending"}
                        />
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {scholar.application_id}
                    </td>
                    <td className="py-3 flex justify-center whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[max-content] flex text-left gap-2">
                            <img
                                src={profilePics[scholar.application_id]}
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold">
                                    {scholar.first_name +
                                        " " +
                                        scholar.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {scholar.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                        </span>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default PendingScholarsRow;
