import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { useSpecialSponsor } from "../../../hooks/useSpecialSponsor";

const SpecialSponsorModal = ({ isOpen, onClose, id, scholarSponsor }) => {
    const [sponsor, setSponsor] = useState(scholarSponsor || "");

    const { isLoading, setSpecialSponsor } = useSpecialSponsor();

    const handleSubmit = async () => {
        try {
            const trimmedSponsor = sponsor.trim();

            // Must contain at least one letter
            if (!/[A-Za-z]/.test(trimmedSponsor)) {
                toast.error("Invalid sponsor. Must contain text.");
                return;
            }

            const success = await setSpecialSponsor(id, trimmedSponsor);

            if (success) {
                onClose(false);
                resetFields();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const resetFields = () => {
        setSponsor("");
    };

    const handleCancel = () => {
        resetFields();
        onClose(false);
    };

    return (
        <InputModal
            label={"Special Sponsor"}
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
                        Special Sponsor
                    </label>
                    <input
                        type="text"
                        value={sponsor}
                        onChange={(e) => setSponsor(e.target.value)}
                        placeholder="Special Sponsor"
                        className="mt-1 w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
            </div>
        </InputModal>
    );
};

export default SpecialSponsorModal;
