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


import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify"; // Import toast

function DocumentForm({ isOpen, setIsOpen, onSuccess }) {
    const [activityName, setActivityName] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [activityTime, setActivityTime] = useState("");
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        onDrop: (acceptedFiles) => {
            // Add new files to existing files
            setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);

            // Create previews for display purposes
            const newPreviews = acceptedFiles.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file),
            }));

            setFilePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        },
    });

    const removeFile = (index) => {
        // Remove from previews and revoke object URL to prevent memory leaks
        const newPreviews = [...filePreviews];
        URL.revokeObjectURL(newPreviews[index].preview);
        newPreviews.splice(index, 1);
        setFilePreviews(newPreviews);

        // Remove the actual file from files array
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleChange = (setValue, value) => {
        setValue(value);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        // Clean up object URLs
        filePreviews.forEach(preview => {
            if (preview.preview) {
                URL.revokeObjectURL(preview.preview);
            }
        });
        
        // Reset form
        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        setActivityName("");
        setActivityDate("");
        setActivityTime("");
        setFiles([]);
        setFilePreviews([]);
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare activity data
            const activityData = {
                activity: {
                    application_id: 10002, // Assuming application_id is not needed for this form
                    activity_name: activityName,
                    activity_date: activityDate,
                    activity_time: activityTime
                }
            };

            // If there are files, convert them to base64 and add to the data
            if (files.length > 0) {
                const uploadedFiles = [];
                
                for (const file of files) {
                    try {
                        const base64Data = await convertFileToBase64(file);
                        uploadedFiles.push({
                            filename: file.name,
                            base64_data: base64Data,
                            file_type: file.type,
                            file_size: file.size
                        });
                    } catch (error) {
                        console.error('Error converting file to base64:', error);
                        toast.error(`Failed to process file: ${file.name}`);
                        setIsSubmitting(false);
                        return;
                    }
                }
                
                activityData.uploaded_files = uploadedFiles;
            }

            // Submit the data
            const response = await fetch("http://localhost:8000/app/views/activities.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(activityData)
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(activityData);
            const result = await response.json();

            if (result.success) {
                toast.success(result.message + ".");
                
                // Clean up object URLs
                filePreviews.forEach(preview => {
                    if (preview.preview) {
                        URL.revokeObjectURL(preview.preview);
                    }
                });
                
                // Reset form
                resetForm();
                setIsOpen(false);
                
                // Call success callback
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

                        <form onSubmit={handleSubmit} className="px-8 pb-8">
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                Activity Name
                                <input
                                    type="text"
                                    required
                                    value={activityName}
                                    onChange={(e) =>
                                        handleChange(
                                            setActivityName,
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter activity name"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                Date
                                <input
                                    type="date"
                                    required
                                    value={activityDate}
                                    onChange={(e) =>
                                        handleChange(
                                            setActivityDate,
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                Time
                                <input
                                    type="time"
                                    required
                                    value={activityTime}
                                    onChange={(e) =>
                                        handleChange(
                                            setActivityTime,
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>
                            
                            <div className="">
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                    Certificate of Appearance
                                    <div 
                                        {...getRootProps()} 
                                        className="p-2 flex justify-center gap-[1px] text-gray-600 text-sm rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
                                    >
                                        <input {...getInputProps()} />
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
                                    </div>
                                </label>
                                
                                {filePreviews.length > 0 && (
                                    <ul className="my-1 w-full text-sm text-gray-700">
                                        {filePreviews.map(
                                            (filePreview, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 bg-gray-50 rounded-lg mt-2 flex justify-between text-xs items-center text-gray-500 border"
                                                >
                                                    <div className="flex items-center">
                                                        {filePreview.type &&
                                                            filePreview.type.startsWith(
                                                                "image/"
                                                            ) && (
                                                                <img
                                                                    src={
                                                                        filePreview.preview
                                                                    }
                                                                    alt={
                                                                        filePreview.name
                                                                    }
                                                                    className="w-12 h-12 object-cover rounded mr-2"
                                                                />
                                                            )}
                                                        <div>
                                                            <div className="font-medium text-gray-700">
                                                                {filePreview.name}
                                                            </div>
                                                            <div className="text-gray-500">
                                                                {(filePreview.size / 1024).toFixed(2)} KB
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeFile(index)
                                                        }
                                                        className="hover:text-red-700 text-red-500 p-1"
                                                        type="button"
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
                                            )
                                        )}
                                    </ul>
                                )}
                                
                                <div className="flex gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors ${
                                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentForm;