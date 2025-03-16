import { ChangeEvent } from 'react';

interface ThreadInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ThreadInput({ value, onChange }: ThreadInputProps) {
  return (
    <textarea
      className="textarea w-full"
      rows={5}
      placeholder="Paste an X thread URL or text here"
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
    />
  );
}