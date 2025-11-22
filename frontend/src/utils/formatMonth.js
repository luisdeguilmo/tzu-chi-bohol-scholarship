// export function formatMonth(dateString) {
//     if (!dateString) return false;

//     const date = new Date(dateString);

//     const hasTime = dateString.includes("T") || dateString.includes(" ");

//     const options = {
//         month: "long",
//         year: "numeric",
//     };

//     const localeString = date.toLocaleString("en-US", options);

//     return localeString;
// }

export function formatMonth(dateString) {
    if (!dateString) return false;

    // Slice to ensure we only have "YYYY-MM"
    const cleanDate = dateString.slice(0, 7);

    const [year, month] = cleanDate.split("-").map(Number);
    if (!year || !month) return false;

    const date = new Date(year, month - 1);

    return date.toLocaleString("en-US", { month: "long" });
}
