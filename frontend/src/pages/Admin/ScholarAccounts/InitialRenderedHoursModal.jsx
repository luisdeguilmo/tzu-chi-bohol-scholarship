import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { numbersOnly } from "../../../utils/inputValidations";
import { useRecordHours } from "../../../hooks/useRecordHours";

const InitialRenderedHours = ({ isOpen, onClose, id }) => {
    const [initialRenderedHours, setInitialRenderedHours] = useState("");

    const { isLoading, setRenderedHours } = useRecordHours();

    const handleSubmit = async () => {
        try {
            const success = await setRenderedHours(id, initialRenderedHours);

            if (success) {
                // await onSuccess();
                onClose(false);
                resetFields();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const resetFields = () => {
        setInitialRenderedHours("");
    };

    const handleCancel = () => {
        resetFields();
        onClose(false);
    };

    return (
        <InputModal
            label={"Initial Rendered Hours"}
            isOpen={isOpen}
            onClose={onClose}
            buttonLabel={"Submit"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        >
            <div className="p-6">
                <div className="block relative">
                    <label className="block mb-1 text-gray-800 text-xs">
                        Initial Rendered Hours
                    </label>
                    <input
                        type="text"
                        value={initialRenderedHours}
                        onChange={(e) =>
                            setInitialRenderedHours(e.target.value)
                        }
                        placeholder="Initial Rendered Hours"
                        className="mt-1 w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="h-4"></div>
            </div>
        </InputModal>
    );
};

export default InitialRenderedHours;
