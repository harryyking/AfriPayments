"use client"

import { useState, useRef, useEffect } from "react"
import html2canvas from "html2canvas"
import { Toaster, toast } from "react-hot-toast"
import * as tf from "@tensorflow/tfjs"
import { load as loadDeepLab } from "@tensorflow-models/deeplab"
import ImageUploader from "../components/ImageUploader"
import ImagePreview from "../components/ImagePreview"
import Presets from "../components/Presets"
import UndoRedo from "../components/UndoRedo"
import { useHistory } from "../lib/useHistory"
import type { TextState, Preset } from "../types"
import { Download, Upload, Image, Sparkles, Sliders, Type, Palette } from "lucide-react"

// Declare cv globally (from OpenCV.js)
declare const cv: any;

interface ImageConstructor {
  new(): HTMLImageElement;
  new(width: number, height: number): HTMLImageElement;
}

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string>("/default-image.jpg")
  const [backgroundImage, setBackgroundImage] = useState<string>("/default-image.jpg")
  const [subjectImage, setSubjectImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("upload")

  const initialTextState: TextState = {
    text: "bear",
    textColor: "#ffffff",
    fontSize: 60,
    fontWeight: "700",
    font: "font-montserrat",
    position: { x: 50, y: 20 },
    rotation: 0,
    opacity: 1,
    backgroundColor: "transparent",
    useOverlay: false,
    brightness: 1,
    contrast: 1,
  }

  const { state, addToHistory, undo, redo, canUndo, canRedo } = useHistory(initialTextState)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>("text-overlay-image")
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png")
  const [jpegQuality, setJpegQuality] = useState<number>(0.8)
  const previewRef = useRef<HTMLDivElement>(null)

  // Load DeepLab model with WebGL backend for GPU acceleration
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend("webgl") // Enable GPU acceleration
        await loadDeepLab({ base: "pascal" }) // Load DeepLab v3 with Pascal VOC weights
        toast.success("AI model loaded successfully")
      } catch (error: unknown) {
        toast.error("Failed to load AI model")
      }
    }
    loadModel()
  }, [])

  const processImage = async (imageSrc: string) => {
    setIsProcessing(true);
    try {
      // Load the original image with explicit typing
      const ImageConstructor = Image as unknown as ImageConstructor;
      const imgElement: HTMLImageElement = new ImageConstructor();
      
      imgElement.crossOrigin = 'anonymous';
      imgElement.src = imageSrc;
  
      // Wait for the image to load or handle errors
      await new Promise<void>((resolve, reject) => {
        imgElement.onload = () => resolve();
        imgElement.onerror = () => reject(new Error('Failed to load image'));
      });
  
      // Resize image to 512x512 for faster processing
      const resizedWidth = 512;
      const resizedHeight = 512;
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = resizedWidth;
      resizedCanvas.height = resizedHeight;
      const resizedCtx = resizedCanvas.getContext('2d')!;
      resizedCtx.drawImage(imgElement, 0, 0, resizedWidth, resizedHeight);
      const resizedImgData = resizedCtx.getImageData(0, 0, resizedWidth, resizedHeight);
  
      // Convert to OpenCV Mat
      const srcMat = cv.imread(resizedCanvas);
  
      // Run DeepLab on resized image
      const model = await loadDeepLab({ base: 'pascal' });
      const { segmentationMap } = await model.segment(resizedCanvas);
      const maskBinary = new Uint8Array(resizedWidth * resizedHeight);
      for (let i = 0; i < segmentationMap.length; i++) {
        // Label as probable foreground (1) or background (0)
        maskBinary[i] = segmentationMap[i] > 0 ? cv.GC_PR_FGD : cv.GC_PR_BGD;
      }
      const maskMat = cv.matFromArray(resizedHeight, resizedWidth, cv.CV_8UC1, maskBinary);
  
      // Refine mask with GrabCut
      const bgdModel = new cv.Mat();
      const fgdModel = new cv.Mat();
      cv.grabCut(
        srcMat,
        maskMat,
        new cv.Rect(0, 0, resizedWidth, resizedHeight),
        bgdModel,
        fgdModel,
        5, // Number of iterations
        cv.GC_INIT_WITH_MASK
      );
  
      // Convert GrabCut output to binary mask (255 for subject, 0 for background)
      for (let i = 0; i < maskMat.data.length; i++) {
        maskMat.data[i] =
          maskMat.data[i] === cv.GC_FGD || maskMat.data[i] === cv.GC_PR_FGD ? 255 : 0;
      }
  
      // Resize mask back to original size
      const originalWidth = imgElement.width;
      const originalHeight = imgElement.height;
      const resizedMaskMat = new cv.Mat();
      cv.resize(
        maskMat,
        resizedMaskMat,
        new cv.Size(originalWidth, originalHeight),
        0,
        0,
        cv.INTER_NEAREST // Preserve binary edges
      );
  
      // Inpaint the original image
      const originalMat = cv.imread(imgElement);
      const inpaintedMat = new cv.Mat();
      cv.inpaint(originalMat, resizedMaskMat, inpaintedMat, 3, cv.INPAINT_TELEA);
  
      // Convert inpainted image to data URL
      const inpaintedCanvas = document.createElement('canvas');
      inpaintedCanvas.width = originalWidth;
      inpaintedCanvas.height = originalHeight;
      cv.imshow(inpaintedCanvas, inpaintedMat);
      const backgroundUrl = inpaintedCanvas.toDataURL('image/png');
      setBackgroundImage(backgroundUrl);
  
      // Extract subject with transparent background
      const subjectCanvas = document.createElement('canvas');
      subjectCanvas.width = originalWidth;
      subjectCanvas.height = originalHeight;
      const subjectCtx = subjectCanvas.getContext('2d')!;
      subjectCtx.drawImage(imgElement, 0, 0);
      const subjectData = subjectCtx.getImageData(0, 0, originalWidth, originalHeight);
      for (let i = 0; i < subjectData.data.length; i += 4) {
        if (resizedMaskMat.data[i / 4] === 0) {
          subjectData.data[i + 3] = 0; // Set alpha to 0 for background
        }
      }
      subjectCtx.putImageData(subjectData, 0, 0);
      const subjectUrl = subjectCanvas.toDataURL('image/png');
      setSubjectImage(subjectUrl);
  
      // Clean up OpenCV Mats
      srcMat.delete();
      maskMat.delete();
      bgdModel.delete();
      fgdModel.delete();
      resizedMaskMat.delete();
      originalMat.delete();
      inpaintedMat.delete();
  
      toast.success('Image processed successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to process image: ${errorMessage}`);
      setBackgroundImage(imageSrc);
      setSubjectImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = (image: string) => {
    setOriginalImage(image)
    processImage(image)
  }

  useEffect(() => {
    return () => {
      if (backgroundImage.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundImage)
      }
      if (subjectImage && subjectImage.startsWith("blob:")) {
        URL.revokeObjectURL(subjectImage)
      }
      if (originalImage.startsWith("blob:")) {
        URL.revokeObjectURL(originalImage)
      }
    }
  }, [backgroundImage, subjectImage, originalImage])

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      if (!previewRef.current) throw new Error("Preview not available")
      await document.fonts.ready
      const canvas = await html2canvas(previewRef.current, { useCORS: true })
      const link = document.createElement("a")
      const format = exportFormat === "jpeg" ? "image/jpeg" : "image/png"
      const quality = exportFormat === "jpeg" ? jpegQuality : undefined
      link.href = canvas.toDataURL(format, quality)
      link.download = `${fileName}.${exportFormat}`
      link.click()
      toast.success("Image downloaded successfully")
      if (originalImage.startsWith("blob:")) {
        URL.revokeObjectURL(originalImage)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to download image: ${errorMessage}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const applyPreset = (preset: Preset) => {
    const newState: TextState = {
      ...state,
      textColor: preset.textColor,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      font: preset.font,
      rotation: preset.rotation,
      opacity: preset.opacity,
      backgroundColor: preset.backgroundColor,
    }
    addToHistory(newState)
    toast.success("Preset applied")
  }

  return (
    <div className="min-h-screen bg-base-200 p-2 sm:p-4 md:p-6">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            <span className="inline-block">AI Text Overlay Studio</span>
            <span className="badge badge-primary ml-2 text-xs">Beta</span>
          </h1>
          <p className="text-base-content/70 mt-2">Create stunning text overlays with AI-powered background removal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Undo/Redo Controls */}
            <div className="flex justify-between items-center mb-4">
              <UndoRedo undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
              <button className="btn btn-primary btn-sm" onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Exporting..." : "Export"}
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-4 flex justify-between">
              <a
                className={`tab flex-1 ${activeTab === "upload" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </a>
              <a
                className={`tab flex-1 ${activeTab === "text" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                <Type className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Text</span>
              </a>
              <a
                className={`tab flex-1 ${activeTab === "style" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("style")}
              >
                <Palette className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Style</span>
              </a>
              <a
                className={`tab flex-1 ${activeTab === "presets" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("presets")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Presets</span>
              </a>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Upload Tab */}
              {activeTab === "upload" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h2 className="card-title text-lg">
                      <Image className="h-5 w-5 mr-2" />
                      Upload Image
                    </h2>

                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-base-300 rounded-lg bg-base-200">
                        <div className="flex flex-col items-center gap-3">
                          <span className="loading loading-spinner loading-lg text-primary"></span>
                          <div className="text-center">
                            <p className="font-medium text-base-content">Processing image with AI...</p>
                            <p className="text-base-content/70 text-sm mt-1">This may take a few moments</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageUploader onImageChange={handleImageChange} />
                    )}

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Brightness</span>
                        <span className="label-text-alt">{state.brightness.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0.2"
                        max="2"
                        step="0.1"
                        value={state.brightness}
                        onChange={(e) => addToHistory({ ...state, brightness: Number.parseFloat(e.target.value) })}
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contrast</span>
                        <span className="label-text-alt">{state.contrast.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0.2"
                        max="2"
                        step="0.1"
                        value={state.contrast}
                        onChange={(e) => addToHistory({ ...state, contrast: Number.parseFloat(e.target.value) })}
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Add dark overlay</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={state.useOverlay}
                          onChange={(e) => addToHistory({ ...state, useOverlay: e.target.checked })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Tab */}
              {activeTab === "text" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h2 className="card-title text-lg">
                      <Type className="h-5 w-5 mr-2" />
                      Text Settings
                    </h2>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Text Content</span>
                      </label>
                      <input
                        type="text"
                        value={state.text}
                        onChange={(e) => addToHistory({ ...state, text: e.target.value })}
                        placeholder="Enter your text"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Font Family</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={state.font}
                        onChange={(e) => addToHistory({ ...state, font: e.target.value })}
                      >
                        <option value="font-montserrat">Montserrat</option>
                        <option value="font-roboto">Roboto</option>
                        <option value="font-poppins">Poppins</option>
                        <option value="font-playfair">Playfair Display</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Font Size</span>
                        <span className="label-text-alt">{state.fontSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        step="1"
                        value={state.fontSize}
                        onChange={(e) => addToHistory({ ...state, fontSize: Number.parseInt(e.target.value) })}
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Font Weight</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={state.fontWeight}
                        onChange={(e) => addToHistory({ ...state, fontWeight: e.target.value })}
                      >
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi-Bold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra Bold (800)</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Text Color</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-full border border-base-300 tooltip tooltip-top"
                          data-tip={state.textColor}
                          style={{ backgroundColor: state.textColor }}
                        />
                        <input
                          type="color"
                          value={state.textColor}
                          onChange={(e) => addToHistory({ ...state, textColor: e.target.value })}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Style Tab */}
              {activeTab === "style" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h2 className="card-title text-lg">
                      <Sliders className="h-5 w-5 mr-2" />
                      Style Settings
                    </h2>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Horizontal Position</span>
                        <span className="label-text-alt">{state.position.x}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={state.position.x}
                        onChange={(e) =>
                          addToHistory({
                            ...state,
                            position: { ...state.position, x: Number.parseInt(e.target.value) },
                          })
                        }
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Vertical Position</span>
                        <span className="label-text-alt">{state.position.y}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={state.position.y}
                        onChange={(e) =>
                          addToHistory({
                            ...state,
                            position: { ...state.position, y: Number.parseInt(e.target.value) },
                          })
                        }
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Rotation</span>
                        <span className="label-text-alt">{state.rotation}°</span>
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={state.rotation}
                        onChange={(e) => addToHistory({ ...state, rotation: Number.parseInt(e.target.value) })}
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Opacity</span>
                        <span className="label-text-alt">{Math.round(state.opacity * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={state.opacity}
                        onChange={(e) => addToHistory({ ...state, opacity: Number.parseFloat(e.target.value) })}
                        className="range range-primary"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Background Color</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-full border border-base-300 tooltip tooltip-top"
                          data-tip={state.backgroundColor === "transparent" ? "Transparent" : state.backgroundColor}
                          style={{ backgroundColor: state.backgroundColor }}
                        />
                        <input
                          type="color"
                          value={state.backgroundColor === "transparent" ? "#ffffff" : state.backgroundColor}
                          onChange={(e) => addToHistory({ ...state, backgroundColor: e.target.value })}
                          className="w-full h-10"
                        />
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => addToHistory({ ...state, backgroundColor: "transparent" })}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Presets Tab */}
              {activeTab === "presets" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h2 className="card-title text-lg">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Style Presets
                    </h2>

                    <Presets applyPreset={applyPreset} />
                  </div>
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-lg">
                  <Download className="h-5 w-5 mr-2" />
                  Export Options
                </h2>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">File Name</span>
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value || "text-overlay-image")}
                    placeholder="Enter file name"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Format</span>
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
                      <span className="label-text">JPEG Quality</span>
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

                <button className="btn btn-primary w-full mt-4" onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-md overflow-hidden h-full">
              <div className="bg-base-200 p-4 border-b border-base-300 flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Preview
                </h3>
                <div className="badge badge-outline">{subjectImage ? "AI Enhanced" : "Original"}</div>
              </div>
              <div className="p-6 flex items-center justify-center bg-base-200 min-h-[500px]">
                {isProcessing ? (
                  <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary block mx-auto mb-4"></span>
                    <p className="text-base-content/70">Processing your image...</p>
                  </div>
                ) : (
                  <ImagePreview
                    backgroundImage={backgroundImage}
                    subjectImage={subjectImage}
                    text={state.text}
                    textColor={state.textColor}
                    fontSize={state.fontSize}
                    fontWeight={state.fontWeight}
                    font={state.font}
                    position={state.position}
                    rotation={state.rotation}
                    opacity={state.opacity}
                    backgroundColor={state.backgroundColor}
                    useOverlay={state.useOverlay}
                    brightness={state.brightness}
                    contrast={state.contrast}
                    previewRef={previewRef}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

