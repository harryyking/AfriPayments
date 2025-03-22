import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploaderProps {
  onImageChange: (url: string) => void;
  disabled: boolean;
}

export default function ImageUploader({ onImageChange, disabled }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="relative">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            onImageChange(res[0].url);
            setIsUploading(false);
          }
        }}
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`);
          setIsUploading(false);
        }}
        onUploadBegin={() => setIsUploading(true)}
        disabled={disabled || isUploading}
        className="ut-button:bg-blue-500 ut-button:hover:bg-blue-600 ut-label:text-gray-700"
      />
      {(disabled || isUploading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-lg">
          <span className="text-gray-500">{isUploading ? "Uploading..." : "Processing..."}</span>
        </div>
      )}
    </div>
  );
}