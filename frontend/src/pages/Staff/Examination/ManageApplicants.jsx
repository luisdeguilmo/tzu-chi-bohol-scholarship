import { Minus, Plus, UserMinus, UserPlus } from "lucide-react";
import { useBatch } from "../../../context/BatchContext";
import { useAssignBatch } from "../../../hooks/useAssignBatch";

const ManageApplicants = ({
    tab,
    selectedBatch,
    setSelectedBatch,
    batches,
    selectedApplicants,
    onRefresh,
}) => {
    const { setSelectedApplicants } = useBatch();
    const { assignStudents, unassignStudents } =
        useAssignBatch("batch-examination");

    const handleAssign = async () => {
        const success = assignStudents(selectedApplicants, selectedBatch);
        if (success) {
            await onRefresh(tab);
            setSelectedApplicants([]);
        }
    };

    const handleUnassign = async () => {
        const success = unassignStudents(selectedApplicants, selectedBatch);
        if (success) {
            await onRefresh(tab);
            setSelectedApplicants([]);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2">
                <p className="italic text-xs text-slate-500 mr-4">
                    With Selected:{" "}
                </p>
                {tab === "Applicants" ? (
                    <>
                        <select
                            className="px-3 py-1 text-xs border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                        >
                            {batches.map((batch, index) => (
                                <option key={index} value={batch.batch_name}>
                                    {batch.batch_name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssign}
                            title="Assign Selected Student/s"
                            disabled={selectedApplicants.length === 0}
                            className={`${selectedApplicants.length === 0 ? "bg-green-400" : "bg-green-600 hover:bg-green-700"} p-2 text-xs rounded-lg transition-colors flex items-center text-white`}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Assign
                        </button>
                    </>
                ) : tab === "Batches" ? (
                    <>
                        <button
                            onClick={handleUnassign}
                            title="Unassign Selected Student/s"
                            disabled={selectedApplicants.length === 0}
                            className={`${selectedApplicants.length === 0 ? "bg-red-400" : "bg-red-600 hover:bg-red-700"} p-2 text-xs rounded-lg transition-colors flex items-center text-white`}
                        >
                            <Minus className="w-3 h-4 mr-1" />
                            Unassign
                        </button>
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default ManageApplicants;
