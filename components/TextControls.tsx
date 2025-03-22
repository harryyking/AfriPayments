'use client';

import { SketchPicker } from 'react-color';
import { fontOptions } from '../lib/font';
import { TextState } from '../types';
import toast from 'react-hot-toast';

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
    console.log(`Updating ${key} to:`, value);

    if (
      (key === 'fontSize' || key === 'rotation' || key === 'opacity' || key === 'brightness' || key === 'contrast') &&
      (typeof value !== 'number' || isNaN(value))
    ) {
      console.error(`Invalid value for ${key}:`, value);
      toast.error(`Invalid value for ${key}. Please try again.`);
      return;
    }

    if (key === 'position' && (typeof value !== 'object' || !('x' in value) || !('y' in value))) {
      console.error('Invalid position value:', value);
      toast.error('Invalid position value. Please try again.');
      return;
    }

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
    try {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error updating ${key}:`, errorMessage);
      toast.error(`Failed to update ${key}: ${errorMessage}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Font Size: {fontSize}px</label>
        <input
          type="range"
          min="20"
          max="120"
          value={fontSize || 20}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('fontSize', newValue);
            }
          }}
          className="w-48"
          aria-label="Font size"
        />
      </div>
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
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Text Color:</label>
        <SketchPicker
          color={textColor || '#000000'}
          onChangeComplete={(color) => handleChange('textColor', color.hex)}
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Position X:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.x || 0}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('position', { ...position, x: newValue });
            }
          }}
          className="w-48"
          aria-label="Text position X"
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Position Y:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.y || 0}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('position', { ...position, y: newValue });
            }
          }}
          className="w-48"
          aria-label="Text position Y"
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Rotation: {rotation}°</label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation || 0}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('rotation', newValue);
            }
          }}
          className="w-48"
          aria-label="Text rotation"
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Opacity: {opacity}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('opacity', newValue);
            }
          }}
          className="w-48"
          aria-label="Text opacity"
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Background Color:</label>
        <SketchPicker
          color={backgroundColor || 'transparent'}
          onChangeComplete={(color) => handleChange('backgroundColor', color.hex)}
        />
      </div>
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
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Brightness: {brightness}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={brightness || 1}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('brightness', newValue);
            }
          }}
          className="w-48"
          aria-label="Image brightness"
        />
      </div>
      <div className="flex flex-col items-center">
        <label className="font-medium mb-1">Contrast: {contrast}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={contrast || 1}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              handleChange('contrast', newValue);
            }
          }}
          className="w-48"
          aria-label="Image contrast"
        />
      </div>
    </div>
  );
}