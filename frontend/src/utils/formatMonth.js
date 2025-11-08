export function formatMonth(dateString) {
    if (!dateString) return false;

    const date = new Date(dateString);

    const hasTime = dateString.includes("T") || dateString.includes(" ");

    const options = {
        month: "long",
        year: "numeric",
    };

    const localeString = date.toLocaleString("en-US", options);

    return localeString;
}
