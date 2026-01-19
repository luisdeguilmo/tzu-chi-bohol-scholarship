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
