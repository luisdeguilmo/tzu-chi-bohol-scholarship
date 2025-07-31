import { formatDateTime } from "../../../utils/formatDateTime";

const ScholarAccountsRow = ({
    currentItems,
    selectedAccounts,
    toggleAccountSelection,
    profilePics,
}) => {
    return (
        <>
            {currentItems.map((account, index) => (
                <tr
                    key={index}
                    className={`transition-colors text-center ${
                        selectedAccounts.includes(account.account_id)
                            ? "bg-green-50"
                            : ""
                    } text-xs`}
                >
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={selectedAccounts.includes(
                                account.account_id
                            )}
                            onChange={() =>
                                toggleAccountSelection(account.account_id)
                            }
                        />
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {account.account_id}
                    </td>
                    <td className="py-3 flex justify-start whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[20%]"></div>
                        <div className="w-[max-content] flex text-left gap-2">
                            <img
                                src={profilePics[account.account_id]}
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold">
                                    {account.first_name +
                                        " " +
                                        account.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {account.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {account.password}
                    </td>
                    <td className="py-3 whitespace-nowrap text-gray-500">
                        {account.created_at
                            ? formatDateTime(account.created_at)
                            : "--"}
                    </td>
                    <td className="py-3 whitespace-nowrap font-medium">
                        <button
                            onClick={() => resetPassword(account.id)}
                            // disabled={loading}
                            className="text-green-600 hover:text-green-900"
                        >
                            Reset Password
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default ScholarAccountsRow;
