const TabNavigation = ({ tabs, handleTabChange, activeTab }) => {
    return (
        <div className="border-t border-gray-100">
            <div className="px-6 py-2 space-x-1.5 font-medium">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-2 rounded-lg text-xs md:text-sm transition-all duration-200 ${
                            activeTab === tab.value
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-transparent text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabNavigation;
