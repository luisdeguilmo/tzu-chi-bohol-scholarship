// import axios from "axios";
// import { useState } from "react";
// import { useDropzone } from "react-dropzone";

// function DocumentForm({ isOpen, setIsOpen, onSuccess }) {
//     const [activityName, setActivityName] = useState("");
//     const [activityDate, setActivityDate] = useState("");
//     const [activityTime, setActivityTime] = useState("");
//     const [file, setFile] = useState([]);

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
//             setFile([...file, ...formattedFiles]);

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

//     const removeFile = (index) => {
//         // Remove from previews
//         setFilePreviews(filePreviews.filter((_, i) => i !== index));

//         // Remove the actual file from files array
//         const newFiles = [...file];
//         newFiles.splice(index, 1);
//         setFile(newFiles);
//     };

//     const handleChange = (setValue, value) => {
//         setValue(value);
//     };

//     const handleCancel = (e) => {
//         e.preventDefault(); // Prevent form submission
//         setIsOpen(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const data = {
//             activity: {
//                 activity_name: activityName,
//                 activity_date: activityDate,
//                 activity_time: activityTime
//             }
//         };

//         try {
//             const response = await fetch("http://localhost:8000/app/views/events.php", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type" : "application/json"
//                 },
//                 body: JSON.stringify(data)
//             });

//             const result = await response.json(); // Parse as JSON instead of text

//             if (result.success) {
//                 toast.success(result.message + ".");
//                 setActivityName("");
//                 setActivityDate("");
//                 setActivityTime("");
//             } else {
//                 alert("Error: " + result.message);
//             }
//             if (onSuccess) onSuccess();
//         } catch (error) {
//             console.error("Submission error:", error);
//             alert("Failed to submit the form. Please try again.");
//         }
//     };

//     return (
//         <div>
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className="py-4 pl-4 pr-3 fixed bottom-10 xl:right-28 right-14 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex justify-center items-center shadow-lg"
//             >
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                     />
//                 </svg>
//                 {/* <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                     />
//                 </svg> */}
//             </button>

//             {isOpen && (
//                 <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,.2)] bg-opacity-50">
//                     <div className="relative w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-md shadow-md overflow-hidden">
//                         <div className="w-full px-8 pt-8 flex justify-between items-center">
//                             <h2 className="text-2xl text-gray-600">
//                                 Add Activity
//                             </h2>
//                             <button
//                                 type="button"
//                                 onClick={() => setIsOpen(false)}
//                                 className="px-4 py-2 absolute top-4 right-5 font-thin text-gray-600 text-3xl"
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         {/* <div
//                             className={`${file.length === 0 ? "my-14" : ""}`}
//                         ></div> */}

//                         <form onSubmit={handleSubmit} className="px-8 pb-8">
//                             <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                 Activity Name
//                                 <input
//                                     type="text"
//                                     required
//                                     value={activityName}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             setActivityName,
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter activity name"
//                                     className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </label>
//                             <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                 Date
//                                 <input
//                                     type="date"
//                                     required
//                                     value={activityDate}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             setActivityDate,
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter activity name"
//                                     className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </label>
//                             <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                 Time
//                                 <input
//                                     type="time"
//                                     required
//                                     value={activityTime}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             setActivityTime,
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter activity name"
//                                     className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </label>
//                             {/* Form Inputs */}
//                             <div className="">
//                                 <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                     Certificate of Appearance
//                                     <div className="p-2 flex justify-center gap-[1px] text-gray-600 text-sm rounded-lg border-2 border-dashed border-gray-300">
//                                         <input {...getInputProps()} />
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-5 w-5 mr-1"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                                             />
//                                         </svg>
//                                         Add File
//                                     </div>
//                                 </label>
//                                 {filePreviews.length > 0 && (
//                                     <ul className="my-1 w-full text-sm text-gray-700">
//                                         {filePreviews.map(
//                                             (filePreview, index) => (
//                                                 <li
//                                                     key={index}
//                                                     className="p-2 bg-white rounded-lg mt-2 flex justify-between text-xs items-center text-gray-500"
//                                                 >
//                                                     {filePreview.type &&
//                                                         filePreview.type.startsWith(
//                                                             "image/"
//                                                         ) && (
//                                                             <img
//                                                                 src={
//                                                                     filePreview.preview
//                                                                 }
//                                                                 alt={
//                                                                     filePreview.name
//                                                                 }
//                                                                 className="w-12 h-12 object-cover rounded mr-2"
//                                                             />
//                                                         )}
//                                                     <span>
//                                                         {filePreview.name}
//                                                         {/* (
//                                                         {(
//                                                             filePreview.size /
//                                                             1024
//                                                         ).toFixed(2)}{" "}
//                                                         KB) */}
//                                                     </span>
//                                                     <button
//                                                         onClick={() =>
//                                                             removeFile(index)
//                                                         }
//                                                         className="hover:text-red-700 text-gray-50"
//                                                         type="button"
//                                                     >
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             className="h-4 w-4 mr-1 text-black"
//                                                             fill="none"
//                                                             viewBox="0 0 24 24"
//                                                             stroke="currentColor"
//                                                             strokeWidth={2}
//                                                         >
//                                                             <path
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                                 d="M6 6l12 12M18 6l-12 12"
//                                                             />
//                                                         </svg>
//                                                     </button>
//                                                 </li>
//                                             )
//                                         )}
//                                     </ul>
//                                 )}
//                                 <button
//                                     type="button"
//                                     className={`w-full bg-green-500 text-white mt-1 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors `}
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DocumentForm;

// import axios from "axios";
// import { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { toast } from "react-toastify"; // Import toast

// function DocumentForm({ isOpen, setIsOpen, onSuccess }) {
//     const [activityName, setActivityName] = useState("");
//     const [activityDate, setActivityDate] = useState("");
//     const [activityTime, setActivityTime] = useState("");
//     const [files, setFiles] = useState([]);
//     const [filePreviews, setFilePreviews] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const { getRootProps, getInputProps } = useDropzone({
//         accept: {
//             'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
//             'application/pdf': ['.pdf'],
//             'application/msword': ['.doc'],
//             'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
//         },
//         onDrop: (acceptedFiles) => {
//             // Add new files to existing files
//             setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);

//             // Create previews for display purposes
//             const newPreviews = acceptedFiles.map((file) => ({
//                 name: file.name,
//                 size: file.size,
//                 type: file.type,
//                 preview: URL.createObjectURL(file),
//             }));

//             setFilePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
//         },
//     });

//     const removeFile = (index) => {
//         // Remove from previews and revoke object URL to prevent memory leaks
//         const newPreviews = [...filePreviews];
//         URL.revokeObjectURL(newPreviews[index].preview);
//         newPreviews.splice(index, 1);
//         setFilePreviews(newPreviews);

//         // Remove the actual file from files array
//         const newFiles = [...files];
//         newFiles.splice(index, 1);
//         setFiles(newFiles);
//     };

//     const handleChange = (setValue, value) => {
//         setValue(value);
//     };

//     const handleCancel = (e) => {
//         e.preventDefault();
//         // Clean up object URLs
//         filePreviews.forEach(preview => {
//             if (preview.preview) {
//                 URL.revokeObjectURL(preview.preview);
//             }
//         });

//         // Reset form
//         resetForm();
//         setIsOpen(false);
//     };

//     const resetForm = () => {
//         setActivityName("");
//         setActivityDate("");
//         setActivityTime("");
//         setFiles([]);
//         setFilePreviews([]);
//     };

//     const convertFileToBase64 = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => {
//                 // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
//                 const base64String = reader.result.split(',')[1];
//                 resolve(base64String);
//             };
//             reader.onerror = error => reject(error);
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         try {
//             // Prepare activity data
//             const activityData = {
//                 activity: {
//                     application_id: 10002, // Assuming application_id is not needed for this form
//                     activity_name: activityName,
//                     activity_date: activityDate,
//                     activity_time: activityTime
//                 }
//             };

//             // If there are files, convert them to base64 and add to the data
//             if (files.length > 0) {
//                 const uploadedFiles = [];

//                 for (const file of files) {
//                     try {
//                         const base64Data = await convertFileToBase64(file);
//                         uploadedFiles.push({
//                             filename: file.name,
//                             base64_data: base64Data,
//                             file_type: file.type,
//                             file_size: file.size
//                         });
//                     } catch (error) {
//                         console.error('Error converting file to base64:', error);
//                         toast.error(`Failed to process file: ${file.name}`);
//                         setIsSubmitting(false);
//                         return;
//                     }
//                 }

//                 activityData.uploaded_files = uploadedFiles;
//             }

//             // Submit the data
//             const response = await fetch("http://localhost:8000/app/views/activities.php", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(activityData)
//             });

//             // Check if response is ok
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             console.log(activityData);
//             const result = await response.json();

//             if (result.success) {
//                 toast.success(result.message + ".");

//                 // Clean up object URLs
//                 filePreviews.forEach(preview => {
//                     if (preview.preview) {
//                         URL.revokeObjectURL(preview.preview);
//                     }
//                 });

//                 // Reset form
//                 resetForm();
//                 setIsOpen(false);

//                 // Call success callback
//                 if (onSuccess) onSuccess();
//             } else {
//                 toast.error("Error: " + result.message);
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             toast.error("Failed to submit the form. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div>
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className="py-4 pl-4 pr-3 fixed bottom-10 xl:right-28 right-14 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex justify-center items-center shadow-lg"
//             >
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                     />
//                 </svg>
//             </button>

//             {isOpen && (
//                 <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,.2)] bg-opacity-50">
//                     <div className="relative w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-md shadow-md overflow-hidden">
//                         <div className="w-full px-8 pt-8 flex justify-between items-center">
//                             <h2 className="text-2xl text-gray-600">
//                                 Add Activity
//                             </h2>
//                             <button
//                                 type="button"
//                                 onClick={() => setIsOpen(false)}
//                                 className="px-4 py-2 absolute top-4 right-5 font-thin text-gray-600 text-3xl"
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="px-8 pb-8">
//                             <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                 Activity Name
//                                 <input
//                                     type="text"
//                                     required
//                                     value={activityName}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             setActivityName,
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter activity name"
//                                     className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </label>
//                             <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                 Date
//                                 <input
//                                     type="date"
//                                     required
//                                     value={activityDate}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             setActivityDate,
//                                             e.target.value
//                                         )
//                                     }
//                                     className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </label>
//                             <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                 Time
//                                 <input
//                                     type="time"
//                                     required
//                                     value={activityTime}
//                                     onChange={(e) =>
//                                         handleChange(
//                                             setActivityTime,
//                                             e.target.value
//                                         )
//                                     }
//                                     className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </label>

//                             <div className="">
//                                 <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
//                                     Certificate of Appearance
//                                     <div
//                                         {...getRootProps()}
//                                         className="p-2 flex justify-center gap-[1px] text-gray-600 text-sm rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
//                                     >
//                                         <input {...getInputProps()} />
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-5 w-5 mr-1"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                                             />
//                                         </svg>
//                                         Add File
//                                     </div>
//                                 </label>

//                                 {filePreviews.length > 0 && (
//                                     <ul className="my-1 w-full text-sm text-gray-700">
//                                         {filePreviews.map(
//                                             (filePreview, index) => (
//                                                 <li
//                                                     key={index}
//                                                     className="p-2 bg-gray-50 rounded-lg mt-2 flex justify-between text-xs items-center text-gray-500 border"
//                                                 >
//                                                     <div className="flex items-center">
//                                                         {filePreview.type &&
//                                                             filePreview.type.startsWith(
//                                                                 "image/"
//                                                             ) && (
//                                                                 <img
//                                                                     src={
//                                                                         filePreview.preview
//                                                                     }
//                                                                     alt={
//                                                                         filePreview.name
//                                                                     }
//                                                                     className="w-12 h-12 object-cover rounded mr-2"
//                                                                 />
//                                                             )}
//                                                         <div>
//                                                             <div className="font-medium text-gray-700">
//                                                                 {filePreview.name}
//                                                             </div>
//                                                             <div className="text-gray-500">
//                                                                 {(filePreview.size / 1024).toFixed(2)} KB
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <button
//                                                         onClick={() =>
//                                                             removeFile(index)
//                                                         }
//                                                         className="hover:text-red-700 text-red-500 p-1"
//                                                         type="button"
//                                                     >
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             className="h-4 w-4"
//                                                             fill="none"
//                                                             viewBox="0 0 24 24"
//                                                             stroke="currentColor"
//                                                             strokeWidth={2}
//                                                         >
//                                                             <path
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                                 d="M6 6l12 12M18 6l-12 12"
//                                                             />
//                                                         </svg>
//                                                     </button>
//                                                 </li>
//                                             )
//                                         )}
//                                     </ul>
//                                 )}

//                                 <div className="flex gap-2 mt-4">
//                                     <button
//                                         type="button"
//                                         onClick={handleCancel}
//                                         className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//                                         disabled={isSubmitting}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={isSubmitting}
//                                         className={`flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors ${
//                                             isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                                         }`}
//                                     >
//                                         {isSubmitting ? 'Submitting...' : 'Submit'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DocumentForm;

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import InputModal from "../../../components/InputModal";
import BASE_URL from "../../../config";

function ActivityFormModal({ isOpen, setIsOpen, onSuccess }) {
    const [activityName, setActivityName] = useState("");
    const [activityLocation, setActivityLocation] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [conversionStatus, setConversionStatus] = useState({});
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    console.log(files);

    // Move this to environment variables or server-side
    const CLOUDCONVERT_API_KEY =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTIyMmViOTZjYTQzZTMyZWM0YTliYTdiOTNkODFhNTBmZDZkYTFmNjUzNzdiMTRkODhjMzVkM2JhM2U1NzEyNDM3MmM4MDYwYjhkZThhMjkiLCJpYXQiOjE3NTAzMjA3NzQuOTAzMzE1LCJuYmYiOjE3NTAzMjA3NzQuOTAzMzE2LCJleHAiOjQ5MDU5OTQzNzQuODk3ODAzLCJzdWIiOiI3MjI0MzYxOCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwid2ViaG9vay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.";

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
            isConverting: false,
            originalFile: file,
        }));

        setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleAddFileClick = () => {
        fileInputRef.current?.click();
    };

    const removeFile = (index) => {
        const newPreviews = [...filePreviews];
        if (newPreviews[index]?.preview) {
            URL.revokeObjectURL(newPreviews[index].preview);
        }
        newPreviews.splice(index, 1);
        setFilePreviews(newPreviews);

        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        setConversionStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[index];
            return newStatus;
        });
    };

    const handleChange = (setValue, value) => {
        setValue(value);
    };

    const handleCancel = (e) => {
        e.preventDefault();

        // Clean up object URLs
        filePreviews.forEach((preview) => {
            if (preview.preview) {
                URL.revokeObjectURL(preview.preview);
            }
        });

        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        setActivityName("");
        setActivityLocation("");
        setActivityDate("");
        setStartTime("");
        setEndTime("");
        setFiles([]);
        setFilePreviews([]);
        setConversionStatus({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const convertDocToPdf = async (file, fileIndex) => {
        if (!CLOUDCONVERT_API_KEY) {
            throw new Error("CloudConvert API key not configured");
        }

        try {
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: {
                    status: "uploading",
                    message: "Uploading file...",
                },
            }));

            // Create a job
            const jobResponse = await fetch(
                "https://api.cloudconvert.com/v2/jobs",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tasks: {
                            "upload-file": {
                                operation: "import/upload",
                            },
                            "convert-file": {
                                operation: "convert",
                                input: "upload-file",
                                output_format: "pdf",
                            },
                            "export-file": {
                                operation: "export/url",
                                input: "convert-file",
                            },
                        },
                    }),
                }
            );

            if (!jobResponse.ok) {
                throw new Error(`HTTP error! status: ${jobResponse.status}`);
            }

            const job = await jobResponse.json();
            const uploadTask = job.data.tasks.find(
                (task) => task.name === "upload-file"
            );

            // Upload the file
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: {
                    status: "uploading",
                    message: "Uploading to CloudConvert...",
                },
            }));

            const formData = new FormData();
            Object.keys(uploadTask.result.form.parameters).forEach((key) => {
                formData.append(key, uploadTask.result.form.parameters[key]);
            });
            formData.append("file", file);

            const uploadResponse = await fetch(uploadTask.result.form.url, {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(
                    `Upload failed! status: ${uploadResponse.status}`
                );
            }

            // Wait for conversion to complete
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: {
                    status: "converting",
                    message: "Converting to PDF...",
                },
            }));

            let jobStatus;
            do {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const statusResponse = await fetch(
                    `https://api.cloudconvert.com/v2/jobs/${job.data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
                        },
                    }
                );

                if (!statusResponse.ok) {
                    throw new Error(
                        `Status check failed! status: ${statusResponse.status}`
                    );
                }

                jobStatus = await statusResponse.json();
            } while (
                jobStatus.data.status === "waiting" ||
                jobStatus.data.status === "processing"
            );

            if (jobStatus.data.status === "finished") {
                const exportTask = jobStatus.data.tasks.find(
                    (task) => task.name === "export-file"
                );
                const downloadUrl = exportTask.result.files[0].url;

                setConversionStatus((prev) => ({
                    ...prev,
                    [fileIndex]: {
                        status: "downloading",
                        message: "Downloading converted PDF...",
                    },
                }));

                const pdfResponse = await fetch(downloadUrl);
                if (!pdfResponse.ok) {
                    throw new Error(
                        `Download failed! status: ${pdfResponse.status}`
                    );
                }

                const pdfBlob = await pdfResponse.blob();
                const pdfFile = new File(
                    [pdfBlob],
                    file.name.replace(/\.(doc|docx)$/i, ".pdf"),
                    { type: "application/pdf" }
                );

                setConversionStatus((prev) => ({
                    ...prev,
                    [fileIndex]: {
                        status: "completed",
                        message: "Conversion completed!",
                    },
                }));

                return pdfFile;
            } else {
                throw new Error(`Conversion failed: ${jobStatus.data.status}`);
            }
        } catch (error) {
            console.error("CloudConvert error:", error);
            setConversionStatus((prev) => ({
                ...prev,
                [fileIndex]: { status: "error", message: "Conversion failed" },
            }));
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate time inputs
            if (startTime >= endTime) {
                toast.error("Start time must be before end time");
                setIsSubmitting(false);
                return;
            }

            const activityData = {
                activity: {
                    application_id: user?.user_id,
                    activity_name: activityName,
                    activity_location: activityLocation,
                    activity_date: activityDate,
                    start_time: startTime,
                    end_time: endTime,
                    activity_status: "Pending",
                },
            };

            // Process files
            if (files.length > 0) {
                const uploadedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    let processedFile = file;

                    try {
                        // Check if file is DOC or DOCX and convert to PDF
                        if (
                            file.type === "application/msword" ||
                            file.type ===
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                            toast.info(`Converting ${file.name} to PDF...`);
                            processedFile = await convertDocToPdf(file, i);

                            // Update the file preview
                            setFilePreviews((prev) => {
                                const newPreviews = [...prev];
                                if (newPreviews[i]) {
                                    newPreviews[i] = {
                                        ...newPreviews[i],
                                        name: processedFile.name,
                                        type: processedFile.type,
                                        size: processedFile.size,
                                    };
                                }
                                return newPreviews;
                            });
                        }

                        const base64Data =
                            await convertFileToBase64(processedFile);
                        uploadedFiles.push({
                            filename: processedFile.name,
                            base64_data: base64Data,
                            file_type: processedFile.type,
                            file_size: processedFile.size,
                        });
                    } catch (error) {
                        console.error("Error processing file:", error);
                        toast.error(`Failed to process file: ${file.name}`);
                        setIsSubmitting(false);
                        return;
                    }
                }

                activityData.uploaded_files = uploadedFiles;
            }

            console.log("Submitting activity data:", activityData);

            // Submit the data
            const response = await fetch(
                `${BASE_URL}app/views/activities.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(activityData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                toast.success(result.message + ".");

                // Clean up object URLs
                filePreviews.forEach((preview) => {
                    if (preview.preview) {
                        URL.revokeObjectURL(preview.preview);
                    }
                });

                resetForm();
                setIsOpen(false);

                if (onSuccess) onSuccess();
            } else {
                toast.error("Error: " + result.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDocOrDocx = (fileType) => {
        return (
            fileType === "application/msword" ||
            fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
    };

    return (
        <InputModal
            label={"Submit Community Service"}
            isOpen={isOpen}
            onClose={setIsOpen}
            resetFields={null}
            expandable={true}
        >
            <form onSubmit={handleSubmit} className="px-8 py-8">
                <div className="grid md:grid-cols-2 gap-2">
                    <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Activity Name
                        <input
                            type="text"
                            required
                            value={activityName}
                            onChange={(e) =>
                                handleChange(setActivityName, e.target.value)
                            }
                            placeholder="Enter activity name"
                            className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Activity Location
                        <input
                            type="text"
                            required
                            value={activityLocation}
                            onChange={(e) =>
                                handleChange(
                                    setActivityLocation,
                                    e.target.value
                                )
                            }
                            placeholder="Enter activity location"
                            className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Date
                        <input
                            type="date"
                            required
                            value={activityDate}
                            onChange={(e) =>
                                handleChange(setActivityDate, e.target.value)
                            }
                            className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>

                    <div className="flex gap-2">
                        <label className="w-[50%] py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Start Time
                            <input
                                type="time"
                                required
                                value={startTime}
                                onChange={(e) =>
                                    handleChange(setStartTime, e.target.value)
                                }
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>

                        <label className="w-[50%] py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                            End Time
                            <input
                                type="time"
                                required
                                value={endTime}
                                onChange={(e) =>
                                    handleChange(setEndTime, e.target.value)
                                }
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="">
                    <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                        Certificate of Appearance
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx"
                            style={{ display: "none" }}
                        />
                        <button
                            type="button"
                            onClick={handleAddFileClick}
                            className="p-2 flex justify-center gap-[1px] text-gray-600 text-sm rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
                            disabled={isSubmitting}
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
                            Add File
                        </button>
                    </label>

                    {filePreviews.length > 0 && (
                        <ul className="mt-2 w-full grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                            {filePreviews.map((filePreview, index) => (
                                <li
                                    key={index}
                                    className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                >
                                    <div className="flex items-center">
                                        {filePreview.type &&
                                            filePreview.type.startsWith(
                                                "image/"
                                            ) && (
                                                <img
                                                    src={filePreview.preview}
                                                    alt={filePreview.name}
                                                    className="w-12 h-12 object-cover rounded mr-2"
                                                />
                                            )}
                                        <div>
                                            <div className="font-medium text-gray-700 flex items-center">
                                                {filePreview.name}
                                                {isDocOrDocx(
                                                    filePreview.type
                                                ) && (
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                        Will convert to PDF
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-500">
                                                {(
                                                    filePreview.size / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div>
                                            {conversionStatus[index] && (
                                                <div
                                                    className={`text-xs mt-1 ${
                                                        conversionStatus[index]
                                                            .status === "error"
                                                            ? "text-red-500"
                                                            : conversionStatus[
                                                                    index
                                                                ].status ===
                                                                "completed"
                                                              ? "text-green-500"
                                                              : "text-blue-500"
                                                    }`}
                                                >
                                                    {
                                                        conversionStatus[index]
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="hover:text-red-700 text-red-500 p-1"
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

                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isSubmitting ? "Processing..." : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </InputModal>
    );
}

export default ActivityFormModal;
