"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { History } from "lucide-react";

interface Image {
  id: string;
  imageUrl: string;
  createdAt: string; // API returns ISO string, parsed as string in JSON
}

interface ImageGalleryProps {
  userId: string;
  onSelectImage: (url: string) => void;
}

export default function ImageGallery({ userId, onSelectImage }: ImageGalleryProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/images?userId=${userId}`, {
          credentials: "include", // Ensure session cookie is sent
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }
        const data = await response.json();
        // Extract images array from response
        setImages(data.images || []);
      } catch (error) {
        console.error("ImageGallery fetch error:", error);
        toast.error("Failed to load image history");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchImages();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
        <p className="mt-2 text-gray-600">Loading your images...</p>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-md p-6">
      <h2 className="text-lg font-medium flex items-center mb-4">
        <History className="h-5 w-5 mr-2 text-blue-500" />
        Your Processed Images
      </h2>
      {images.length === 0 ? (
        <p className="text-gray-600">No images processed yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.imageUrl}
                alt="Processed image"
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                onClick={() => onSelectImage(image.imageUrl)}
                onError={() => console.error(`Failed to load image: ${image.imageUrl}`)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}