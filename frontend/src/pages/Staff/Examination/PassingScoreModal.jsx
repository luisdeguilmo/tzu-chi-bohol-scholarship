import { X } from "lucide-react";
import { useSettings } from "../../../hooks/useSettings";
import { useEffect, useState } from "react";

const PassingScoreModal = ({
    passingScore,
    onSetPassingScore,
    isOpen,
    onClose,
    onRefresh,
}) => {
    const [newPassingScore, setNewPassingScore] = useState(0);

    useEffect(() => {
        setNewPassingScore(passingScore);
    }, [passingScore]);

    const handleCreatePassingScore = async () => {
        await onSetPassingScore(newPassingScore);
        await onRefresh();
        onClose(false);
    };

    return (
        <div
            className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200 ${
                isOpen ? "block" : "hidden"
            }`}
            // onKeyDown={handleKeyDown}
            // onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="relative scroll-smooth w-[70%] sm:w-[45%] md:w-[35%] lg:w-[25%] bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="relative px-6 py-4 border-b border-slate-200">
                    <h2
                        id="modal-title"
                        className="text-lg text-slate-700 pr-10 leading-tight"
                    >
                        Passing Score
                    </h2>
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="pt-2 pb-6 px-6">
                    <label className="py-3 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Passing Score
                        <input
                            type="number"
                            placeholder={"Enter passing score"}
                            min={0}
                            value={newPassingScore}
                            required
                            onChange={(e) => setNewPassingScore(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>
                    <button
                        onClick={handleCreatePassingScore}
                        type="button"
                        className="w-full text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PassingScoreModal;
