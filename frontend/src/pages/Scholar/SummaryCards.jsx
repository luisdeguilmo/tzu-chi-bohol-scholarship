const SummaryCards = ({ overviewData }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
            {overviewData.map((item, index) => (
                <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-xs md:text-sm">
                            {item.label}
                        </span>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            {item.icon}
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {item.status}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
