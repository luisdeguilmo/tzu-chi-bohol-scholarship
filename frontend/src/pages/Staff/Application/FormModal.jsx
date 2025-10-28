import { toast } from "react-toastify";
import InputModal from "../../../components/InputModal";
import { useState } from "react";
import { manageApplication } from "../../../services/emailService";
import { User } from "lucide-react";

function FormModal({
    isOpen,
    onClose,
    label,
    action,
    setAction,
    applicant,
    onSuccess,
}) {
    const [applicantId, setApplicantId] = useState("");
    const [feedback, setFeedback] = useState("");

    const { approveApplication, rejectApplication } = manageApplication();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (action === "approve") {
            handleApproveApplication();
        } else {
            handleRejectApplication();
        }
    };

    const handleApproveApplication = async () => {
        if (+applicant.application_id !== +applicantId) {
            toast.error("Incorrect application ID. Please try again.");
            return;
        }

        const success = await approveApplication(applicant);

        if (success) {
            await onSuccess();
            onClose(false);
            setAction("");
        }
    };

    const handleRejectApplication = async () => {
        if (+applicant.application_id !== +applicantId) {
            toast.error("Incorrect application ID. Please try again.");
            return;
        }

        const success = await rejectApplication(applicant, feedback);

        if (success) {
            onClose(false);
        }
    };

    const resetFields = () => {
        setApplicantId("");
        setFeedback("");
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setApplicantId("");
        onClose(false);
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
            buttonLabel="Confirm"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
        >
            <form onSubmit={handleSubmit} className="pt-4 pb-6 px-6">
                {/* Form Inputs */}
                <div>
                    <p className="text-xs py-2 text-gray-600">
                        Applicant Name
                    </p>
                    <p className="px-2 py-2.5 -mt-1.5 border bg-gray-100 text-gray-600 text-xs rounded-md flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        {applicant?.first_name + " " + applicant?.last_name}
                    </p>
                </div>
                <div>
                    <label className="mt-2 py-2 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Application ID *
                        <input
                            type="number"
                            value={applicantId}
                            required
                            onChange={(e) => setApplicantId(e.target.value)}
                            placeholder={"Enter application id"}
                            className="w-full p-2 resize-none border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        ></input>
                    </label>
                    {action === "reject" && (
                        <label className="py-2 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Feedback
                            <textarea
                                rows={4}
                                value={feedback}
                                required
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={"Enter feedback"}
                                className="w-full resize-none border border-gray-300 text-sm rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                            ></textarea>
                        </label>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 text-sm mt-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-green-600 text-white hover:bg-green-700`}
                    >
                        {/* Add {label} */}{" "}
                        {/* {isLoading ? "Submitting" : `Add ${label}`} */}
                        Confirm
                    </button>
                </div>
            </form>
        </InputModal>
    );
}

export default FormModal;
