import { TextState } from "../types";

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
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-lg">Text Settings</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Text Content</span>
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
            <span className="label-text">Text Color</span>
          </label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Font Size ({fontSize}px)</span>
          </label>
          <input
            type="range"
            min="12"
            max="120"
            step="1"
            value={fontSize}
            onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
            className="range range-primary"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Font Weight</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
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
            <span className="label-text">Font Family</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            <option value="font-montserrat">Montserrat</option>
            <option value="font-roboto">Roboto</option>
            <option value="font-poppins">Poppins</option>
            <option value="font-playfair">Playfair Display</option>
          </select>
        </div>
      </div>
    </div>
  );
}