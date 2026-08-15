import { useState } from "react";
import InputModal from "./InputModal";
import { formatCurrency } from "../utils/formatCurrency";
import { all } from "axios";
import React from "react";
import { Check, Download, FileWarning, TriangleAlert, X } from "lucide-react";

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
    onClickOverview,
    removeBackground = false,
    feedback,
    setFeedback,
    deactivationReason,
    deactivationType,
    setDeactivationReason,
    setDeactivationType,
    isScholarAccount = false,
    isForProcessAllowance = false,
    allowanceSettings = null,
    passedApplicants = [],
    failedApplicants = [],
}) {
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);

    const handleButtonState = () => {
        setIsButtonEnabled(!isButtonEnabled);
    };

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
            disabledButtonSave={
                isForProcessAllowance ||
                passedApplicants.length > 0 ||
                failedApplicants.length > 0
                    ? !isButtonEnabled
                        ? false
                        : true
                    : false
            }
        >
            <div className={`p-4`}>
                <div>
                    {isForProcessAllowance && (
                        <>
                            {/* <h2 className="text-sm font-semibold text-gray-700">
                                Process Allowance
                            </h2> */}
                            <p className="pt-2 pb-2.5 text-justify text-xs text-gray-600">
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

                            <button
                                type="button"
                                className="py-4 flex items-center gap-2"
                                onClick={onClickOverview}
                            >
                                <Download className="w-3.5 h-3.5 text-gray-700" />
                                <span className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                                    Download Allowance Sheet
                                </span>
                            </button>
                        </>
                    )}

                    {(passedApplicants.length > 0 ||
                        failedApplicants.length > 0) && (
                        <div className="mb-4">
                            <h3 className="mb-4 text-sm text-gray-700">
                                Review applicants before sending their
                                results.{" "}
                            </h3>

                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <span className="mr-2 p-[3px] rounded-full bg-green-600">
                                        <Check className="w-3 h-3 text-white" />
                                    </span>
                                    <p className="text-gray-800 text-sm">
                                        Passed{" "}
                                    </p>
                                </div>
                                <p className="text-lg text-green-700 font-bold mr-2">
                                    {passedApplicants.length}
                                </p>
                            </div>
                            <hr />
                            <ul className="mt-3 text-xs space-y-1 text-gray-700">
                                {passedApplicants.map((applicant) => (
                                    <li
                                        key={applicant.id}
                                        className="flex items-center gap-2"
                                    >
                                        {/* <span className="p-[3px] rounded-full bg-green-600">
                                            <Check className="w-3 h-3 text-white" />
                                        </span> */}
                                        <div className="w-full flex justify-between items-center">
                                            <span>
                                                {applicant.last_name +
                                                    ", " +
                                                    applicant.first_name}{" "}
                                                {applicant.middle_name
                                                    ? applicant.middle_name[0] +
                                                      "."
                                                    : ""}
                                            </span>
                                            <span>{applicant.score}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex justify-between">
                                <div className="flex items-center">
                                    <span className="mr-2 p-[3px] rounded-full bg-red-600">
                                        <X className="w-3 h-3 text-white" />
                                    </span>
                                    <p className="text-gray-800 text-sm">
                                        Failed{" "}
                                    </p>
                                </div>
                                <p className="text-lg text-red-700 font-bold mr-2">
                                    {failedApplicants.length}
                                </p>
                            </div>

                            <hr />
                            <ul className="mt-3 text-xs space-y-1 text-gray-700">
                                {failedApplicants.map((applicant) => (
                                    <li
                                        key={applicant.id}
                                        className="flex items-center gap-2"
                                    >
                                        {/* <span className="p-[3px] rounded-full bg-red-600">
                                            <X className="w-3 h-3 text-white" />
                                        </span> */}
                                        <div className="w-full flex justify-between items-center">
                                            <span>
                                                {applicant.last_name +
                                                    ", " +
                                                    applicant.first_name}{" "}
                                                {applicant.middle_name
                                                    ? applicant.middle_name[0] +
                                                      "."
                                                    : ""}
                                            </span>
                                            <span>{applicant.score}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* <div className="mt-6 mb-1 flex gap-2 items-center">
                                <TriangleAlert className="w-4 h-4.5 text-red-600" />
                                <h3 className="text-gray-700 text-sm font-bold">
                                    Confirmation
                                </h3>
                            </div> */}
                        </div>
                    )}
                    <p className="py-2 pb-2.5 text-justify text-xs text-gray-700">
                        {message}
                    </p>

                    {isForProcessAllowance && (
                        <div className="mt-1 flex">
                            <input
                                type="checkbox"
                                value={isButtonEnabled}
                                onChange={handleButtonState}
                                className="accent-green-600"
                            />
                            <p className="ml-2 text-xs text-justify text-gray-700">
                                I have reviewed the allowance sheet and confirm
                                that the scholars and allowance amounts are
                                correct.
                            </p>
                        </div>
                    )}
                    {(passedApplicants.length > 0 ||
                        failedApplicants.length > 0) && (
                        <div className="flex">
                            <input
                                type="checkbox"
                                value={isButtonEnabled}
                                onChange={handleButtonState}
                            />
                            <p className="ml-2 text-xs text-gray-700">
                                I confirm that I want to send these results to
                                the listed applicants.
                            </p>
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

                            {deactivationReason !== "" && (
                                <div>
                                    {" "}
                                    <label className="block mt-3 mb-1 text-gray-600 text-xs">
                                        {deactivationReason === "terminated"
                                            ? "Reason"
                                            : "Special Award"}
                                    </label>
                                    <textarea
                                        value={deactivationType}
                                        onChange={(e) =>
                                            setDeactivationType(e.target.value)
                                        }
                                        placeholder={`${
                                            deactivationReason === "terminated"
                                                ? "Reason..."
                                                : "Special Award..."
                                        }`}
                                        rows={3}
                                        className="resize-none w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </InputModal>
    );
}

export default ConfirmationModal;
