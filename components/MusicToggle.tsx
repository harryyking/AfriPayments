import { ChangeEvent } from 'react';

interface MusicToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function MusicToggle({ checked, onChange }: MusicToggleProps) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        className="h-5 w-5"
        checked={checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
      />
      <span>Include Background Music</span>
    </label>
  );
}