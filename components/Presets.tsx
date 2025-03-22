import { Preset } from "../types";

interface PresetsProps {
  applyPreset: (preset: Preset) => void;
}

export default function Presets({ applyPreset }: PresetsProps) {
  const presets: Preset[] = [
    {
      name: "Centered Title",
      textColor: "#ffffff",
      fontSize: 80,
      fontWeight: "700",
      font: "font-montserrat",
      rotation: 0,
      opacity: 1,
      backgroundColor: "transparent",
    },
    {
      name: "Bottom Caption",
      textColor: "#000000",
      fontSize: 40,
      fontWeight: "400",
      font: "font-roboto",
      rotation: 0,
      opacity: 0.8,
      backgroundColor: "#ffffff",
    },
  ];

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-lg">Style Presets</h2>
        <div className="space-y-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              className="btn btn-outline w-full"
              onClick={() => applyPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}