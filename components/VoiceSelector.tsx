import { ChangeEvent } from 'react';

interface Voice {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  const voices: Voice[] = [
    {
      id: "nPczCjzI2devNBz1zQrb",
      name: "Brian",
      emoji: "👨‍💼",
      description: "Professional and clear male voice"
    },
    {
      id: "21m00Tcm4TlvDq8ikWAM",
      name: "Rachel",
      emoji: "👩‍💼",
      description: "Warm and articulate female voice"
    },
    {
      id: "AZnzlk1XvdvUeBnXmlld",
      name: "Sam",
      emoji: "🧑‍🚀",
      description: "Energetic and engaging narrator"
    },
    {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Emily",
      emoji: "👩‍🎓",
      description: "Youthful and enthusiastic female voice"
    }
  ];

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg">Choose a voice</span>
      </label>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className={`flex flex-col items-center border rounded-xl p-4 cursor-pointer transition-all hover:bg-primary/10 ${
              value === voice.id ? "bg-primary/20 border-primary" : "border-base-300"
            }`}
            onClick={() => onChange(voice.id)}
          >
            <div className="text-4xl mb-2">{voice.emoji}</div>
            <div className="font-medium text-center">{voice.name}</div>
            <div className="text-xs text-center mt-1 opacity-70">{voice.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}