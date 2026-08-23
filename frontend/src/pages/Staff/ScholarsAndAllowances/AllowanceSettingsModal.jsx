import { useEffect, useState } from "react";
import InputModal from "../../../components/InputModal";
import { formatCurrency } from "../../../utils/formatCurrency";
import { numbersOnly } from "../../../utils/inputValidations";
import { useAllowanceSettings } from "../../../hooks/useAllowanceSettings";

function AllowanceSettingsModal({
    isOpen,
    onClose,
    label,
    onRefresh,
    isLoading = false,
}) {
    const [maximumHours, setMaximumHours] = useState("");
    const [amountPerHour, setAmountPerHour] = useState("");
    const { loading, allowanceSettings, setMaximumHoursAndAmountPerHour } =
        useAllowanceSettings();

    useEffect(() => {
        setMaximumHours(allowanceSettings?.maximum_hours || "");
        setAmountPerHour(allowanceSettings?.amount_per_hour || "");
    }, [allowanceSettings]);

    const toNumber = (value) => parseFloat(value) || 0.0;

    const resetFields = () => {
        // setFeedback("");
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        onClose(false);
    };

    const handleSubmit = async () => {
        const success = await setMaximumHoursAndAmountPerHour(
            maximumHours,
            amountPerHour,
        );

        if (success) {
            onClose(false);
            onRefresh();
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
            isLoading={loading}
        >
            <div className="pb-5">
                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Maximum hours counted per month
                    </label>
                    <input
                        type="text"
                        name="maximum_hours"
                        min={1}
                        value={maximumHours}
                        placeholder="Maximum hours per month"
                        onChange={(e) => {
                            let value = numbersOnly(e.target.value);

                            setMaximumHours(value);
                        }}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800  focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Amount per hour (₱)
                    </label>
                    <input
                        type="text"
                        name="amount_per_hour"
                        min={1}
                        value={amountPerHour}
                        placeholder="Amount per hour (₱)"
                        onChange={(e) => {
                            let value = numbersOnly(e.target.value);

                            setAmountPerHour(value);
                        }}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
            </div>
        </InputModal>
    );
}

export default AllowanceSettingsModal;
