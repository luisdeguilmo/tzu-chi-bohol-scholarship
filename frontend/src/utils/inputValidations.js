// Allow only letters, spaces, hyphens, apostrophes
export function lettersOnly(value) {
    return value.replace(/[^a-zA-Z\s'-]/g, "");
}

// Allow only numbers
export function numbersOnly(value) {
    return value.replace(/[^0-9]/g, "");
}

// Allow letters, numbers, spaces, hyphens
export function lettersNumbers(value) {
    return value.replace(/[^a-zA-Z0-9\s-]/g, "");
}
