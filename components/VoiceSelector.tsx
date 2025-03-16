import { ChangeEvent } from 'react';

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  return (
    <select
      className=" select select-primary w-full p-3"
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
      <option value="21m00Tcm4TlvDq8ikWAM">Adam - Casual Male</option>
      <option value="pNInz6obpgDQGcFmaJgB">Rachel - Professional Female</option>
      {/* Add more ElevenLabs voice IDs as needed */}
    </select>
  );
}