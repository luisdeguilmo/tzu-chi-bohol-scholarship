import { useEffect, useState } from "react";
import InputModal from "../../../components/InputModal";
import { formatCurrency } from "../../../utils/formatCurrency";

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
    const [allowance, setAllowance] = useState(scholar?.allowance || 0.0);
    const [transportAllowance, setTransportAllowance] = useState(0);
    const [loadAllowance, setLoadAllowance] = useState(0.0);
    const [allowanceStatus, setAllowanceStatus] = useState(
        scholar?.allowance_status || 0.0
    );
    const [totalAllowance, setTotalAllowance] = useState(0.0);

    const toNumber = (value) => parseFloat(value) || 0.0;

    useEffect(() => {
        const total =
            toNumber(allowance) +
            toNumber(transportAllowance) +
            toNumber(loadAllowance);

        setTotalAllowance(total);
    }, [allowance, transportAllowance, loadAllowance]);

    useEffect(() => {
        if (scholar) {
            setAllowance(scholar?.allowance || 0);
            setAllowanceStatus(scholar?.allowance_status || 0);
            setTransportAllowance(scholar?.transport_allowance || 0);
            setLoadAllowance(scholar?.load_allowance || 0);
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
                        {formatCurrency(totalAllowance)}
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
                        } 
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        <option value="not_received">Not Received</option>
                        <option value="received">Received</option>
                    </select>
                </div> */}
            </div>
        </InputModal>
    );
}

export default ChangeStatusModal;
