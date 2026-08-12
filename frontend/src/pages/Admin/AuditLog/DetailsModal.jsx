import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";
import { numbersOnly } from "../../../utils/inputValidations";
import { formatDateTime } from "../../../utils/formatDateTime";

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
                <h3 className="underline underline-offset-2 text-gray-800">
                    EVENT INFORMATION
                </h3>

                <div>
                    <p className="text-[11px] text-gray-600">Date & Time</p>
                    <p className="text-xs text-gray-800">{formatDateTime(data?.created_at)}</p>
                </div>

                <div>
                    <p className="text-[11px] text-gray-600">Actor</p>
                    <p className="text-xs text-gray-800">{data?.actor}</p>
                </div>

                <div>
                    <p className="text-[11px] text-gray-600">User Role</p>
                    <p className="text-xs text-gray-800">{data?.user_role}</p>
                </div>

                <div>
                    <p className="text-[11px] text-gray-600">Action</p>
                    <p className="text-xs text-gray-800">{data?.action}</p>
                </div>

                <h3 className="underline underline-offset-2 text-gray-800">
                    DESCRIPTION
                </h3>

                <p className="text-xs text-gray-800">{data?.description}</p>

                <h3 className="underline underline-offset-2 text-gray-800">
                    REQUEST INFORMATION
                </h3>

                <div>
                    <p className="text-[11px] text-gray-600">IP Address</p>
                    <p className="text-xs text-gray-800">{data?.ip_address}</p>
                </div>

                <div>
                    <p className="text-[11px] text-gray-600">User Agent</p>
                    <p className="text-xs text-gray-800">{data?.user_agent}</p>
                </div>

                {/* <h3 className="underline underline-offset-2 text-gray-800">
                    VALUES
                </h3> */}
            </div>
        </InputModal>
    );
};

export default DetailsModal;
