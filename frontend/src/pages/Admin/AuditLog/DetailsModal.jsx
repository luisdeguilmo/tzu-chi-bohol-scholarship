import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";
import { numbersOnly } from "../../../utils/inputValidations";

const DetailsModal = ({ isOpen, onClose, data }) => {
    return (
        <InputModal
            label={"Audit Log Details"}
            isOpen={isOpen}
            onClose={onClose}
            disabledButton={true}
            // onCancel={handleCancel}
            // onSubmit={handleSubmit}
            // isLoading={loading}
        >
            <div
                // onSubmit={(e) => {
                //     e.preventDefault();
                //     handleSubmit();
                // }}
                className="p-6 space-y-4"
            >
                <p className="text-xs text-gray-800">{data?.description}</p>
            </div>
        </InputModal>
    );
};

export default DetailsModal;
