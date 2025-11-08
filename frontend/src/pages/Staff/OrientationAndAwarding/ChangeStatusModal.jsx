import { useEffect, useState } from "react";
import InputModal from "../../../components/InputModal";

function ChangeStatusModal({
    tab,
    scholar,
    isOpen,
    onClose,
    isLoading,
    label,
    onUpdate,
    scholarId,
    onRefresh,
}) {
    const [allowanceStatus, setAllowanceStatus] = useState("");

    useEffect(() => {
        setAllowanceStatus(() => {
            if (tab === "Orientation") {
                return scholar.is_attended_orientation
                    ? "attended"
                    : scholar.is_not_attended_orientation
                      ? "not_attended"
                      : "pending";
            } else if (tab === "Awarding") {
                return scholar.is_attended_awarding
                    ? "attended"
                    : scholar.is_not_attended_awarding
                      ? "not_attended"
                      : "pending";
            }
        });
    }, [tab, scholar]); // Add 'scholar' to dependencies

    console.log(tab);

    const resetFields = () => {
        // setFeedback("");
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        onClose(false);
    };

    const handleAllowanceStatusChange = (newStatus) => {
        setAllowanceStatus(newStatus);
    };

    const handleSubmit = async () => {
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
            buttonLabel={"Confirm"}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
        >
            <div>
                <div className="block w-full relative p-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Status
                    </label>
                    <select
                        name="allowance_status"
                        value={allowanceStatus} // <-- controlled value
                        onChange={(e) =>
                            handleAllowanceStatusChange(e.target.value)
                        } // <-- change handler
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        {/* <option value="pending">Pending</option> */}
                        <option value="attended">Attended</option>
                        <option value="not_attended">Not Attended</option>
                    </select>
                </div>
            </div>
        </InputModal>
    );
}

export default ChangeStatusModal;
