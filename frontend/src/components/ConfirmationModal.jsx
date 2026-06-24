import { useState } from "react";
import InputModal from "./InputModal";
import { formatCurrency } from "../utils/formatCurrency";
import { all } from "axios";
import React from "react";
import { Check, X } from "lucide-react";

function ConfirmationModal({
    isOpen,
    onClose,
    isLoading,
    label,
    submitButtonLabel,
    closeButtonLabel,
    message,
    action = "",
    onClick,
    removeBackground = false,
    feedback,
    setFeedback,
    deactivationReason,
    setDeactivationReason,
    isScholarAccount = false,
    isForProcessAllowance = false,
    allowanceSettings = null,
    passedApplicants = [],
    failedApplicants = [],
}) {
    const resetFields = () => {
        if (action === "reject") {
            setFeedback("");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        onClose(false);
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
            removeBackground={removeBackground}
            buttonLabel={submitButtonLabel ? submitButtonLabel : "Confirm"}
            closeButtonLabel={closeButtonLabel ? closeButtonLabel : null}
            onCancel={handleCancel}
            onSubmit={onClick}
            isLoading={isLoading}
        >
            <div className={`p-4`}>
                <div>
                    {isForProcessAllowance && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-700">
                                Process Allowance for December
                            </h2>
                            <p className="py-2.5 text-justify text-xs text-gray-600">
                                This will calculate the allowance for all
                                scholars using the following rules:
                            </p>
                            <p className="mt-1 mb-1 font-bold text-xs text-gray-700">
                                Allowance
                            </p>
                            <ul className="list-disc pl-5 text-xs text-gray-600">
                                <li>
                                    Maximum hours counted per month:{" "}
                                    {allowanceSettings?.maximum_hours || 0}{" "}
                                    hours
                                </li>
                                <li>
                                    Amount per hour: ₱
                                    {allowanceSettings?.amount_per_hour || 0}
                                </li>
                                <li>
                                    Maximum allowance:{" "}
                                    {formatCurrency(
                                        allowanceSettings?.maximum_hours *
                                            allowanceSettings?.amount_per_hour ||
                                            0,
                                    )}
                                </li>
                            </ul>
                            <p className="mt-4 mb-1 font-bold text-xs text-gray-700">
                                Other Allowances
                            </p>
                            <ul className="mb-1 list-disc pl-5 text-xs text-gray-600">
                                <li>Transportation Allowance</li>
                                <li>Load Allowance</li>
                            </ul>
                        </>
                    )}
                    <p className="mb-1 py-2.5 text-justify text-sm text-gray-700">
                        {message}
                    </p>
                    {(passedApplicants.length > 0 ||
                        failedApplicants.length < 0) && (
                        <div>
                            <p className="mb-1 text-gray-800 text-sm">Passed: </p>
                            <ul className="text-xs text-gray-700">
                                {passedApplicants.map((applicant) => (
                                    <li
                                        key={applicant.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>
                                            {applicant.last_name +
                                                ", " +
                                                applicant.first_name}{" "}
                                            {applicant.middle_name
                                                ? applicant.middle_name[0] + "."
                                                : ""}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <p className="mb-1 mt-4 text-gray-800 text-sm">
                                Failed:{" "}
                            </p>
                            <ul className="text-xs text-gray-700">
                                {failedApplicants.map((applicant) => (
                                    <li
                                        key={applicant.id}
                                        className="flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4 text-red-600" />
                                        <span>
                                            {applicant.last_name +
                                                ", " +
                                                applicant.first_name}{" "}
                                            {applicant.middle_name
                                                ? applicant.middle_name[0] + "."
                                                : ""}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {action === "reject" && (
                        <label className="py-2 flex flex-col gap-[1px] text-gray-500 text-xs">
                            Reason for rejection (optional):
                            <textarea
                                rows={4}
                                value={feedback}
                                required
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={
                                    "Please provide feedback for the applicant..."
                                }
                                className="w-full resize-none border border-gray-300 text-xs text-gray-700 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                            ></textarea>
                        </label>
                    )}

                    {isScholarAccount && action === "deactivate" && (
                        <div className="mt-2 block w-full relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                Reason for Deactivation
                            </label>
                            <select
                                name="deactivation_reason"
                                value={deactivationReason} // <-- controlled value
                                onChange={(e) =>
                                    setDeactivationReason(e.target.value)
                                } // <-- change handler
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                {/* <option value="pending">Pending</option> */}
                                <option value="graduated">Graduated</option>
                                <option value="terminated">Terminated</option>
                                {/* <option value="terminated">Other</option> */}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </InputModal>
    );
}

export default ConfirmationModal;
