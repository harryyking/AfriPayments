"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import html2canvas from "html2canvas-pro"; // Updated import
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
import { useHistory } from "@/lib/useHistory";
import type { TextState, Preset } from "@/types";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const userId = session?.user?.email;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("edited-image");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [imageCount, setImageCount] = useState<number>(0);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Text state with undo/redo
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

  // Check if user can process more images
  const canProcessImage = isPaid || imageCount < 3;

  // Process image using remove.bg API via backend proxy
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

      // Store the processed image in the database
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

  // Handle image upload via UploadThing
  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setBackgroundImage(url);
    setSubjectImage(null);
    processImage(url);
  };

  // Download the final image
  const handleDownload = async () => {
    if (!canProcessImage) {
      toast.error("You have reached the free limit of 3 images. Please upgrade to continue.");
      return;
    }

    try {
      if (!previewRef.current) throw new Error("Preview not available");
      const canvas = await html2canvas(previewRef.current, { useCORS: true }); // Using html2canvas-pro
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

  // Apply preset
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
    console.log("Dashboard: Session status is loading");
    return (
      <div className="flex items-center justify-center p-4 min-h-screen">
        <span className="text-center">Loading...</span>
      </div>
    );
  }

  if (!session) {
    console.log("Dashboard: No session, user not authenticated");
    return (
      <div className="flex justify-center items-center p-4 min-h-screen">
        <span className="text-center">Please sign in to access the dashboard.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => setActiveTab("upload")}>Upload</a>
              </li>
              <li>
                <a onClick={() => setActiveTab("text")}>Text</a>
              </li>
              <li>
                <a onClick={() => setActiveTab("style")}>Style</a>
              </li>
              <li>
                <a onClick={() => setActiveTab("presets")}>Presets</a>
              </li>
              <li>
                <a onClick={() => setActiveTab("history")}>History</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">TextVeil</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className={activeTab === "upload" ? "active" : ""} onClick={() => setActiveTab("upload")}>
                Upload
              </a>
            </li>
            <li>
              <a className={activeTab === "text" ? "active" : ""} onClick={() => setActiveTab("text")}>
                Text
              </a>
            </li>
            <li>
              <a className={activeTab === "style" ? "active" : ""} onClick={() => setActiveTab("style")}>
                Style
              </a>
            </li>
            <li>
              <a className={activeTab === "presets" ? "active" : ""} onClick={() => setActiveTab("presets")}>
                Presets
              </a>
            </li>
            <li>
              <a className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
                History
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={session?.user?.image || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="p-2 text-sm font-medium">{session?.user?.name}</li>
              <li>
                <a onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel - Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Action buttons */}
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
                        <button className="btn btn-primary w-full mt-4" disabled>
                          <Download className="h-4 w-4 mr-2" />
                          Pay to Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {activeTab === "upload" && (
                  <div>
                    <h2 className="card-title flex items-center mb-4">
                      <Upload className="h-5 w-5 mr-2 text-primary" />
                      Upload Image
                    </h2>
                    {isProcessing ? (
                      <div className="text-center py-8">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-base-content/70">Removing background...</p>
                      </div>
                    ) : (
                      <ImageUploader onImageChange={handleImageChange} disabled={isProcessing} />
                    )}
                  </div>
                )}

                {activeTab === "text" && (
                  <div>
                    <h2 className="card-title flex items-center mb-4">
                      <Type className="h-5 w-5 mr-2 text-primary" />
                      Text Controls
                    </h2>
                    <TextControls
                      text={textState.text}
                      setText={(value) => addToHistory({ ...textState, text: value })}
                      textColor={textState.textColor}
                      setTextColor={(value) => addToHistory({ ...textState, textColor: value })}
                      fontSize={textState.fontSize}
                      setFontSize={(value) => addToHistory({ ...textState, fontSize: value })}
                      fontWeight={textState.fontWeight}
                      setFontWeight={(value) => addToHistory({ ...textState, fontWeight: value })}
                      font={textState.font}
                      setFont={(value) => addToHistory({ ...textState, font: value })}
                    />
                  </div>
                )}

                {activeTab === "style" && (
                  <div>
                    <h2 className="card-title flex items-center mb-4">
                      <Sliders className="h-5 w-5 mr-2 text-primary" />
                      Style Settings
                    </h2>
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Horizontal Position</span>
                          <span className="label-text-alt">{textState.position.x}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={textState.position.x}
                          onChange={(e) =>
                            addToHistory({
                              ...textState,
                              position: { ...textState.position, x: Number.parseInt(e.target.value) },
                            })
                          }
                          className="range range-primary"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Vertical Position</span>
                          <span className="label-text-alt">{textState.position.y}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={textState.position.y}
                          onChange={(e) =>
                            addToHistory({
                              ...textState,
                              position: { ...textState.position, y: Number.parseInt(e.target.value) },
                            })
                          }
                          className="range range-primary"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Rotation</span>
                          <span className="label-text-alt">{textState.rotation}°</span>
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="1"
                          value={textState.rotation}
                          onChange={(e) => addToHistory({ ...textState, rotation: Number.parseInt(e.target.value) })}
                          className="range range-primary"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Opacity</span>
                          <span className="label-text-alt">{Math.round(textState.opacity * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={textState.opacity}
                          onChange={(e) => addToHistory({ ...textState, opacity: Number.parseFloat(e.target.value) })}
                          className="range range-primary"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Background Color</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={textState.backgroundColor === "transparent" ? "#ffffff" : textState.backgroundColor}
                            onChange={(e) => addToHistory({ ...textState, backgroundColor: e.target.value })}
                            className="w-full h-10"
                          />
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => addToHistory({ ...textState, backgroundColor: "transparent" })}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "presets" && (
                  <div>
                    <h2 className="card-title flex items-center mb-4">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Style Presets
                    </h2>
                    <Presets applyPreset={applyPreset} />
                  </div>
                )}

                {activeTab === "history" && userId && (
                  <div>
                    <h2 className="card-title flex items-center mb-4">
                      <History className="h-5 w-5 mr-2 text-primary" />
                      Image History
                    </h2>
                    <ImageGallery
                      userId={userId}
                      onSelectImage={(url) => {
                        setBackgroundImage(url);
                        setSubjectImage(url);
                        setActiveTab("upload");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel - Preview */}
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

                {/* Quick actions */}
                {(backgroundImage || subjectImage) && (
                  <div className="card-actions justify-center mt-4">
                    <div className="join">
                      <button className="btn join-item btn-sm" onClick={handleDownload} disabled={isProcessing}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        className="btn join-item btn-sm"
                        onClick={() => setActiveTab("text")}
                        disabled={isProcessing}
                      >
                        <Type className="h-4 w-4 mr-1" />
                        Edit Text
                      </button>
                      <button
                        className="btn join-item btn-sm"
                        onClick={() => setActiveTab("style")}
                        disabled={isProcessing}
                      >
                        <Palette className="h-4 w-4 mr-1" />
                        Style
                      </button>
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