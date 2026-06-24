import { useRenderedHoursHistory } from "../hooks/useRenderedHoursHistory";
import { ArrowDownLeft, ArrowUpRight, X } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatMonth } from "../utils/formatMonth";
import { date } from "../utils/getDateAndTime";

function RenderedHoursHistory({ isOpen, onClose, label }) {
    const { isLoading: loading, renderedHoursHistory } =
        useRenderedHoursHistory();

    const handleClose = (e) => {
        e.preventDefault();
        onClose(false);
    };

    return (
        <>
            {isOpen && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-200 bg-opacity-30`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Modal Container */}
                    <div
                        className={`
                        max-h-[600px] relative bg-white shadow-2xl rounded-lg w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] transition-transform duration-300 flex flex-col h-[90vh]
                    `}
                    >
                        {/* Header */}
                        <div className="relative px-4 py-4 rounded-t-lg bg-gray-50 border-b flex-shrink-0">
                            <h2
                                id="modal-title"
                                className="text-sm font-medium text-slate-700 pr-10 leading-tight"
                            >
                                {label}
                            </h2>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="absolute top-2 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-200 active:ring-1 active:ring-gray-300 transition"
                                aria-label="Close modal"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* CONTENT */}
                        <div
                            className={`bg-white w-full ${
                                (loading ||
                                    Object.keys(renderedHoursHistory || {})
                                        .length === 0) &&
                                "h-full flex justify-center items-center"
                            } overflow-y-scroll rounded-lg`}
                        >
                            {loading ? (
                                <div className=" flex flex-col items-center gap-4">
                                    <div className="flex items-end gap-1 h-10">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 bg-emerald-500 rounded-full animate-bounce"
                                                style={{
                                                    height: "10px",
                                                    animationDelay: `${i * 100}ms`,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-sm text-slate-500">
                                        Loading history...
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {/* GROUPED BY MONTH */}
                                    {Object.entries(
                                        renderedHoursHistory || {},
                                    ).map(([month, items]) => (
                                        <div
                                            key={month}
                                            className="px-4 space-y-2"
                                        >
                                            {/* Month Label */}
                                            <div className="px-5 py-2.5 bg-green-600 border rounded-lg mt-2">
                                                <p className="text-xs font-semibold text-white">
                                                    {month}
                                                </p>
                                            </div>

                                            {/* Items */}
                                            {items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center rounded-lg justify-between px-5 py-3 bg-gray-50 hover:bg-gray-50 transition"
                                                >
                                                    {/* LEFT */}
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <h3 className="text-xs md:text-sm text-gray-700">
                                                                {item.source_type ===
                                                                "allowance"
                                                                    ? month +
                                                                      " Allowance"
                                                                    : item.event_name ||
                                                                      "--"}
                                                            </h3>

                                                            <div className="mt-1.5 flex items-center gap-1 text-[9px] md:text-[10px] text-gray-500">
                                                                {formatDate(
                                                                    item.created_at,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* RIGHT */}
                                                    <div className="text-right">
                                                        <p className="text-[13px] text-gray-800">
                                                            {item.transaction_type?.toLowerCase() ===
                                                            "add"
                                                                ? "+"
                                                                : item.transaction_type?.toLowerCase() ===
                                                                    "initial"
                                                                  ? ""
                                                                  : "-"}
                                                            {item.hours}{" "}
                                                            {item.hours > 1.9
                                                                ? "hrs"
                                                                : "hr"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* EMPTY STATE */}
                                    {Object.keys(renderedHoursHistory || {})
                                        .length === 0 && (
                                        <p className="p-10 text-center text-sm text-gray-400">
                                            No rendered hours history found.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RenderedHoursHistory;
