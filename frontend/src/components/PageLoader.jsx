export default function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading...</p>
        </div>
    );
};
