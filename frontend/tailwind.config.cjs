module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Adjust if you’re using React or other frameworks
    ],
    theme: {
        extend: {
            colors: {
                primary: "#22C55E", // Green-500 (Accent Color)
                primaryHover: "#16A34A", // Green-600 (Hover)
                background: "#FFFFFF", // White (Main Background)
                sidebar: "#F3F4F6", // Gray-100 (Sidebar & Cards)
                textPrimary: "#1F2937", // Gray-800 (Main Text)
                textSecondary: "#6B7280", // Gray-500 (Muted Text, Labels)
                border: "#E5E7EB", // Gray-300 (Dividers, Borders)
            },
        },
    },
    plugins: [],
};
