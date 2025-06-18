export function formatDate(dateString) {
    if (!dateString) return false;
    
    const date = new Date(dateString);

    const hasTime = dateString.includes('T') || dateString.includes(' ');

    const options = {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
    };

    const localeString = date.toLocaleString('en-US', options);

    return localeString;
}
