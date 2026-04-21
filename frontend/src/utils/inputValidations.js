// Allow only letters, spaces, hyphens, apostrophes
export function lettersOnly(value) {
    return value.replace(/[^a-zA-Z\s'-,.]/g, "");
}

// Allow only numbers
export function numbersOnly(value) {
    return value.replace(/[^0-9\s.,]/g, "");
}

// Allow letters, numbers, spaces, hyphens
export function lettersNumbers(value) {
    return value.replace(/[^a-zA-Z0-9\s'-,]/g, "");
}

export function isValidContactNumber(value) {
    return /^09\d{9}$/.test(value);
}

export function validateSchoolYear(value) {
    const currentYear = new Date().getFullYear();

    // Allow only digits and dash
    value = value.replace(/[^0-9-]/g, "");

    let parts = value.split("-");

    // Prevent more than one dash
    if (parts.length > 2) {
        parts = [parts[0], parts[1]];
    }

    // ---- FIRST YEAR ----
    if (parts[0]) {
        // Must start with 2
        if (parts[0][0] !== "2") {
            parts[0] = "2";
        }

        // Limit to 4 digits
        parts[0] = parts[0].slice(0, 4);
    }

    // 🚫 BLOCK DASH if first year is incomplete
    if (parts[0].length < 4) {
        return parts[0]; // Ignore everything after
    }

    // ---- SECOND YEAR ----
    if (parts[1] !== undefined) {
        // Must start with 2
        if (parts[1].length > 0 && parts[1][0] !== "2") {
            parts[1] = "2";
        }

        // Limit to 4 digits
        parts[1] = parts[1].slice(0, 4);
    }

    // Rebuild value
    value = parts.join("-");

    // ---- FINAL VALIDATION WHEN COMPLETE ----
    if (parts[0].length === 4 && parts[1]?.length === 4) {
        const startYear = parseInt(parts[0], 10);
        const endYear = parseInt(parts[1], 10);

        // Rule 1: Must be consecutive
        if (endYear !== startYear + 1) {
            return `${startYear}-`; // force correction
        }

        // Rule 2: Allow only realistic range
        // Example: allow currentYear-1 to currentYear+2
        if (startYear < currentYear - 1 || startYear > currentYear + 1) {
            return ""; // or reset to empty
        }
    }

    return value.slice(0, 9);
}
