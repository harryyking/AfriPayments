"use client"

import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import { toast } from "react-hot-toast"
import { useHistory } from "../lib/useHistory"
import type { TextState, Preset } from "../types"
import { Upload, ImageIcon, Type, Download, Undo2, Redo2, Palette, Sparkles } from 'lucide-react'

export default function Home() {
  const [image, setImage] = useState<string>("/default-image.jpg")
  const initialTextState: TextState = {
    text: "ride",
    textColor: "#ff6200",
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
  const [activeTab, setActiveTab] = useState<string>("upload")
  const previewRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      if (!previewRef.current) throw new Error("Preview not available")

      // Wait for fonts to load to ensure they render correctly
      await document.fonts.ready

      const canvas = await html2canvas(previewRef.current, { useCORS: true })
      const link = document.createElement("a")
      const format = exportFormat === "jpeg" ? "image/jpeg" : "image/png"
      const quality = exportFormat === "jpeg" ? jpegQuality : undefined
      link.href = canvas.toDataURL(format, quality)
      link.download = `${fileName}.${exportFormat}`
      link.click()
      toast.success("Image downloaded successfully")
      if (image.startsWith("blob:")) {
        URL.revokeObjectURL(image)
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      toast.success("Image uploaded successfully")
    }
  }

  const presets: Preset[] = [
    {
      name: "Bold Orange",
      textColor: "#ff6200",
      fontSize: 72,
      fontWeight: "800",
      font: "font-montserrat",
      rotation: 0,
      opacity: 1,
      backgroundColor: "transparent",
    },
    {
      name: "White Shadow",
      textColor: "#ffffff",
      fontSize: 64,
      fontWeight: "700",
      font: "font-roboto",
      rotation: -5,
      opacity: 0.9,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    {
      name: "Neon Blue",
      textColor: "#00ffff",
      fontSize: 56,
      fontWeight: "600",
      font: "font-poppins",
      rotation: 0,
      opacity: 1,
      backgroundColor: "rgba(0,0,100,0.2)",
    },
  ]

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Text Overlay Studio
          </h1>
          <p className="text-base-content/70 mt-2">Create stunning text overlays for your images</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Undo/Redo Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button 
                  className="btn btn-outline btn-sm btn-square"
                  onClick={undo} 
                  disabled={!canUndo}
                  title="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button 
                  className="btn btn-outline btn-sm btn-square"
                  onClick={redo} 
                  disabled={!canRedo}
                  title="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Exporting...' : 'Export'}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-4">
              <a 
                className={`tab ${activeTab === "upload" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </a>
              <a 
                className={`tab ${activeTab === "text" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                <Type className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Text</span>
              </a>
              <a 
                className={`tab ${activeTab === "style" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("style")}
              >
                <Palette className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Style</span>
              </a>
              <a 
                className={`tab ${activeTab === "presets" ? "tab-active" : ""}`}
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
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-lg p-6 bg-base-200 hover:bg-base-300 transition cursor-pointer">
                        <ImageIcon className="h-10 w-10 text-base-content/50 mb-2" />
                        <p className="text-sm text-base-content/70 mb-2">Drag and drop or click to upload</p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          id="image-upload"
                        />
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          Choose Image
                        </button>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Brightness</span>
                        </label>
                        <input 
                          type="range" 
                          min="0.2" 
                          max="2" 
                          step="0.1" 
                          value={state.brightness}
                          onChange={(e) => addToHistory({ ...state, brightness: parseFloat(e.target.value) })}
                          className="range range-primary"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Contrast</span>
                        </label>
                        <input 
                          type="range" 
                          min="0.2" 
                          max="2" 
                          step="0.1" 
                          value={state.contrast}
                          onChange={(e) => addToHistory({ ...state, contrast: parseFloat(e.target.value) })}
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
                </div>
              )}

              {/* Text Tab */}
              {activeTab === "text" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="space-y-4">
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
                          <span className="label-text">Font Size: {state.fontSize}px</span>
                        </label>
                        <input 
                          type="range" 
                          min="12" 
                          max="120" 
                          step="1" 
                          value={state.fontSize}
                          onChange={(e) => addToHistory({ ...state, fontSize: parseInt(e.target.value) })}
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
                            className="w-8 h-8 rounded-full border border-base-300"
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
                </div>
              )}

              {/* Style Tab */}
              {activeTab === "style" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Horizontal Position: {state.position.x}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="1" 
                          value={state.position.x}
                          onChange={(e) => addToHistory({ 
                            ...state, 
                            position: { ...state.position, x: parseInt(e.target.value) } 
                          })}
                          className="range range-primary"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Vertical Position: {state.position.y}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="1" 
                          value={state.position.y}
                          onChange={(e) => addToHistory({ 
                            ...state, 
                            position: { ...state.position, y: parseInt(e.target.value) } 
                          })}
                          className="range range-primary"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Rotation: {state.rotation}°</span>
                        </label>
                        <input 
                          type="range" 
                          min="-180" 
                          max="180" 
                          step="1" 
                          value={state.rotation}
                          onChange={(e) => addToHistory({ ...state, rotation: parseInt(e.target.value) })}
                          className="range range-primary"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Opacity: {Math.round(state.opacity * 100)}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05" 
                          value={state.opacity}
                          onChange={(e) => addToHistory({ ...state, opacity: parseFloat(e.target.value) })}
                          className="range range-primary"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Background Color</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full border border-base-300"
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
                </div>
              )}

              {/* Presets Tab */}
              {activeTab === "presets" && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="grid grid-cols-1 gap-4">
                      {presets.map((preset, index) => (
                        <button
                          key={index}
                          className="btn btn-outline justify-start h-auto py-4 normal-case"
                          onClick={() => applyPreset(preset)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div 
                              className="w-8 h-8 rounded-full" 
                              style={{ backgroundColor: preset.textColor }}
                            />
                            <div className="flex-1 text-left">
                              <p className="font-medium">{preset.name}</p>
                              <p className="text-xs opacity-70">
                                {preset.font.replace("font-", "")} • {preset.fontSize}px • Weight {preset.fontWeight}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title">Export Options</h3>
                <div className="space-y-4">
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
                        <span className="label-text">JPEG Quality: {Math.round(jpegQuality * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={jpegQuality}
                        onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                        className="range range-primary"
                      />
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-full"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Processing..." : "Download Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-md overflow-hidden">
              <div className="bg-base-200 p-4 border-b border-base-300">
                <h3 className="font-medium flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Preview
                </h3>
              </div>
              <div className="p-6 flex items-center justify-center bg-base-200 min-h-[500px]">
                <div
                  ref={previewRef}
                  className="relative overflow-hidden max-w-full max-h-full"
                  style={{
                    filter: `brightness(${state.brightness}) contrast(${state.contrast})`,
                  }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                  {state.useOverlay && <div className="absolute inset-0 bg-black bg-opacity-30" />}
                  <div
                    className="absolute"
                    style={{
                      top: `${state.position.y}%`,
                      left: `${state.position.x}%`,
                      transform: `translate(-50%, -50%) rotate(${state.rotation}deg)`,
                      color: state.textColor,
                      fontSize: `${state.fontSize}px`,
                      fontWeight: state.fontWeight,
                      opacity: state.opacity,
                      backgroundColor: state.backgroundColor,
                      padding: state.backgroundColor !== "transparent" ? "0.25em 0.5em" : "0",
                      fontFamily:
                        state.font === "font-montserrat"
                          ? "Montserrat, sans-serif"
                          : state.font === "font-roboto"
                            ? "Roboto, sans-serif"
                            : state.font === "font-poppins"
                              ? "Poppins, sans-serif"
                              : state.font === "font-playfair"
                                ? "Playfair Display, serif"
                                : "sans-serif",
                    }}
                  >
                    {state.text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
