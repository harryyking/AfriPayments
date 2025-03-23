"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import html2canvas from "html2canvas-pro";
import { Toaster, toast } from "react-hot-toast";
import {
  Download,
  Upload,
  Image,
  LogOut,
  Type,
  Palette,
  Sparkles,
  Sliders,
  History,
  ChevronDown,
  Save,
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import TextControls from "@/components/TextControls";
import Presets from "@/components/Presets";
import UndoRedo from "@/components/UndoRedo";
import ImageGallery from "@/components/ImageGallery";
import PaystackButton from "@/components/PaystackButton"; // Add this import
import { useHistory } from "@/lib/useHistory";
import type { TextState, Preset } from "@/types";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const userId = session?.user?.email || "";
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("edited-image");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [imageCount, setImageCount] = useState<number>(0);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const initialTextState: TextState = {
    text: "Your Text Here",
    textColor: "#ffffff",
    fontSize: 60,
    fontWeight: "700",
    font: "font-montserrat",
    position: { x: 50, y: 50 },
    rotation: 0,
    opacity: 1,
    backgroundColor: "transparent",
    useOverlay: false,
    brightness: 0,
    contrast: 0,
  };
  const { state: textState, addToHistory, undo, redo, canUndo, canRedo } = useHistory(initialTextState);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const data = await fetch(`/api/images?userId=${userId}`).then((res) => res.json());
        setImageCount(data.images.length);
        setIsPaid(data.onPaid);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [userId]);

  const canProcessImage = isPaid || imageCount < 3;

  const processImage = async (imageUrl: string) => {
    if (!canProcessImage) {
      toast.error("You have reached the free limit of 3 images. Please upgrade to continue.");
      return;
    }
    setIsProcessing(true);
    try {
      if (!imageUrl) throw new Error("No image uploaded");
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove background");
      }
      const data = await response.json();
      const processedImageUrl = data.result;
      if (userId) {
        await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: processedImageUrl, userId }),
        });
        setImageCount((prev) => prev + 1);
      }
      setSubjectImage(processedImageUrl);
      toast.success("Background removed successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error: ${errorMessage}`);
      setSubjectImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setBackgroundImage(url);
    setSubjectImage(null);
    processImage(url);
  };

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
      console.error("Download error:", error);
      toast.error(`Download failed: ${errorMessage}`);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true); // Update user status after payment
    handleDownload(); // Trigger download on success
  };

  const applyPreset = (preset: Preset) => {
    const newState: TextState = {
      ...textState,
      textColor: preset.textColor,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      font: preset.font,
      rotation: preset.rotation,
      opacity: preset.opacity,
      backgroundColor: preset.backgroundColor,
    };
    addToHistory(newState);
    toast.success("Preset applied");
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center p-4 min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center p-4 min-h-screen">Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar and other UI unchanged */}
      <div className="navbar bg-base-100 shadow-md px-4 sm:px-6 lg:px-8">{/* ... */}</div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <UndoRedo undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
              <div className="flex gap-2">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                  <div tabIndex={0} className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-72">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Export Options</h3>
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
                          />
                        </div>
                      )}
                      {isPaid || imageCount < 3 ? (
                        <button
                          className="btn btn-primary w-full mt-4"
                          onClick={handleDownload}
                          disabled={isProcessing}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Image
                        </button>
                      ) : (
                        <PaystackButton
                          userId={userId}
                          email={session.user.email || ""}
                          onPaymentSuccess={handlePaymentSuccess}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Rest of the left panel unchanged */}
          </div>

          <div className="lg:col-span-7">
            <div className="card bg-base-100 shadow-xl h-full">
              <div className="card-body">
                <h2 className="card-title flex items-center">
                  <Image className="h-5 w-5 mr-2 text-primary" />
                  Preview
                </h2>
                <div className="flex-1 flex items-center justify-center p-4 bg-base-200 rounded-lg min-h-[400px]">
                  {isProcessing ? (
                    <div className="text-center">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                      <p className="mt-4 text-base-content/70">Processing your image...</p>
                    </div>
                  ) : (
                    <ImagePreview
                      backgroundImage={backgroundImage}
                      subjectImage={subjectImage}
                      textState={textState}
                      previewRef={previewRef}
                    />
                  )}
                </div>
                {(backgroundImage || subjectImage) && (
                  <div className="card-actions justify-center mt-4">
                    <div className="join">
                      {isPaid || imageCount < 3 ? (
                        <button className="btn join-item btn-sm" onClick={handleDownload} disabled={isProcessing}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </button>
                      ) : (
                        <PaystackButton
                          userId={userId}
                          email={session.user.email || ""}
                          onPaymentSuccess={handlePaymentSuccess}
                        />
                      )}
                      {/* Other quick action buttons unchanged */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}