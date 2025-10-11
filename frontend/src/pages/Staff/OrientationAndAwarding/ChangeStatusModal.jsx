import { useState } from "react";
import InputModal from "../../../components/InputModal";

function ChangeStatusModal({
    isOpen,
    onClose,
    isLoading,
    label,
    onUpdate,
    scholarId,
    onRefresh,
}) {
    const [allowanceStatus, setAllowanceStatus] = useState("");

    const resetFields = () => {
        // setFeedback("");
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        onClose(false);
    };

    const handleAllowanceStatusChange = (newStatus) => {
        setAllowanceStatus(newStatus);
        // Optional: Call API to update DB
        // updateScholarAllowanceStatus(scholarId, newStatus);
    };

    const handleChangeStatus = async () => {
        console.log(allowanceStatus, scholarId);
        const success = await onUpdate(allowanceStatus, scholarId);
        if (success) {
            onClose(false);
            onRefresh();
        } else {
            console.log("ke ");
        }
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
        >
            <form className="">
                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Status
                    </label>
                    <select
                        name="allowance_status"
                        value={allowanceStatus} // <-- controlled value
                        onChange={(e) =>
                            handleAllowanceStatusChange(e.target.value)
                        } // <-- change handler
                        className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        <option value="pending">Pending</option>
                        <option value="attended">Attended</option>
                        <option value="not_attended">Not Attended</option>
                    </select>
                </div>

                <div className="pt-4 pb-6 px-6">
                    {/* Action Buttons */}
                    <div className="flex gap-2 text-sm mt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleChangeStatus}
                            type="button"
                            className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-green-600 text-white hover:bg-green-700`}
                        >
                            {/* Add {label} */}{" "}
                            {/* {isLoading ? "Submitting" : `Add ${label}`} */}
                            {isLoading ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </form>
        </InputModal>
    );
}

export default ChangeStatusModal;
