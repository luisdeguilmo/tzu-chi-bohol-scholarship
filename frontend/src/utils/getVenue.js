export const getVenue = (batches, selectedBatchInBatches) => {
    if (selectedBatchInBatches === "all") return false;

    const batch = batches.find(
        (batch) => batch.batch_name === selectedBatchInBatches
    );

    const venue = batch.venue;
    if (!venue) return false;

    return { venue };
};
