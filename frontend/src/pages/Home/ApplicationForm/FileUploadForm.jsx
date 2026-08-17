// import { Upload } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";
// import { useDropzone } from "react-dropzone";

// const FileUploadForm = ({ formData, updateFilesData }) => {
//     // Initialize state for the formatted file objects
//     const [files, setFiles] = useState(formData.uploaded_files || []);
//     // Keep track of file previews separately for display purposes
//     const [filePreviews, setFilePreviews] = useState([]);
//     // Separate state for 2x2 picture
//     const [pictureFile, setPictureFile] = useState(
//         formData.picture_file || null,
//     );
//     const [picturePreview, setPicturePreview] = useState(null);

//     useEffect(() => {
//         if (formData?.picture_file?.fileObj) {
//             const preview = URL.createObjectURL(formData.picture_file.fileObj);

//             setPicturePreview({
//                 // name: formData.picture_file.fileObj.name.replaceAll(" ", "_"),
//                 name: formData.picture_file.fileObj.name
//                     .replaceAll("(", "")
//                     .replaceAll(")", "")
//                     .replaceAll(" ", "_")
//                     .replaceAll("-", "_"),
//                 size: formData.picture_file.size,
//                 type: formData.picture_file.fileObj.type,
//                 preview: preview,
//             });
//         }

//         if (formData?.uploaded_files.length > 0) {
//             const newPrevious = [];

//             formData?.uploaded_files.forEach((item) => {
//                 const preview = URL.createObjectURL(item.fileObj);
//                 newPrevious.push({
//                     // name: item.fileObj.name.replaceAll(" ", "_"),
//                     name: item.fileObj.name
//                         .replaceAll("(", "")
//                         .replaceAll(")", "")
//                         .replaceAll(" ", "_")
//                         .replaceAll("-", "_"),
//                     size: item.fileObj.size,
//                     type: item.fileObj.type,
//                     preview: preview,
//                 });
//             });

//             setFilePreviews([...filePreviews, ...newPrevious]);
//         }
//     }, []);

//     // Dropzone for 2X2 Picture (single image only)
//     const {
//         getRootProps: getPictureRootProps,
//         getInputProps: getPictureInputProps,
//     } = useDropzone({
//         accept: {
//             "image/*": [
//                 ".jpeg",
//                 ".jpg",
//                 ".png",
//                 ".gif",
//                 ".bmp",
//                 ".webp",
//                 ".heic",
//                 ".heif",
//             ],
//         },
//         maxFiles: 1,
//         onDrop: (acceptedFiles) => {
//             if (acceptedFiles.length > 0) {
//                 const file = acceptedFiles[0];

//                 // Clean up previous preview
//                 if (picturePreview) {
//                     URL.revokeObjectURL(picturePreview);
//                 }

//                 // Format the file
//                 const formattedFile = {
//                     filename: file.name
//                         .replaceAll("(", "")
//                         .replaceAll(")", "")
//                         .replaceAll(" ", "_")
//                         .replaceAll("-", "_"),
//                     fileObj: file,
//                 };

//                 setPictureFile(formattedFile);

//                 // Create preview
//                 const preview = URL.createObjectURL(file);
//                 setPicturePreview({
//                     name: file.name
//                         .replaceAll("(", "")
//                         .replaceAll(")", "")
//                         .replaceAll(" ", "_")
//                         .replaceAll("-", "_"),
//                     size: file.size,
//                     type: file.type,
//                     preview: preview,
//                 });
//             }
//         },
//     });

//     // Dropzone for Other Requirements (multiple files)
//     const {
//         getRootProps: getOtherRootProps,
//         getInputProps: getOtherInputProps,
//     } = useDropzone({
//         // accept: "image/*, .pdf, .doc, .docx",
//         accept: "image/*",
//         onDrop: (acceptedFiles) => {
//             // Format the files with just the filename property
//             const formattedFiles = acceptedFiles.map((file) => ({
//                 filename: file.name
//                     .replaceAll("(", "")
//                     .replaceAll(")", "")
//                     .replaceAll(" ", "_")
//                     .replaceAll("-", "_"),
//                 // Keep the original file object for upload
//                 fileObj: file,
//             }));

//             // Update files state with the formatted objects
//             setFiles([...files, ...formattedFiles]);

//             // Create previews for display purposes
//             const newPreviews = acceptedFiles.map((file) => ({
//                 name: file.name
//                     .replaceAll("(", "")
//                     .replaceAll(")", "")
//                     .replaceAll(" ", "_")
//                     .replaceAll("-", "_"),
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
//             picture_file: pictureFile,
//         });
//     }, [files, pictureFile, updateFilesData]);

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
//             if (picturePreview && picturePreview.preview) {
//                 URL.revokeObjectURL(picturePreview.preview);
//             }
//         };
//     }, [filePreviews, picturePreview]);

//     const removeFile = (index) => {
//         // Remove from previews
//         setFilePreviews(filePreviews.filter((_, i) => i !== index));

//         // Remove the actual file from files array
//         const newFiles = [...files];
//         newFiles.splice(index, 1);
//         setFiles(newFiles);
//     };

//     const removePicture = () => {
//         if (picturePreview && picturePreview.preview) {
//             URL.revokeObjectURL(picturePreview.preview);
//         }
//         setPictureFile(null);
//         setPicturePreview(null);
//     };

//     return (
//         <>
//             <h2 className="font-bold text-sm text-gray-700 mt-6 mb-4">
//                 1x1 ID Photo with White Background{" "}
//                 <span className="text-xs font-normal text-gray-600">
//                     (Cropped to show your full face and shoulders, with your
//                     face clearly visible and centered.)
//                 </span>
//             </h2>

//             <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
//                 <div
//                     {...getPictureRootProps()}
//                     className="w-full p-4 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
//                 >
//                     <input
//                         {...getPictureInputProps()}
//                         disabled={formData.picture_file}
//                     />
//                     <p className="text-gray-500/90 text-xs">
//                         {pictureFile
//                             ? "Click to replace image"
//                             : "Drag & drop your 1x1 picture here, or click to select"}
//                     </p>
//                     <span className="w-[max-content] pt-3 block mx-auto">
//                         <Upload className="text-gray-500" />
//                     </span>
//                 </div>

//                 {picturePreview && (
//                     <div className="mt-2 w-full">
//                         <div className="p-2 bg-white rounded-lg shadow flex justify-between items-center">
//                             <img
//                                 src={picturePreview.preview}
//                                 alt={picturePreview.name}
//                                 className="w-12 h-12 object-cover rounded mr-2"
//                             />
//                             <span className="text-xs text-gray-700">
//                                 {picturePreview.name}
//                                 {/* (
//                                 {(picturePreview.size / 1024).toFixed(2)} KB) */}
//                             </span>
//                             <button
//                                 onClick={removePicture}
//                                 className="text-red-500 hover:text-red-700"
//                                 type="button"
//                             >
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4 mr-1 text-black"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                     strokeWidth={2}
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M6 6l12 12M18 6l-12 12"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <h2 className="font-bold text-sm text-gray-700 mt-14 mb-4">
//                 Other Requirements{" "}
//                 <span className="text-xs font-normal text-gray-600">
//                     (Make sure text is readable and not blurry or cut off.)
//                 </span>
//             </h2>
//             <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
//                 <div
//                     {...getOtherRootProps()}
//                     className="w-full p-4 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
//                 >
//                     <input {...getOtherInputProps()} />
//                     <p className="text-gray-500/90 text-xs">
//                         Drag & drop files here, or click to select
//                     </p>
//                     <span className="w-[max-content] pt-3 block mx-auto">
//                         <Upload className="text-gray-500" />
//                     </span>
//                 </div>

//                 {filePreviews.length > 0 && (
//                     <ul className="w-full text-sm text-gray-700">
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
//                                 <span className="text-xs text-gray-700">
//                                     {filePreview.name}
//                                     {/* (
//                                     {(filePreview.size / 1024).toFixed(2)} KB) */}
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

// import { Upload } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";
// import { useDropzone } from "react-dropzone";

// // Central place for the filename sanitization rule so it's applied
// // identically everywhere (display name, filename field, and the
// // actual File object used for upload).
// const sanitizeFileName = (name) =>
//     name
//         .replaceAll("(", "")
//         .replaceAll(")", "")
//         .replaceAll(" ", "_")
//         .replaceAll("-", "_");

// // Rebuilds a File object with a sanitized name so that if fileObj is
// // ever appended directly to FormData, the browser sends the sanitized
// // name instead of the original (unsanitized) one.
// const renameFile = (file) => {
//     const sanitizedName = sanitizeFileName(file.name);
//     return new File([file], sanitizedName, {
//         type: file.type,
//         lastModified: file.lastModified,
//     });
// };

// const FileUploadForm = ({ formData, updateFilesData }) => {
//     // Initialize state for the formatted file objects
//     const [files, setFiles] = useState(formData.uploaded_files || []);
//     // Keep track of file previews separately for display purposes
//     const [filePreviews, setFilePreviews] = useState([]);
//     // Separate state for 2x2 picture
//     const [pictureFile, setPictureFile] = useState(
//         formData.picture_file || null,
//     );
//     const [picturePreview, setPicturePreview] = useState(null);

//     useEffect(() => {
//         if (formData?.picture_file?.fileObj) {
//             const preview = URL.createObjectURL(formData.picture_file.fileObj);

//             setPicturePreview({
//                 name: sanitizeFileName(
//                     `${formData.personal_information.last_name}_${formData.personal_information.first_name}_1X1Photo.${formData.picture_file.fileObj.name.split(".").pop()}`,
//                 ),
//                 size: formData.picture_file.size,
//                 type: formData.picture_file.fileObj.type,
//                 preview: preview,
//             });
//         }

//         if (formData?.uploaded_files.length > 0) {
//             const newPrevious = [];

//             formData?.uploaded_files.forEach((item, index) => {
//                 const preview = URL.createObjectURL(item.fileObj);
//                 newPrevious.push({
//                     name: sanitizeFileName(
//                         `${formData.personal_information.last_name}_${formData.personal_information.first_name}_Other_${index+1}.${item.fileObj.name.split(".").pop()}`,
//                     ),
//                     size: item.fileObj.size,
//                     type: item.fileObj.type,
//                     preview: preview,
//                 });
//             });

//             setFilePreviews([...filePreviews, ...newPrevious]);
//         }
//     }, []);

//     // Dropzone for 2X2 Picture (single image only)
//     const {
//         getRootProps: getPictureRootProps,
//         getInputProps: getPictureInputProps,
//     } = useDropzone({
//         accept: {
//             "image/*": [".jpeg", ".jpg", ".png", ".heic", ".heif"],
//         },
//         maxFiles: 1,
//         onDrop: (acceptedFiles) => {
//             if (acceptedFiles.length > 0) {
//                 const rawFile = acceptedFiles[0];
//                 const file = renameFile(rawFile);

//                 // Clean up previous preview
//                 if (picturePreview) {
//                     URL.revokeObjectURL(picturePreview);
//                 }

//                 // Format the file
//                 const formattedFile = {
//                     filename: `${formData.personal_information.last_name}_${formData.personal_information.first_name}_1X1Photo.${file.name.split(".").pop()}`,
//                     fileObj: file,
//                 };

//                 setPictureFile(formattedFile);

//                 // Create preview
//                 const preview = URL.createObjectURL(file);
//                 setPicturePreview({
//                     name: `${formData.personal_information.last_name}_${formData.personal_information.first_name}_1X1Photo.${file.name.split(".").pop()}`,
//                     size: file.size,
//                     type: file.type,
//                     preview: preview,
//                 });
//             }
//         },
//     });

//     // Dropzone for Other Requirements (multiple files)
//     const {
//         getRootProps: getOtherRootProps,
//         getInputProps: getOtherInputProps,
//     } = useDropzone({
//         // accept: "image/*, .pdf, .doc, .docx",
//         accept: {
//             "image/*": [".jpeg", ".jpg", ".png", ".heic", ".heif"],
//         },
//         onDrop: (acceptedFiles) => {
//             const renamedFiles = acceptedFiles.map(renameFile);

//             // Format the files with just the filename property
//             const formattedFiles = renamedFiles.map((file, index) => ({
//                 filename: `${formData.personal_information.last_name}_${formData.personal_information.first_name}_Other_${index+1}.${file.name.split(".").pop()}`,
//                 // Keep the (renamed) file object for upload
//                 fileObj: file,
//             }));

//             // Update files state with the formatted objects
//             setFiles([...files, ...formattedFiles]);

//             // Create previews for display purposes
//             const newPreviews = renamedFiles.map((file, index) => ({
//                 name: `${formData.personal_information.last_name}_${formData.personal_information.first_name}_Other_${index+1}.${file.name.split(".").pop()}`,
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
//             picture_file: pictureFile,
//         });
//     }, [files, pictureFile, updateFilesData]);

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
//             if (picturePreview && picturePreview.preview) {
//                 URL.revokeObjectURL(picturePreview.preview);
//             }
//         };
//     }, [filePreviews, picturePreview]);

//     const removeFile = (index) => {
//         // Remove from previews
//         setFilePreviews(filePreviews.filter((_, i) => i !== index));

//         // Remove the actual file from files array
//         const newFiles = [...files];
//         newFiles.splice(index, 1);
//         setFiles(newFiles);
//     };

//     const removePicture = () => {
//         if (picturePreview && picturePreview.preview) {
//             URL.revokeObjectURL(picturePreview.preview);
//         }
//         setPictureFile(null);
//         setPicturePreview(null);
//     };

//     return (
//         <>
//             <h2 className="font-bold text-sm text-gray-700 mt-6 mb-4">
//                 1x1 ID Photo with White Background{" "}
//                 <span className="text-xs font-normal text-gray-600">
//                     (Cropped to show your full face and shoulders, with your
//                     face clearly visible and centered.)
//                 </span>
//             </h2>

//             <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
//                 <div
//                     {...getPictureRootProps()}
//                     className="w-full p-4 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
//                 >
//                     <input
//                         {...getPictureInputProps()}
//                         disabled={formData.picture_file}
//                     />
//                     <p className="text-gray-500/90 text-xs">
//                         Drag & drop your 1x1 picture here, or click to select
//                     </p>
//                     <span className="w-[max-content] pt-3 block mx-auto">
//                         <Upload className="text-gray-500" />
//                     </span>
//                 </div>
//             </div>

//             <div>
//                 {picturePreview && (
//                     <div className="mt-2 w-full">
//                         <div className="p-2 bg-white rounded-lg shadow flex justify-between items-center">
//                             <img
//                                 src={picturePreview.preview}
//                                 alt={picturePreview.name}
//                                 className="w-12 h-12 object-cover rounded mr-2"
//                             />
//                             <span className="text-xs text-gray-700">
//                                 {picturePreview.name}
//                             </span>
//                             <button
//                                 onClick={removePicture}
//                                 className="text-red-500 hover:text-red-700"
//                                 type="button"
//                             >
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4 mr-1 text-black"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                     strokeWidth={2}
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M6 6l12 12M18 6l-12 12"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <h2 className="font-bold text-sm text-gray-700 mt-14 mb-4">
//                 Other Requirements{" "}
//                 <span className="text-xs font-normal text-gray-600">
//                     (Make sure text is readable and not blurry or cut off.)
//                 </span>
//             </h2>
//             <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
//                 <div
//                     {...getOtherRootProps()}
//                     className="w-full p-4 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
//                 >
//                     <input {...getOtherInputProps()} />
//                     <p className="text-gray-500/90 text-xs">
//                         Drag & drop files here, or click to select
//                     </p>
//                     <span className="w-[max-content] pt-3 block mx-auto">
//                         <Upload className="text-gray-500" />
//                     </span>
//                 </div>
//             </div>

//             <div>
//                 {filePreviews.length > 0 && (
//                     <ul className="w-full text-sm text-gray-700">
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
//                                 <span className="text-xs text-gray-700">
//                                     {filePreview.name}
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


import { Upload } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

// Central place for the filename sanitization rule so it's applied
// identically everywhere (display name, filename field, and the
// actual File object used for upload).
const sanitizeFileName = (name) =>
    name
        .replaceAll("(", "")
        .replaceAll(")", "")
        .replaceAll(" ", "_")
        .replaceAll("-", "_");

// Rebuilds a File object using the given name. Callers pass in the
// final computed name (e.g. "Doe_John_1X1Photo.jpg") so that
// fileObj.name always matches the "filename" metadata field sent
// alongside it - no divergence between the multipart filename and
// the JSON filename field.
const renameFile = (file, newName) =>
    new File([file], newName, {
        type: file.type,
        lastModified: file.lastModified,
    });

// Keep limits in one place so both dropzones and the rejection
// messages stay consistent.
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = {
    "image/*": [".jpeg", ".jpg", ".png", ".heic", ".heif"],
};

const describeRejection = (rejection) => {
    const { errors } = rejection;
    if (errors.some((e) => e.code === "file-too-large")) {
        return `"${rejection.file.name}" is too large. Max size is ${
            MAX_FILE_SIZE_BYTES / (1024 * 1024)
        }MB.`;
    }
    if (errors.some((e) => e.code === "file-invalid-type")) {
        return `"${rejection.file.name}" is not an accepted file type.`;
    }
    return `"${rejection.file.name}" could not be added.`;
};

const isDuplicateFile = (candidate, existingFiles) =>
    existingFiles.some(
        (existing) =>
            existing.fileObj?.name === candidate.name &&
            existing.fileObj?.size === candidate.size,
    );

const FileUploadForm = ({ formData, updateFilesData }) => {
    // Initialize state for the formatted file objects
    const [files, setFiles] = useState(formData.uploaded_files || []);
    // Keep track of file previews separately for display purposes
    const [filePreviews, setFilePreviews] = useState([]);
    // Separate state for 2x2 picture
    const [pictureFile, setPictureFile] = useState(
        formData.picture_file || null,
    );
    const [picturePreview, setPicturePreview] = useState(null);

    useEffect(() => {
        if (formData?.picture_file?.fileObj) {
            const preview = URL.createObjectURL(formData.picture_file.fileObj);

            setPicturePreview({
                name: formData.picture_file.filename,
                size: formData.picture_file.fileObj.size,
                type: formData.picture_file.fileObj.type,
                preview: preview,
            });
        }

        if (formData?.uploaded_files?.length > 0) {
            const newPreviews = formData.uploaded_files.map((item) => ({
                name: item.filename,
                size: item.fileObj.size,
                type: item.fileObj.type,
                preview: URL.createObjectURL(item.fileObj),
            }));

            setFilePreviews((prev) => [...prev, ...newPreviews]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dropzone for 2X2 Picture (single image only)
    const {
        getRootProps: getPictureRootProps,
        getInputProps: getPictureInputProps,
    } = useDropzone({
        accept: ACCEPTED_IMAGE_TYPES,
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE_BYTES,
        disabled: !!pictureFile,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const rawFile = acceptedFiles[0];

                const computedName = sanitizeFileName(
                    `${formData.personal_information.last_name}_${formData.personal_information.first_name}_1X1Photo.${rawFile.name.split(".").pop()}`,
                );

                const file = renameFile(rawFile, computedName);

                // Clean up previous preview
                if (picturePreview?.preview) {
                    URL.revokeObjectURL(picturePreview.preview);
                }

                // Format the file - fileObj.name and filename now match exactly
                const formattedFile = {
                    filename: computedName,
                    fileObj: file,
                };

                setPictureFile(formattedFile);

                // Create preview
                const preview = URL.createObjectURL(file);
                setPicturePreview({
                    name: computedName,
                    size: file.size,
                    type: file.type,
                    preview: preview,
                });
            }
        },
        onDropRejected: (rejections) => {
            rejections.forEach((rejection) => {
                toast.error(describeRejection(rejection));
            });
        },
    });

    // Dropzone for Other Requirements (multiple files)
    const {
        getRootProps: getOtherRootProps,
        getInputProps: getOtherInputProps,
    } = useDropzone({
        accept: ACCEPTED_IMAGE_TYPES,
        maxSize: MAX_FILE_SIZE_BYTES,
        onDrop: (acceptedFiles) => {
            const uniqueFiles = acceptedFiles.filter(
                (file) => !isDuplicateFile(file, files),
            );

            const skippedCount = acceptedFiles.length - uniqueFiles.length;
            if (skippedCount > 0) {
                toast.error(
                    skippedCount === 1
                        ? "A file you dropped was already added and was skipped."
                        : `${skippedCount} files you dropped were already added and were skipped.`,
                );
            }

            if (uniqueFiles.length === 0) return;

            const startIndex = files.length;

            const renamedFiles = uniqueFiles.map((file, index) => {
                const computedName = sanitizeFileName(
                    `${formData.personal_information.last_name}_${formData.personal_information.first_name}_OtherDocument_${startIndex + index + 1}.${file.name.split(".").pop()}`,
                );
                return renameFile(file, computedName);
            });

            // Format the files - fileObj.name and filename now match exactly
            const formattedFiles = renamedFiles.map((file) => ({
                filename: file.name,
                fileObj: file,
            }));

            // Update files state with the formatted objects
            setFiles([...files, ...formattedFiles]);

            // Create previews for display purposes
            const newPreviews = renamedFiles.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file),
            }));

            setFilePreviews([...filePreviews, ...newPreviews]);
        },
        onDropRejected: (rejections) => {
            rejections.forEach((rejection) => {
                toast.error(describeRejection(rejection));
            });
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
        // Clean up the object URL before dropping the preview
        if (filePreviews[index]?.preview) {
            URL.revokeObjectURL(filePreviews[index].preview);
        }

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
            <h2 className="font-bold text-sm text-gray-700 mt-6 mb-4">
                1x1 ID Photo with White Background{" "}
                <span className="text-xs font-normal text-gray-600">
                    (Cropped to show your full face and shoulders, with your
                    face clearly visible and centered.)
                </span>
            </h2>

            <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
                <div
                    {...getPictureRootProps()}
                    className="w-full p-4 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                    aria-label="Upload 1x1 ID photo"
                >
                    <input {...getPictureInputProps()} />
                    <p className="text-gray-500/90 text-xs">
                        Drag & drop your 1x1 picture here, or click to select
                    </p>
                    <span className="w-[max-content] pt-3 block mx-auto">
                        <Upload className="text-gray-500" />
                    </span>
                </div>
            </div>

            <div>
                {picturePreview && (
                    <div className="mt-2 w-full">
                        <div className="p-2 bg-white rounded-lg shadow flex justify-between items-center">
                            <img
                                src={picturePreview.preview}
                                alt={picturePreview.name}
                                className="w-12 h-12 object-cover rounded mr-2"
                            />
                            <span className="text-xs text-gray-700">
                                {picturePreview.name}
                            </span>
                            <button
                                onClick={removePicture}
                                className="text-red-500 hover:text-red-700"
                                type="button"
                                aria-label="Remove 1x1 ID photo"
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

            <h2 className="font-bold text-sm text-gray-700 mt-14 mb-4">
                Other Documents{" "}
                <span className="text-xs font-normal text-gray-600">
                    (Make sure text is readable and not blurry or cut off.)
                </span>
            </h2>
            <div className="flex flex-col items-center border-2 border-dashed rounded-lg w-full">
                <div
                    {...getOtherRootProps()}
                    className="w-full p-4 text-center rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                    aria-label="Upload other requirement files"
                >
                    <input {...getOtherInputProps()} />
                    <p className="text-gray-500/90 text-xs">
                        Drag & drop files here, or click to select
                    </p>
                    <span className="w-[max-content] pt-3 block mx-auto">
                        <Upload className="text-gray-500" />
                    </span>
                </div>
            </div>

            <div>
                {filePreviews.length > 0 && (
                    <ul className="w-full text-sm text-gray-700">
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
                                <span className="text-xs text-gray-700">
                                    {filePreview.name}
                                </span>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                    type="button"
                                    aria-label={`Remove ${filePreview.name}`}
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