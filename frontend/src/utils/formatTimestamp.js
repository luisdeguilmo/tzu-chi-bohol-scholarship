export function formatTimestamp(input) {
    const date = new Date(input);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (diffMs < oneDayMs) {
        return date
            .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            .replace(" ", " ");
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
