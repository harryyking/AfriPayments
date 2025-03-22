import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageChange: (image: string) => void;
  disabled: boolean;
}

export default function ImageUploader({ onImageChange, disabled }: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
        disabled={disabled}
        aria-label="Upload an image"
      />
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-lg">
          <span className="text-gray-500">Processing...</span>
        </div>
      )}
    </div>
  );
}