export function formatTime(timeString) {
    if (!timeString) return false;

    // Combine with a dummy date (e.g., Jan 1, 1970)
    const date = new Date(`1970-01-01T${timeString}`);

    if (isNaN(date)) return false;

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // or false for 24-hour
    });
}
