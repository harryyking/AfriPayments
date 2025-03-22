"use client"

import type React from "react"

import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import { toast } from "react-hot-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useHistory } from "../lib/useHistory"
import type { TextState, Preset } from "../types"
import { Upload, ImageIcon, Type, Download, Undo2, Redo2, Palette, Sparkles } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Text Overlay Studio</h1>
          <p className="text-muted-foreground mt-2">Create stunning text overlays for your images</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Undo/Redo Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo} title="Undo">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo} title="Redo">
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Button variant="default" onClick={handleDownload} disabled={isDownloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Exporting..." : "Export"}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="text">
                  <Type className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger value="style">
                  <Palette className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Style</span>
                </TabsTrigger>
                <TabsTrigger value="presets">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Presets</span>
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 bg-muted hover:bg-accent transition cursor-pointer">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                          Choose Image
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brightness">Brightness</Label>
                        <Slider
                          id="brightness"
                          min={0.2}
                          max={2}
                          step={0.1}
                          value={[state.brightness]}
                          onValueChange={(value) => addToHistory({ ...state, brightness: value[0] })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contrast">Contrast</Label>
                        <Slider
                          id="contrast"
                          min={0.2}
                          max={2}
                          step={0.1}
                          value={[state.contrast]}
                          onValueChange={(value) => addToHistory({ ...state, contrast: value[0] })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="overlay"
                          checked={state.useOverlay}
                          onCheckedChange={(checked) => addToHistory({ ...state, useOverlay: checked })}
                        />
                        <Label htmlFor="overlay">Add dark overlay</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Text Tab */}
              <TabsContent value="text" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="text">Text Content</Label>
                        <Input
                          id="text"
                          value={state.text}
                          onChange={(e) => addToHistory({ ...state, text: e.target.value })}
                          placeholder="Enter your text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="font">Font Family</Label>
                        <Select value={state.font} onValueChange={(value) => addToHistory({ ...state, font: value })}>
                          <SelectTrigger id="font">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="font-montserrat">Montserrat</SelectItem>
                            <SelectItem value="font-roboto">Roboto</SelectItem>
                            <SelectItem value="font-poppins">Poppins</SelectItem>
                            <SelectItem value="font-playfair">Playfair Display</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="fontSize"
                            min={12}
                            max={120}
                            step={1}
                            value={[state.fontSize]}
                            onValueChange={(value) => addToHistory({ ...state, fontSize: value[0] })}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-right">{state.fontSize}px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fontWeight">Font Weight</Label>
                        <Select
                          value={state.fontWeight}
                          onValueChange={(value) => addToHistory({ ...state, fontWeight: value })}
                        >
                          <SelectTrigger id="fontWeight">
                            <SelectValue placeholder="Select weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semi-Bold (600)</SelectItem>
                            <SelectItem value="700">Bold (700)</SelectItem>
                            <SelectItem value="800">Extra Bold (800)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: state.textColor }}
                          />
                          <Input
                            id="textColor"
                            type="color"
                            value={state.textColor}
                            onChange={(e) => addToHistory({ ...state, textColor: e.target.value })}
                            className="w-full h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Style Tab */}
              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="position-x">Horizontal Position (%)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="position-x"
                            min={0}
                            max={100}
                            step={1}
                            value={[state.position.x]}
                            onValueChange={(value) =>
                              addToHistory({
                                ...state,
                                position: { ...state.position, x: value[0] },
                              })
                            }
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-right">{state.position.x}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position-y">Vertical Position (%)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="position-y"
                            min={0}
                            max={100}
                            step={1}
                            value={[state.position.y]}
                            onValueChange={(value) =>
                              addToHistory({
                                ...state,
                                position: { ...state.position, y: value[0] },
                              })
                            }
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-right">{state.position.y}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rotation">Rotation (degrees)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="rotation"
                            min={-180}
                            max={180}
                            step={1}
                            value={[state.rotation]}
                            onValueChange={(value) => addToHistory({ ...state, rotation: value[0] })}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-right">{state.rotation}°</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="opacity">Opacity</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="opacity"
                            min={0}
                            max={1}
                            step={0.05}
                            value={[state.opacity]}
                            onValueChange={(value) => addToHistory({ ...state, opacity: value[0] })}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-8 text-right">
                            {Math.round(state.opacity * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: state.backgroundColor }}
                          />
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={state.backgroundColor === "transparent" ? "#ffffff" : state.backgroundColor}
                            onChange={(e) => addToHistory({ ...state, backgroundColor: e.target.value })}
                            className="w-full h-10"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToHistory({ ...state, backgroundColor: "transparent" })}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Presets Tab */}
              <TabsContent value="presets" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-4">
                      {presets.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto py-4 justify-start"
                          onClick={() => applyPreset(preset)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: preset.textColor }} />
                            <div className="flex-1">
                              <p className="font-medium text-left">{preset.name}</p>
                              <p className="text-xs text-gray-500 text-left">
                                {preset.font.replace("font-", "")} • {preset.fontSize}px • Weight {preset.fontWeight}
                              </p>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Export Options */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Export Options</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileName">File Name</Label>
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value || "text-overlay-image")}
                      placeholder="Enter file name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Format</Label>
                    <Select value={exportFormat} onValueChange={(value: "png" | "jpeg") => setExportFormat(value)}>
                      <SelectTrigger id="exportFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {exportFormat === "jpeg" && (
                    <div className="space-y-2">
                      <Label htmlFor="jpegQuality">JPEG Quality: {Math.round(jpegQuality * 100)}%</Label>
                      <Slider
                        id="jpegQuality"
                        min={0.1}
                        max={1}
                        step={0.1}
                        value={[jpegQuality]}
                        onValueChange={(value) => setJpegQuality(value[0])}
                      />
                    </div>
                  )}

                  <Button className="w-full" onClick={handleDownload} disabled={isDownloading}>
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Processing..." : "Download Image"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-gray-100 border-b">
                  <h3 className="font-medium flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Preview
                  </h3>
                </div>
                <div className="p-6 flex items-center justify-center bg-muted dark:bg-muted min-h-[500px]">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

