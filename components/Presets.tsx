import { Preset } from "../types";

interface PresetsProps {
  applyPreset: (preset: Preset) => void;
}

const presets: Preset[] = [
  {
    name: "Bold Red",
    textColor: "#ff0000",
    fontSize: 60,
    fontWeight: "700",
    font: "font-montserrat",
    rotation: 0,
    opacity: 1,
    backgroundColor: "transparent",
  },
  {
    name: "Elegant Blue",
    textColor: "#0000ff",
    fontSize: 50,
    fontWeight: "400",
    font: "font-poppins",
    rotation: 10,
    opacity: 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  {
    name: "Modern Green",
    textColor: "#00ff00",
    fontSize: 55,
    fontWeight: "700",
    font: "font-roboto",
    rotation: -5,
    opacity: 0.8,
    backgroundColor: "transparent",
  },
];

export default function Presets({ applyPreset }: PresetsProps) {
  return (
    <div className="card  shadow-md p-6">
      <h2 className="text-lg font-medium flex items-center mb-4">
        <span className="h-5 w-5 mr-2 text-blue-500">Presets</span>
      </h2>
      <div className="space-y-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            className="btn btn-outline w-full"
            onClick={() => applyPreset(preset)}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}