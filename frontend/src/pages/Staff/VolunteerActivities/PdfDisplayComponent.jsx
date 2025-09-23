import React, { useState, useEffect } from "react";

const PdfDisplayComponent = () => {
    // Mock data - replace with your actual database data
    const [filePreviews, setFilePreviews] = useState([
        {
            id: 1,
            name: "Document1.pdf",
            type: "application/pdf",
            size: 2048000, // 2MB
            // This would be your database blob/base64 data
            data: null, // In real app, this would come from your database
            url: "http://localhost:8000/public/upload/activities/8979061/COA-Format (2) (1).pdf", // Sample PDF
        },
        {
            id: 3,
            name: "Image.jpg",
            type: "image/jpeg",
            size: 512000, // 512KB
            url: "http://localhost:8000/public/upload/activities/8979061/Screenshot (6).png",
        },
    ]);

    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isPdf = (type) => type === "application/pdf";
    const isImage = (type) => type && type.startsWith("image/");

    const removeFile = (index) => {
        setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const openPdfViewer = (filePreview) => {
        setSelectedPdf(filePreview);
    };

    const closePdfViewer = () => {
        setSelectedPdf(null);
    };

    // Function to convert database blob to URL (for when you have actual blob data)
    const createBlobUrl = (blobData, mimeType) => {
        if (!blobData) return null;
        const blob = new Blob([blobData], { type: mimeType });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
                File Previews from Database
            </h2>

            {filePreviews.length > 0 && (
                <ul className="my-1 w-full text-sm text-gray-700">
                    {filePreviews.map((filePreview, index) => (
                        <li
                            key={filePreview.id || index}
                            className="p-2 bg-gray-50 rounded-lg mt-2 flex justify-between text-xs items-center text-gray-500 border"
                        >
                            <div className="flex items-center flex-1">
                                {/* PDF Preview */}
                                {isPdf(filePreview.type) && (
                                    <div className="w-12 h-12 bg-red-100 rounded mr-2 flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                                        <svg
                                            onClick={() =>
                                                openPdfViewer(filePreview)
                                            }
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* Image Preview */}
                                {isImage(filePreview.type) && (
                                    <img
                                        src={filePreview.url}
                                        alt={filePreview.name}
                                        className="w-12 h-12 object-cover rounded mr-2"
                                    />
                                )}

                                <div className="flex-1">
                                    <div className="font-medium text-gray-700 flex items-center">
                                        {filePreview.name}
                                        {isPdf(filePreview.type) && (
                                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                PDF
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-500">
                                        {(filePreview.size / 1024).toFixed(2)}{" "}
                                        KB
                                    </div>
                                    {/* {isPdf(filePreview.type) && (
                                        <button
                                            onClick={() => openPdfViewer(filePreview)}
                                            className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                        >
                                            Click to view PDF
                                        </button>
                                    )} */}
                                    {isPdf(filePreview.type) && (
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    filePreview.url,
                                                    "_blank"
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                        >
                                            Click to view PDF
                                        </button>
                                    )}
                                    {isImage(filePreview.type) && (
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    filePreview.url,
                                                    "_blank"
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                        >
                                            Click to view image
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => removeFile(index)}
                                className="hover:text-red-700 text-red-500 p-1 ml-2"
                                type="button"
                                disabled={isSubmitting}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 6l12 12M18 6l-12 12"
                                    />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* PDF Viewer Modal */}
            {selectedPdf && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {selectedPdf.name}
                            </h3>
                            <button
                                onClick={closePdfViewer}
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

                        <div className="flex-1 p-4">
                            <iframe
                                src={selectedPdf.url}
                                className="w-full h-96 border rounded"
                                title={selectedPdf.name}
                            />
                        </div>

                        <div className="p-4 border-t flex justify-between">
                            <a
                                href={selectedPdf.url}
                                download={selectedPdf.name}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Download
                            </a>
                            <button
                                onClick={closePdfViewer}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfDisplayComponent;
