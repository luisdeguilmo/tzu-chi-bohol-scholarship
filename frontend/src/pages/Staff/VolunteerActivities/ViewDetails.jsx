function ViewDetails({ isOpen, setIsOpen, onSuccess, scholar }) {
    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="py-4 pl-4 pr-3 fixed bottom-10 xl:right-28 right-14 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex justify-center items-center shadow-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,.2)] bg-opacity-50">
                    <div className="relative w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-md shadow-md overflow-hidden">
                        <div className="w-full px-8 pt-8 flex justify-between items-center">
                            <h2 className="text-2xl text-gray-600">
                                Add Activity
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 absolute top-4 right-5 font-thin text-gray-600 text-3xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 text-gray-600">
                            <p>{scholar.activity_name}</p>
                            <p>{scholar.activity_date}</p>
                            <p>{scholar.activity_time}</p>
                            <p>{scholar.activity_location}</p>
                            <p>{scholar.file_path}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewDetails;