const FormModal = ({
    isOpen,
    setIsOpen,
    date,
    setDate,
    eventName,
    setEventName,
    handleFileChange,
    handleUpload,
    resetForm,
    fileNames,
    isUploading,
    files,
    
}) => {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Upload Certificate
                            </h3>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Date input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Event Name input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-500"
                                    placeholder="Enter event name"
                                    value={eventName}
                                    onChange={(e) =>
                                        setEventName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* File upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Certificate Document
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                ></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF, PNG, JPG, DOC, DOCX (MAX.
                                                10MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                            multiple
                                        />
                                    </label>
                                </div>

                                {/* Selected files display */}
                                {fileNames.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">
                                            Selected files ({fileNames.length}):
                                        </p>
                                        <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                                            {fileNames.map((name, index) => (
                                                <li
                                                    key={index}
                                                    className="truncate"
                                                >
                                                    {name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Upload progress */}
                            {isUploading && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-green-600 h-2.5 rounded-full"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        {uploadProgress}% uploaded
                                    </p>
                                </div>
                            )}

                            {/* Submit button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors ${
                                        isUploading ||
                                        !files.length ||
                                        !date ||
                                        !eventName
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    onClick={handleUpload}
                                    disabled={
                                        isUploading ||
                                        !files.length ||
                                        !date ||
                                        !eventName
                                    }
                                >
                                    {isUploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;
