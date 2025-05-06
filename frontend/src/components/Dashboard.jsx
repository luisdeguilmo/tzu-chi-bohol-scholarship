function QuickOverview({ overviewData }) {
    return (
        <div className="mr-auto w-full">
            {/* <h2 className="mb-6 font-semibold text-lg text-gray-800">Dashboard</h2> */}
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                {overviewData.map((item, index) => (
                    <div
                        key={index}
                        className={`flex p-8 rounded-md shadow-md relative ${item.color}`}
                    >
                        <div className="flex flex-col">
                            <h2 className="">{item.title}</h2>
                            <p className="mt-3 text-2xl font-bold">{item.status}</p>
                        </div>
                        <div className="flex items-center space-x-3 absolute top-2 right-2">
                            <span
                                className={`material-symbols-outlined text-2xl ${item.iconColor} ${item.iconBackground} px-3 py-2 rounded-full`}
                            >
                                {item.icon}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Dashboard({ overviewData }) {
    return <QuickOverview overviewData={overviewData} />;
}

export default Dashboard;
