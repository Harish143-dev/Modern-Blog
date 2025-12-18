import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

interface CoverImageProps {
  currentCoverImage?: string;
  onUpdate?: (newCoverImage: string) => void;
  editable?: boolean;
}

const CoverImage: React.FC<CoverImageProps> = ({
  currentCoverImage = "",
  onUpdate,
  editable = true,
}) => {
  const [coverImage, setCoverImage] = useState(currentCoverImage);
  const [isUploading, setIsUploading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCoverImage(file);
    }
  };

  const uploadCoverImage = async (file: File) => {
    try {
      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("coverImage", file);

      // Use authService to upload
      const response = await authService.coverImage(formData);

      if (response.coverImage) {
        setCoverImage(response.coverImage);
        onUpdate?.(response.coverImage);
      }
    } catch (error: any) {
      console.error("Cover image upload failed:", error);
      alert(error.response?.data?.message || "Failed to upload cover image");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCoverImage = async () => {
    try {
      setIsUploading(true);

      // Use authService to delete
      await authService.deleteCoverImage();

      setCoverImage("");
      onUpdate?.("");
      setShowActions(false);
    } catch (error: any) {
      console.error("Cover image deletion failed:", error);
      alert(error.response?.data?.message || "Failed to delete cover image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteCoverImage();
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const hasCoverImage = coverImage && coverImage.trim() !== "";

  return (
    <div
      className="relative w-full h-60 rounded-2xl overflow-hidden group transition-all"
      onMouseEnter={() => editable && setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >   
      {/* Gradient Background (default) or Cover Image */}
      {hasCoverImage ? (
        <Image
          src={coverImage}
          alt="Cover Image"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" />
      )}

      {/* Overlay on hover */}
      {editable && showActions && (
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-200" />
      )}

      {/* Action Buttons */}
      {editable && showActions && !isUploading && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
          <button
            onClick={handleCameraClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary/50  text-primary-foreground rounded-lg hover:bg-primary transition-colors shadow-lg"
          >
            <Camera size={20} />
            <span className="font-medium">
              {hasCoverImage ? "Change Cover" : "Add Cover"}
            </span>
          </button>

          {hasCoverImage && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/50 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <Trash2 size={20} />
              <span className="font-medium">Remove</span>
            </button>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="animate-spin text-white" />
            <span className="text-white text-sm font-medium">
              {hasCoverImage ? "Updating..." : "Uploading..."}
            </span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Remove Cover Image?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove your cover image? It will be
              replaced with the default gradient.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverImage;
