import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUploadForm = ({ formData, updateFilesData }) => {
    // Initialize state for the formatted file objects
    const [files, setFiles] = useState(formData.uploaded_files || []);
    // Keep track of file previews separately for display purposes
    const [filePreviews, setFilePreviews] = useState([]);
    // Separate state for 2x2 picture
    const [pictureFile, setPictureFile] = useState(formData.picture_file || null);
    const [picturePreview, setPicturePreview] = useState(null);

    // Dropzone for 2X2 Picture (single image only)
    const { getRootProps: getPictureRootProps, getInputProps: getPictureInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.heic', '.heif']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                
                // Clean up previous preview
                if (picturePreview) {
                    URL.revokeObjectURL(picturePreview);
                }
                
                // Format the file
                const formattedFile = {
                    filename: file.name,
                    fileObj: file,
                };
                
                setPictureFile(formattedFile);
                
                // Create preview
                const preview = URL.createObjectURL(file);
                setPicturePreview({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: preview,
                });
            }
        },
    });

    // Dropzone for Other Requirements (multiple files)
    const { getRootProps: getOtherRootProps, getInputProps: getOtherInputProps } = useDropzone({
        accept: "image/*, .pdf, .doc, .docx",
        onDrop: (acceptedFiles) => {
            // Format the files with just the filename property
            const formattedFiles = acceptedFiles.map((file) => ({
                filename: file.name,
                // Keep the original file object for upload
                fileObj: file,
            }));

            // Update files state with the formatted objects
            setFiles([...files, ...formattedFiles]);

            // Create previews for display purposes
            const newPreviews = acceptedFiles.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file),
            }));

            setFilePreviews([...filePreviews, ...newPreviews]);
        },
    });

    // Use useCallback to prevent this from being recreated on every render
    const updateParentData = useCallback(() => {
        updateFilesData({
            uploaded_files: files,
            picture_file: pictureFile,
        });
    }, [files, pictureFile, updateFilesData]);

    // Update parent formData when files change
    useEffect(() => {
        updateParentData();
    }, [updateParentData]);

    // Clean up object URLs when component unmounts or files change
    useEffect(() => {
        return () => {
            filePreviews.forEach((filePreview) => {
                if (filePreview.preview) {
                    URL.revokeObjectURL(filePreview.preview);
                }
            });
            if (picturePreview && picturePreview.preview) {
                URL.revokeObjectURL(picturePreview.preview);
            }
        };
    }, [filePreviews, picturePreview]);

    const removeFile = (index) => {
        // Remove from previews
        setFilePreviews(filePreviews.filter((_, i) => i !== index));

        // Remove the actual file from files array
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const removePicture = () => {
        if (picturePreview && picturePreview.preview) {
            URL.revokeObjectURL(picturePreview.preview);
        }
        setPictureFile(null);
        setPicturePreview(null);
    };

    return (
        <>
            <h2 className="font-bold mb-4">2X2 Picture</h2>
            <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
                <div
                    {...getPictureRootProps()}
                    className="w-full p-2 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                >
                    <input {...getPictureInputProps()} />
                    <p className="text-gray-500">
                        {pictureFile ? 'Click to replace image' : 'Drag & drop your 2x2 picture here, or click to select'}
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-2 mx-auto text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4"
                        />
                    </svg>
                </div>

                {picturePreview && (
                    <div className="mt-4 w-full">
                        <div className="p-2 bg-white rounded-lg shadow flex justify-between items-center">
                            <img
                                src={picturePreview.preview}
                                alt={picturePreview.name}
                                className="w-12 h-12 object-cover rounded mr-2"
                            />
                            <span className="text-sm text-gray-700">
                                {picturePreview.name} (
                                {(picturePreview.size / 1024).toFixed(2)} KB)
                            </span>
                            <button
                                onClick={removePicture}
                                className="text-red-500 hover:text-red-700"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1 text-black"
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
                        </div>
                    </div>
                )}
            </div>

            <h2 className="font-bold mt-14 mb-4">Other Requirements</h2>
            <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
                <div
                    {...getOtherRootProps()}
                    className="w-full p-2 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                >
                    <input {...getOtherInputProps()} />
                    <p className="text-gray-500">
                        Drag & drop files here, or click to select
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-2 mx-auto text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4"
                        />
                    </svg>
                </div>

                {filePreviews.length > 0 && (
                    <ul className="mt-4 w-full text-sm text-gray-700">
                        {filePreviews.map((filePreview, index) => (
                            <li
                                key={index}
                                className="p-2 bg-white rounded-lg shadow mt-2 flex justify-between items-center"
                            >
                                {filePreview.type &&
                                    filePreview.type.startsWith("image/") && (
                                        <img
                                            src={filePreview.preview}
                                            alt={filePreview.name}
                                            className="w-12 h-12 object-cover rounded mr-2"
                                        />
                                    )}
                                <span>
                                    {filePreview.name} (
                                    {(filePreview.size / 1024).toFixed(2)} KB)
                                </span>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                    type="button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1 text-black"
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
            </div>
        </>
    );
};

export default FileUploadForm;

// import { useState, useEffect, useCallback } from "react";
// import { useDropzone } from "react-dropzone";

// const FileUploadForm = ({ formData, updateFilesData }) => {
//     // Initialize state for the formatted file objects
//     const [files, setFiles] = useState(formData.uploaded_files || []);
//     // Keep track of file previews separately for display purposes
//     const [filePreviews, setFilePreviews] = useState([]);

//     const { getRootProps, getInputProps } = useDropzone({
//         accept: "image/*, .pdf, .doc, .docx",
//         onDrop: (acceptedFiles) => {
//             // Format the files with just the filename property
//             const formattedFiles = acceptedFiles.map((file) => ({
//                 filename: file.name,
//                 // Keep the original file object for upload
//                 fileObj: file,
//             }));

//             // Update files state with the formatted objects
//             setFiles([...files, ...formattedFiles]);

//             // Create previews for display purposes
//             const newPreviews = acceptedFiles.map((file) => ({
//                 name: file.name,
//                 size: file.size,
//                 type: file.type,
//                 preview: URL.createObjectURL(file),
//             }));

//             setFilePreviews([...filePreviews, ...newPreviews]);
//         },
//     });

//     // Use useCallback to prevent this from being recreated on every render
//     const updateParentData = useCallback(() => {
//         updateFilesData({
//             uploaded_files: files,
//         });
//     }, [files, updateFilesData]);

//     // Update parent formData when files change
//     useEffect(() => {
//         updateParentData();
//     }, [updateParentData]);

//     // Clean up object URLs when component unmounts or files change
//     useEffect(() => {
//         return () => {
//             filePreviews.forEach((filePreview) => {
//                 if (filePreview.preview) {
//                     URL.revokeObjectURL(filePreview.preview);
//                 }
//             });
//         };
//     }, [filePreviews]);

//     const removeFile = (index) => {
//         // Remove from previews
//         setFilePreviews(filePreviews.filter((_, i) => i !== index));

//         // Remove the actual file from files array
//         const newFiles = [...files];
//         newFiles.splice(index, 1);
//         setFiles(newFiles);
//     };

//     return (
//         <>
//             <h2 className="font-bold mb-4">2X2 Picture</h2>
//             <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
//                 <div
//                     {...getRootProps()}
//                     className="w-full p-2 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
//                 >
//                     <input {...getInputProps()} />
//                     <p className="text-gray-500">
//                         Drag & drop file here, or click to select
//                     </p>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mt-2 mx-auto text-black"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4"
//                         />
//                     </svg>
//                 </div>

//                 {filePreviews.length > 0 && (
//                     <ul className="mt-4 w-full text-sm text-gray-700">
//                         {filePreviews.map((filePreview, index) => (
//                             <li
//                                 key={index}
//                                 className="p-2 bg-white rounded-lg shadow mt-2 flex justify-between items-center"
//                             >
//                                 {filePreview.type &&
//                                     filePreview.type.startsWith("image/") && (
//                                         <img
//                                             src={filePreview.preview}
//                                             alt={filePreview.name}
//                                             className="w-12 h-12 object-cover rounded mr-2"
//                                         />
//                                     )}
//                                 <span>
//                                     {filePreview.name} (
//                                     {(filePreview.size / 1024).toFixed(2)} KB)
//                                 </span>
//                                 <button
//                                     onClick={() => removeFile(index)}
//                                     className="text-red-500 hover:text-red-700"
//                                     type="button"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-4 w-4 mr-1 text-black"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor"
//                                         strokeWidth={2}
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M6 6l12 12M18 6l-12 12"
//                                         />
//                                     </svg>
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             <h2 className="font-bold mt-14 mb-4">Other Requirements</h2>
//             <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
//                 <div
//                     {...getRootProps()}
//                     className="w-full p-2 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
//                 >
//                     <input {...getInputProps()} />
//                     <p className="text-gray-500">
//                         Drag & drop files here, or click to select
//                     </p>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mt-2 mx-auto text-black"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4"
//                         />
//                     </svg>
//                 </div>

//                 {filePreviews.length > 0 && (
//                     <ul className="mt-4 w-full text-sm text-gray-700">
//                         {filePreviews.map((filePreview, index) => (
//                             <li
//                                 key={index}
//                                 className="p-2 bg-white rounded-lg shadow mt-2 flex justify-between items-center"
//                             >
//                                 {filePreview.type &&
//                                     filePreview.type.startsWith("image/") && (
//                                         <img
//                                             src={filePreview.preview}
//                                             alt={filePreview.name}
//                                             className="w-12 h-12 object-cover rounded mr-2"
//                                         />
//                                     )}
//                                 <span>
//                                     {filePreview.name} (
//                                     {(filePreview.size / 1024).toFixed(2)} KB)
//                                 </span>
//                                 <button
//                                     onClick={() => removeFile(index)}
//                                     className="text-red-500 hover:text-red-700"
//                                     type="button"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-4 w-4 mr-1 text-black"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor"
//                                         strokeWidth={2}
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M6 6l12 12M18 6l-12 12"
//                                         />
//                                     </svg>
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </>
//     );
// };

// export default FileUploadForm;
