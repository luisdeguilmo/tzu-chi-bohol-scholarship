export const getSchedule = (batches, selectedBatchInBatches) => {
    if (selectedBatchInBatches === "all") return false;

    const batch = batches.find(
        (batch) => batch.batch_name === selectedBatchInBatches
    );

    const datetimeString = batch.schedule; // Assuming format: "2025-05-22 11:51:21"
    if (!datetimeString) return false;

    const dateObj = new Date(datetimeString);

    // Format date: "January 20, 2026"
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Format time: "10:00 AM"
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return { date: formattedDate, time: formattedTime };
};
