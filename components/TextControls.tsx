'use client';

import { SketchPicker } from 'react-color';
import { fontOptions } from '../lib/font';
import { TextState } from '../types';

interface TextControlsProps {
  text: string;
  setText: (value: string) => void;
  textColor: string;
  setTextColor: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  fontWeight: string;
  setFontWeight: (value: string) => void;
  font: string;
  setFont: (value: string) => void;
  position: { x: number; y: number };
  setPosition: (value: { x: number; y: number }) => void;
  rotation: number;
  setRotation: (value: number) => void;
  opacity: number;
  setOpacity: (value: number) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  useOverlay: boolean;
  setUseOverlay: (value: boolean) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  addToHistory: (state: TextState) => void;
}

export default function TextControls({
  text,
  setText,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  fontWeight,
  setFontWeight,
  font,
  setFont,
  position,
  setPosition,
  rotation,
  setRotation,
  opacity,
  setOpacity,
  backgroundColor,
  setBackgroundColor,
  useOverlay,
  setUseOverlay,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  addToHistory,
}: TextControlsProps) {
  const handleChange = <K extends keyof TextState>(key: K, value: TextState[K]) => {
    const newState: TextState = {
      text,
      textColor,
      fontSize,
      fontWeight,
      font,
      position,
      rotation,
      opacity,
      backgroundColor,
      useOverlay,
      brightness,
      contrast,
      [key]: value,
    };
    addToHistory(newState);
    switch (key) {
      case 'text':
        setText(value as string);
        break;
      case 'textColor':
        setTextColor(value as string);
        break;
      case 'fontSize':
        setFontSize(value as number);
        break;
      case 'fontWeight':
        setFontWeight(value as string);
        break;
      case 'font':
        setFont(value as string);
        break;
      case 'position':
        setPosition(value as { x: number; y: number });
        break;
      case 'rotation':
        setRotation(value as number);
        break;
      case 'opacity':
        setOpacity(value as number);
        break;
      case 'backgroundColor':
        setBackgroundColor(value as string);
        break;
      case 'useOverlay':
        setUseOverlay(value as boolean);
        break;
      case 'brightness':
        setBrightness(value as number);
        break;
      case 'contrast':
        setContrast(value as number);
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {/* Text Input */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter text"
          className="border rounded p-2 w-48"
          aria-label="Text to overlay"
        />
      </div>

      {/* Font Size */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Font Size: {fontSize}px</label>
        <input
          type="range"
          min="20"
          max="120"
          value={fontSize}
          onChange={(e) => handleChange('fontSize', Number(e.target.value))}
          className="w-48"
          aria-label="Font size"
        />
      </div>

      {/* Font Weight */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Font Weight:</label>
        <select
          value={fontWeight}
          onChange={(e) => handleChange('fontWeight', e.target.value)}
          className="border rounded p-2 w-48"
          aria-label="Font weight"
        >
          <option value="400">Regular</option>
          <option value="700">Bold</option>
        </select>
      </div>

      {/* Font Family */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Font:</label>
        <select
          value={font}
          onChange={(e) => handleChange('font', e.target.value)}
          className="border rounded p-2 w-48"
          aria-label="Font family"
        >
          {fontOptions.map((fontOption) => (
            <option key={fontOption.value} value={fontOption.value}>
              {fontOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Text Color */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Text Color:</label>
        <SketchPicker
          color={textColor}
          onChangeComplete={(color) => handleChange('textColor', color.hex)}
        />
      </div>

      {/* Position X */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Position X:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.x}
          onChange={(e) =>
            handleChange('position', { ...position, x: Number(e.target.value) })
          }
          className="w-48"
          aria-label="Text position X"
        />
      </div>

      {/* Position Y */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Position Y:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.y}
          onChange={(e) =>
            handleChange('position', { ...position, y: Number(e.target.value) })
          }
          className="w-48"
          aria-label="Text position Y"
        />
      </div>

      {/* Rotation */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Rotation: {rotation}°</label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => handleChange('rotation', Number(e.target.value))}
          className="w-48"
          aria-label="Text rotation"
        />
      </div>

      {/* Opacity */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Opacity: {opacity}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => handleChange('opacity', Number(e.target.value))}
          className="w-48"
          aria-label="Text opacity"
        />
      </div>

      {/* Background Color */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Background Color:</label>
        <SketchPicker
          color={backgroundColor}
          onChangeComplete={(color) => handleChange('backgroundColor', color.hex)}
        />
      </div>

      {/* Overlay Toggle */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Use Overlay:</label>
        <input
          type="checkbox"
          checked={useOverlay}
          onChange={(e) => handleChange('useOverlay', e.target.checked)}
          className="w-5 h-5"
          aria-label="Toggle overlay"
        />
      </div>

      {/* Brightness */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Brightness: {brightness}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={brightness}
          onChange={(e) => handleChange('brightness', Number(e.target.value))}
          className="w-48"
          aria-label="Image brightness"
        />
      </div>

      {/* Contrast */}
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Contrast: {contrast}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={contrast}
          onChange={(e) => handleChange('contrast', Number(e.target.value))}
          className="w-48"
          aria-label="Image contrast"
        />
      </div>
    </div>
  );
}