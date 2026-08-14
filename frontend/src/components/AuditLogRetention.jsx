import { useEffect, useState } from "react";
import InputModal from "./InputModal";
import { useLogRetention } from "../hooks/useLogRetention";

const retentionOptions = [
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
    { value: "180", label: "180 days" },
    { value: "365", label: "1 year" },
    { value: "never", label: "Never" },
];

export default function AuditLogRetention({ label, isOpen, onClose }) {
    const { loading, logRetention, updateLogRetention } = useLogRetention();
    const [retention, setRetention] = useState(0);

    useEffect(() => {
        setRetention(logRetention);
    }, [logRetention]);

    const selectedOption = retentionOptions.find(
        (option) => option.value === retention,
    );

    const handleCancel = () => {
        onClose(false);
    };

    const handleSubmit = async () => {
        const success = await updateLogRetention(retention);

        if (success) {
            onClose(false);
        }
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            // resetFields={resetFields}
            onClose={onClose}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            buttonLabel={"Save Changes"}
            isLoading={loading}
        >
            <div className="w-full max-w-xl bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="mb-5">
                    {/* <h2 className="text-[15px] font-semibold tracking-tight text-gray-700">
                        Audit log retention
                    </h2> */}

                    <p className="text-sm leading-5 text-gray-500">
                        Choose how long your audit logs should remain available.
                    </p>
                </div>

                {/* Select */}
                <div>
                    <label
                        htmlFor="retention"
                        className="mb-2 block text-xs font-medium text-gray-700"
                    >
                        Automatically delete logs after
                    </label>

                    <div className="">
                        <select
                            id="retention"
                            value={retention}
                            onChange={(e) => setRetention(e.target.value)}
                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500
            "
                        >
                            {retentionOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Notice */}
                <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
                    <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M10.3 3.2 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>

                    <p className="text-xs leading-5 text-amber-800">
                        {retention === "never" ? (
                            <>
                                Audit logs will be kept indefinitely and will
                                not be automatically deleted.
                            </>
                        ) : (
                            <>
                                Logs older than{" "}
                                <span className="font-semibold">
                                    {selectedOption?.label}
                                </span>{" "}
                                will be automatically and permanently deleted.
                            </>
                        )}
                    </p>
                </div>
            </div>
        </InputModal>
    );
}
