'use client';

import { Preset } from '../types';

interface PresetsProps {
  applyPreset: (preset: Preset) => void;
}

export default function Presets({ applyPreset }: PresetsProps) {
  const presets: Preset[] = [
    {
      name: 'Bold Orange',
      textColor: '#ff6200',
      fontSize: 60,
      fontWeight: '700',
      font: 'font-montserrat',
      rotation: 0,
      opacity: 1,
      backgroundColor: 'transparent',
    },
    {
      name: 'Elegant White',
      textColor: '#ffffff',
      fontSize: 50,
      fontWeight: '400',
      font: 'font-poppins',
      rotation: 10,
      opacity: 0.9,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    {
      name: 'Modern Black',
      textColor: '#000000',
      fontSize: 70,
      fontWeight: '700',
      font: 'font-roboto',
      rotation: -5,
      opacity: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => applyPreset(preset)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}