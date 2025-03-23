import { useEffect, useState } from "react";
import { convertColorToHex } from "../lib/colorUtils";
import { fontOptions, getFontByValue } from "@/lib/font"; // Import the font library

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
}: TextControlsProps) {
  const [availableWeights, setAvailableWeights] = useState<string[]>([]);

  // Update available weights when the font changes
  useEffect(() => {
    const selectedFont = getFontByValue(font);
    if (selectedFont) {
      setAvailableWeights(selectedFont.availableWeights);
      // Ensure the current fontWeight is supported by the new font
      if (!selectedFont.availableWeights.includes(fontWeight)) {
        setFontWeight(selectedFont.availableWeights[0]); // Default to the first available weight
      }
    }
  }, [font, fontWeight, setFontWeight]);

  return (
    <div className="card bg-white shadow-md p-6">
      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Text Content</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Text Color</span>
          </label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(convertColorToHex(e.target.value))}
            className="w-full h-10"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Font Size</span>
            <span className="label-text-alt">{fontSize}px</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={fontSize}
            onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
            className="range range-primary"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Font Weight</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
            disabled={availableWeights.length <= 1} // Disable if only one weight is available
          >
            {availableWeights.map((weight) => (
              <option key={weight} value={weight}>
                {weight === "400" ? "Normal" : weight === "700" ? "Bold" : weight}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Font Family</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            {fontOptions.map((fontOption) => (
              <option key={fontOption.value} value={fontOption.fontObject.className}>
                {fontOption.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}