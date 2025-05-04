export function formatDateTime(dateString) {
    const date = new Date(dateString);

    const hasTime = dateString.includes('T') || dateString.includes(' ');

    const options = {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        ...(hasTime && {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    };

    const localeString = date.toLocaleString('en-US', options);
    const parts = localeString.split(', ').filter(Boolean);

    // If time exists, return with dot separator
    if (parts.length > 1) {
        return `${parts[0]}, ${parts[1]}`;
    }

    // Otherwise, return date only
    return parts[0];
}
