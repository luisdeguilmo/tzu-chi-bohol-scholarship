import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import InputModal from "./InputModal";

// Helper function to create image from URL
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

// Helper function to get cropped image blob
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5,
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
    );

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                resolve(blob);
            },
            "image/jpeg",
            0.95,
        );
    });
}

function ProfilePhotoUpload({ isOpen, onOpenModal, onRefresh }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const fileInputRef = useRef(null);
    const [isOpenCropper, setIsOpenCropper] = useState(false);
    const token = localStorage.getItem("token");

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCancel = () => {
        onOpenModal(false);
        setSelectedImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSave = async () => {
        if (!selectedImage || !croppedAreaPixels) return;

        setIsSubmitting(true);

        try {
            const croppedBlob = await getCroppedImg(
                selectedImage,
                croppedAreaPixels,
                0,
            );

            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    const base64Data = reader.result.split(",")[1];

                    const activityData = {
                        ["profile_picture"]: {
                            type: "profile_picture",
                        },
                        existing_files: [],
                        existing_files_removed: [],
                        uploaded_files: [
                            {
                                filename: `profile_${Date.now()}.jpg`,
                                base64_data: base64Data,
                                file_type: "image/jpeg",
                                file_size: croppedBlob.size,
                            },
                        ],
                    };

                    const response = await fetch(
                        `${BASE_URL}app/api/profile-picture.php?type=profile_picture`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(activityData),
                        },
                    );

                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }

                    const result = await response.json();

                    if (result.success) {
                        toast.success(result.message + ".");
                        setCurrentPhoto(reader.result);
                        setSelectedImage(null);
                        setCrop({ x: 0, y: 0 });
                        setZoom(1);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                    } else {
                        toast.error("Error: " + result.message);
                    }
                } catch (error) {
                    console.error("Error submitting form:", error);
                    toast.error("Failed to submit the form. Please try again.");
                } finally {
                    // Moved here so they always run after success/failure
                    // without their exceptions triggering the error toast above
                    // onRefresh();
                    onOpenModal(false);
                    setIsSubmitting(false);
                }
            };

            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                toast.error("Failed to process the image. Please try again.");
                setIsSubmitting(false);
            };

            reader.readAsDataURL(croppedBlob);
        } catch (error) {
            console.error("Error saving photo:", error);
            toast.error("Failed to save photo. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <InputModal
            label={"Profile Picture Upload"}
            isOpen={isOpen}
            onClose={onOpenModal}
            onCancel={handleCancel}
            onSubmit={handleSave}
            disabledButtonSave={true}
        >
            <div className="p-6">
                <div className="space-y-4">
                    {/* Current Photo */}
                    {currentPhoto ? (
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-gray-600">
                                Current Photo
                            </p>
                            <img
                                src={currentPhoto}
                                alt="Current profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                            />
                        </div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 128"
                            width="128"
                            height="128"
                            className="mt-8 mx-auto"
                        >
                            <circle cx="64" cy="64" r="64" fill="#E3F2FD" />
                            <circle cx="64" cy="48" r="20" fill="#BBDEFB" />
                            <path
                                d="M64 74c-22 0-40 12-40 28v6h80v-6c0-16-18-28-40-28z"
                                fill="#BBDEFB"
                            />
                        </svg>
                    )}

                    {/* Upload Button */}
                    <div className="flex flex-col items-center gap-4 pt-2 pb-8">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                fileInputRef.current?.click();
                                setIsOpenCropper(true);
                            }}
                            className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Upload className="w-5 h-5" />
                            Choose Photo
                        </button>
                        <p className="text-xs text-gray-500">
                            Supported formats: JPG, PNG, GIF (Max 10MB)
                        </p>
                    </div>
                </div>

                <div className="space-y-4 rounded-3xl">
                    {/* Cropper */}
                    {isOpenCropper && selectedImage && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 lg:w-[800px] w-[100%] h-[650px] bg-black rounded-3xl">
                            <button
                                onClick={() => {
                                    setIsOpenCropper(false);
                                    setSelectedImage(null);
                                }}
                                className="text-white absolute top-5 left-5"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
                                <Cropper
                                    image={selectedImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={true}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    style={{
                                        containerStyle: {
                                            backgroundColor: "#000000",
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                            </div>

                            <button className="px-6 py-2 rounded-md bg-green-500 text-white absolute bottom-10 left-1/2 -translate-x-1/2">
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </InputModal>
    );
}

export default ProfilePhotoUpload;
