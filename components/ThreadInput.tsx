import { ChangeEvent } from 'react';

interface ThreadInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ThreadInput({ value, onChange }: ThreadInputProps) {
  return (
    <textarea
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={5}
      placeholder="Paste an X thread URL or text here"
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
    />
  );
}