'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import TextControls from '../components/TextControls';
import ImagePreview from '../components/ImagePreview';
import Presets from '../components/Presets';
import UndoRedo from '../components/UndoRedo';
import { useHistory } from '../lib/useHistory';
import { TextState, Preset } from '../types';

export default function Home() {
  const [image, setImage] = useState<string>('/default-image.jpg');
  const initialTextState: TextState = {
    text: 'ride',
    textColor: '#ff6200',
    fontSize: 60,
    fontWeight: '700',
    font: 'font-montserrat',
    position: { x: 50, y: 20 },
    rotation: 0,
    opacity: 1,
    backgroundColor: 'transparent',
    useOverlay: false,
    brightness: 1,
    contrast: 1,
  };
  const { state, addToHistory, undo, redo, canUndo, canRedo } = useHistory(initialTextState);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('text-overlay-image');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (!previewRef.current) throw new Error('Preview not available');

      // Wait for fonts to load to ensure they render correctly
      await document.fonts.ready;

      const canvas = await html2canvas(previewRef.current, { useCORS: true });
      const link = document.createElement('a');
      const format = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality = exportFormat === 'jpeg' ? jpegQuality : undefined;
      link.href = canvas.toDataURL(format, quality);
      link.download = `${fileName}.${exportFormat}`;
      link.click();
      toast.success('Image downloaded successfully');
      if (image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to download image: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

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
    };
    addToHistory(newState);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Text Overlay Tool</h1>

      {/* Image Uploader */}
      <div className="flex justify-center mb-6">
        <ImageUploader onImageChange={setImage} />
      </div>

      {/* Presets */}
      <Presets applyPreset={applyPreset} />

      {/* Undo/Redo */}
      <UndoRedo undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />

      {/* Text Controls */}
      <TextControls
        text={state.text}
        setText={(value) => addToHistory({ ...state, text: value })}
        textColor={state.textColor}
        setTextColor={(value) => addToHistory({ ...state, textColor: value })}
        fontSize={state.fontSize}
        setFontSize={(value) => addToHistory({ ...state, fontSize: value })}
        fontWeight={state.fontWeight}
        setFontWeight={(value) => addToHistory({ ...state, fontWeight: value })}
        font={state.font}
        setFont={(value) => addToHistory({ ...state, font: value })}
        position={state.position}
        setPosition={(value) => addToHistory({ ...state, position: value })}
        rotation={state.rotation}
        setRotation={(value) => addToHistory({ ...state, rotation: value })}
        opacity={state.opacity}
        setOpacity={(value) => addToHistory({ ...state, opacity: value })}
        backgroundColor={state.backgroundColor}
        setBackgroundColor={(value) => addToHistory({ ...state, backgroundColor: value })}
        useOverlay={state.useOverlay}
        setUseOverlay={(value) => addToHistory({ ...state, useOverlay: value })}
        brightness={state.brightness}
        setBrightness={(value) => addToHistory({ ...state, brightness: value })}
        contrast={state.contrast}
        setContrast={(value) => addToHistory({ ...state, contrast: value })}
        addToHistory={addToHistory}
      />

      {/* Image Preview */}
      <ImagePreview
        image={image}
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

      {/* Export Options */}
      <div className="flex flex-col items-center mt-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* File Name */}
          <div className="flex flex-col items-center">
            <label className="font-medium mb-1">File Name:</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value || 'text-overlay-image')}
              className="border rounded p-2 w-48"
              aria-label="Export file name"
            />
          </div>

          {/* Export Format */}
          <div className="flex flex-col items-center">
            <label className="font-medium mb-1">Format:</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'png' | 'jpeg')}
              className="border rounded p-2 w-48"
              aria-label="Export format"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          {/* JPEG Quality (only shown if format is JPEG) */}
          {exportFormat === 'jpeg' && (
            <div className="flex flex-col items-center">
              <label className="font-medium mb-1">JPEG Quality: {jpegQuality}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={jpegQuality}
                onChange={(e) => setJpegQuality(Number(e.target.value))}
                className="w-48"
                aria-label="JPEG quality"
              />
            </div>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600 transition ${
            isDownloading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isDownloading ? 'Downloading...' : 'Download Image'}
        </button>
      </div>
    </div>
  );
}