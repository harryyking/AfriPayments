"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Toaster, toast } from "react-hot-toast";
import { Download, Upload, Image } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string>("/default-image.jpg");
  const [backgroundImage, setBackgroundImage] = useState<string>("/default-image.jpg");
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("edited-image");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const previewRef = useRef<HTMLDivElement>(null);

  // Process image using remove.bg API via a backend proxy
  const processImage = async (imageSrc: string) => {
    setIsProcessing(true);
    try {
      // Validate image source
      if (!imageSrc || imageSrc === "/default-image.jpg") {
        throw new Error("Please upload a valid image");
      }

      // Send image to backend proxy at /api/remove-bg
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageSrc }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove background");
      }

      const data = await response.json();
      const subjectUrl = data.result; // Processed image as base64 data URL

      // Set original image as background and processed image as subject
      setBackgroundImage(imageSrc);
      setSubjectImage(subjectUrl);
      toast.success("Background removed successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error: ${errorMessage}`);
      setBackgroundImage(imageSrc); // Fallback to original image
      setSubjectImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle image upload
  const handleImageChange = (image: string) => {
    setOriginalImage(image);
    processImage(image);
  };

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (backgroundImage.startsWith("blob:")) URL.revokeObjectURL(backgroundImage);
      if (subjectImage && subjectImage.startsWith("blob:")) URL.revokeObjectURL(subjectImage);
      if (originalImage.startsWith("blob:")) URL.revokeObjectURL(originalImage);
    };
  }, [backgroundImage, subjectImage, originalImage]);

  // Download the final image with format and quality options
  const handleDownload = async () => {
    try {
      if (!previewRef.current) throw new Error("Preview not available");
      const canvas = await html2canvas(previewRef.current, { useCORS: true });
      const format = exportFormat === "jpeg" ? "image/jpeg" : "image/png";
      const quality = exportFormat === "jpeg" ? jpegQuality : undefined;
      const link = document.createElement("a");
      link.href = canvas.toDataURL(format, quality);
      link.download = `${fileName}.${exportFormat}`;
      link.click();
      toast.success("Image downloaded successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Download failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            AI Background Removal Studio
            <span className="ml-2 badge badge-primary badge-sm">v1.0</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Remove backgrounds effortlessly with AI-powered technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="card bg-white shadow-md p-6">
              <h2 className="text-lg font-medium flex items-center mb-4">
                <Upload className="h-5 w-5 mr-2 text-blue-500" />
                Upload Image
              </h2>
              {isProcessing ? (
                <div className="text-center py-4">
                  <span className="loading loading-spinner loading-lg text-blue-500"></span>
                  <p className="mt-2 text-gray-600">Processing image...</p>
                </div>
              ) : (
                <ImageUploader onImageChange={handleImageChange} disabled={isProcessing} />
              )}
            </div>

            {/* Export Options */}
            <div className="card bg-white shadow-md p-6">
              <h2 className="text-lg font-medium flex items-center mb-4">
                <Download className="h-5 w-5 mr-2 text-blue-500" />
                Export Options
              </h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">File Name</span>
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value || "edited-image")}
                    placeholder="Enter file name"
                    className="input input-bordered w-full"
                    aria-label="File name for export"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Format</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as "png" | "jpeg")}
                    aria-label="Export format"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                </div>
                {exportFormat === "jpeg" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">JPEG Quality</span>
                      <span className="label-text-alt">{Math.round(jpegQuality * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={jpegQuality}
                      onChange={(e) => setJpegQuality(Number.parseFloat(e.target.value))}
                      className="range range-primary"
                      aria-label="JPEG quality"
                    />
                  </div>
                )}
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={handleDownload}
                  disabled={isProcessing}
                  aria-label="Download processed image"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Download Image"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card bg-white shadow-md p-6">
            <h2 className="text-lg font-medium flex items-center mb-4">
              <Image className="h-5 w-5 mr-2 text-blue-500" />
              Preview
            </h2>
            <div className="min-h-[300px] flex items-center justify-center">
              {isProcessing ? (
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg text-blue-500"></span>
                  <p className="mt-2 text-gray-600">Processing your image...</p>
                </div>
              ) : (
                <ImagePreview
                  backgroundImage={backgroundImage}
                  subjectImage={subjectImage}
                  previewRef={previewRef}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://www.remove.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              remove.bg
            </a>{" "}
            | Built with ❤️ by [Your Name]
          </p>
        </footer>
      </div>
    </div>
  );
}