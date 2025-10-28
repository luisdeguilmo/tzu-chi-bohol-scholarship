import { useEffect, useState } from "react";
import InputModal from "../../../components/InputModal";

function ChangeStatusModal({
    scholar,
    isOpen,
    onClose,
    label,
    onUpdate,
    scholarId,
    onRefresh,
    onRefreshAllowanceData,
    isLoading,
}) {
    const [allowance, setAllowance] = useState(scholar?.allowance || "");
    const [transportAllowance, setTransportAllowance] = useState("");
    const [loadAllowance, setLoadAllowance] = useState("");
    const [allowanceStatus, setAllowanceStatus] = useState(
        scholar?.allowance_status || ""
    );

    useEffect(() => {
        if (scholar) {
            setAllowance(scholar?.allowance || "");
            setAllowanceStatus(scholar?.allowance_status || "");
            setTransportAllowance(scholar?.transport_allowance || "");
            setLoadAllowance(scholar?.load_allowance || "");
        }
    }, [scholar]);

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

    const handleSubmit = async () => {
        const success = await onUpdate(
            allowanceStatus,
            scholarId,
            transportAllowance,
            loadAllowance
        );

        if (success) {
            onClose(false);
            onRefresh();
            onRefreshAllowanceData();
        }
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            buttonLabel={"Save"}
            isLoading={isLoading}
        >
            <div className="pb-5">
                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Allowance
                    </label>
                    <input
                        type="number"
                        name="allowance"
                        min={0}
                        value={allowance}
                        readOnly
                        placeholder="Allowance"
                        onChange={(e) => setAllowance(e.target.value)}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800  focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Transport Allowance
                    </label>
                    <input
                        type="number"
                        name="transport_allowance"
                        min={0}
                        value={transportAllowance}
                        placeholder="Transport Allowance"
                        onChange={(e) => setTransportAllowance(e.target.value)}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Load Allowance
                    </label>
                    <input
                        type="number"
                        name="load_allowance"
                        min={0}
                        value={loadAllowance}
                        placeholder="Load Allowance"
                        onChange={(e) => setLoadAllowance(e.target.value)}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Total
                    </label>
                    <div className="w-full border text-xs bg-gray-100 border-gray-200 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500">
                        ₱{" "}{allowance + transportAllowance + loadAllowance}
                    </div>
                </div>

                {/* <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Allowance Status
                    </label>
                    <select
                        name="allowance_status"
                        value={allowanceStatus}
                        onChange={(e) =>
                            handleAllowanceStatusChange(e.target.value)
                        } // <-- change handler
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        <option value="not_received">Not Received</option>
                        <option value="pending">Pending</option>
                        <option value="received">Received</option>
                    </select>
                </div> */}
            </div>
        </InputModal>
    );
}

export default ChangeStatusModal;
