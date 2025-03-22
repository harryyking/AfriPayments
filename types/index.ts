export interface TextState {
  text: string;
  textColor: string;
  fontSize: number;
  fontWeight: string;
  font: string; // Now stores the font value (e.g., 'font-inter')
  position: { x: number; y: number };
  rotation: number;
  opacity: number;
  backgroundColor: string;
  useOverlay: boolean;
  brightness: number;
  contrast: number;
}

export interface Preset {
  name: string;
  textColor: string;
  fontSize: number;
  fontWeight: string;
  font: string; // Now stores the font value (e.g., 'font-inter')
  rotation: number;
  opacity: number;
  backgroundColor: string;
}