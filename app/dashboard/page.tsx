"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import html2canvas from "html2canvas";
import { Toaster, toast } from "react-hot-toast";
import { Download, Upload, Image, LogOut, Type, Palette, Sparkles, Sliders, History } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import TextControls from "@/components/TextControls";
import Presets from "@/components/Presets";
import UndoRedo from "@/components/UndoRedo";
import ImageGallery from "@/components/ImageGallery";
import { useHistory } from "@/lib/useHistory";
import { TextState, Preset } from "@/types";
import prisma from "@/lib/db";

export default function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.email;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("edited-image");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const [activeTab, setActiveTab] = useState<string>("upload");
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
    contrast: 0
  };
  const { state: textState, addToHistory, undo, redo, canUndo, canRedo } = useHistory(initialTextState);

  // Process image using remove.bg API via backend proxy
  const processImage = async (imageUrl: string) => {
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
        await prisma.behindImage.create({
          data: {
            imageUrl: processedImageUrl,
            userid: userId,
          },
        });
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            AI Background Removal Studio
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {session?.user?.name}</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            {/* Undo/Redo and Download */}
            <div className="flex justify-between items-center">
              <UndoRedo undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleDownload}
                disabled={isProcessing}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-4 flex justify-between">
              <a
                className={`tab flex-1 ${activeTab === "upload" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </a>
              <a
                className={`tab flex-1 ${activeTab === "text" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                <Type className="h-4 w-4 mr-2" />
                Text
              </a>
              <a
                className={`tab flex-1 ${activeTab === "style" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("style")}
              >
                <Sliders className="h-4 w-4 mr-2" />
                Style
              </a>
              <a
                className={`tab flex-1 ${activeTab === "presets" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("presets")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Presets
              </a>
              <a
                className={`tab flex-1 ${activeTab === "history" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </a>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === "upload" && (
                <div className="card bg-white shadow-md p-6">
                  <h2 className="text-lg font-medium flex items-center mb-4">
                    <Upload className="h-5 w-5 mr-2 text-blue-500" />
                    Upload Image
                  </h2>
                  {isProcessing ? (
                    <div className="text-center py-4">
                      <span className="loading loading-spinner loading-lg text-blue-500"></span>
                      <p className="mt-2 text-gray-600">Processing...</p>
                    </div>
                  ) : (
                    <ImageUploader onImageChange={handleImageChange} disabled={isProcessing} />
                  )}
                </div>
              )}

              {activeTab === "text" && (
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
              )}

              {activeTab === "style" && (
                <div className="card bg-white shadow-md p-6">
                  <h2 className="text-lg font-medium flex items-center mb-4">
                    <Sliders className="h-5 w-5 mr-2 text-blue-500" />
                    Style Settings
                  </h2>
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
              )}

              {activeTab === "presets" && (
                <Presets applyPreset={applyPreset} />
              )}

              {activeTab === "history" && userId && (
                <ImageGallery userId={userId} onSelectImage={(url) => {
                  setBackgroundImage(url);
                  setSubjectImage(url);
                  setActiveTab("upload");
                }} />
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
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={handleDownload}
                  disabled={isProcessing}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
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
                  textState={textState}
                  previewRef={previewRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}