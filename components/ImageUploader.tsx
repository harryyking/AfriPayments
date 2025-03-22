'use client';

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onImageChange: (image: string) => void;
}

export default function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      setImage(storedImage);
      onImageChange(storedImage);
    } else {
      setImage('/default-image.jpg');
      onImageChange('/default-image.jpg');
    }
  }, [onImageChange]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });
        if (compressedFile.size > 10 * 1024 * 1024) {
          toast('Image is very large and may cause performance issues.');
        }
        const imageUrl = URL.createObjectURL(compressedFile);
        localStorage.setItem('uploadedImage', imageUrl);
        setImage(imageUrl);
        onImageChange(imageUrl);
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to compress image');
      }
    }
  };

  const clearImage = () => {
    setImage('/default-image.jpg');
    localStorage.removeItem('uploadedImage');
    onImageChange('/default-image.jpg');
    toast.success('Image cleared');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
        aria-label="Upload an image"
      />
      {image && image !== '/default-image.jpg' && (
        <button
          onClick={clearImage}
          className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition"
        >
          Clear Image
        </button>
      )}
    </div>
  );
}