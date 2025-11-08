// import { X } from "lucide-react";
// import { useBatches } from "../../../hooks/useBatches";

// const CreateBatchModal = ({ isOpen, batchName, onClose, onRefresh }) => {
//     const { batches, createBatch } = useBatches();

//     console.log(batches);

//     const handleCreateBatch = async () => {
//         await createBatch({
//             purpose: "orientation",
//             batch_name: batchName,
//         });
//         await onRefresh();
//         onClose(false);
//     };

//     return (
//         <div
//             className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200 ${
//                 isOpen ? "block" : "hidden"
//             }`}
//             // onKeyDown={handleKeyDown}
//             // onClick={handleBackdropClick}
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="modal-title"
//         >
//             <div className="relative scroll-smooth w-[70%] sm:w-[45%] md:w-[35%] lg:w-[25%] bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
//                 {/* Header */}
//                 <div className="relative px-6 py-4 border-b border-slate-200">
//                     <h2
//                         id="modal-title"
//                         className="text-lg text-slate-700 pr-10 leading-tight"
//                     >
//                         Create New Batch
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => onClose(false)}
//                         className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
//                         aria-label="Close modal"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="pt-2 pb-6 px-6">
//                     <label className="py-3 flex flex-col gap-[1px] text-gray-600 text-xs">
//                         Batch
//                         <input
//                             type="text"
//                             placeholder={"Enter passing score"}
//                             value={batchName}
//                             disabled
//                             required
//                             className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
//                         />
//                     </label>
//                     <button
//                         onClick={handleCreateBatch}
//                         type="button"
//                         className="w-full text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
//                     >
//                         Create Batch
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateBatchModal;

import { X } from "lucide-react";
import { useBatches } from "../../../hooks/useBatches";
import InputModal from "../../../components/InputModal";

const CreateBatchModal = ({ isOpen, batchName, onClose, onRefresh }) => {
    const { loading, createBatch } = useBatches();

    const handleCancel = () => {
        onClose(false);
    };

    const handleCreateBatch = async () => {
        await createBatch({
            purpose: "orientation",
            batch_name: batchName,
        });
        await onRefresh();
        onClose(false);
    };

    return (
        <InputModal
            label={"Create New Batch"}
            isOpen={isOpen}
            onClose={onClose}
            buttonLabel={"Confirm"}
            onCancel={handleCancel}
            onSubmit={handleCreateBatch}
            isLoading={loading}
        >
            {/* Content */}
            <div className="pt-2 pb-4 px-6">
                <label className="py-3 flex flex-col gap-[1px] text-gray-600 text-xs">
                    Batch Name
                    <input
                        type="text"
                        placeholder={"Enter batch"}
                        value={batchName}
                        disabled
                        required
                        className="w-full border border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </label>
            </div>
        </InputModal>
    );
};

export default CreateBatchModal;
