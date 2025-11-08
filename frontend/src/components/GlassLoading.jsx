const GlassLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-lg z-50">
            <div className="relative flex flex-col items-center">
                <div className="absolute w-32 h-32 bg-blue-500/30 blur-3xl rounded-full animate-pulse"></div>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
                <p className="mt-4 text-gray-700 font-medium">
                    Loading scholars...
                </p>
            </div>
        </div>
    );
};

export default GlassLoading;
