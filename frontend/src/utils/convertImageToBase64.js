export const convertImageToBase64 = async (image) => {
    try {
        const response = await fetch(image);
        if (!response.ok) {
            throw new Error(`Failed to fetch logo: ${response.status}`);
        }
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error converting logo to base64:", error);
        return null;
    }
};
