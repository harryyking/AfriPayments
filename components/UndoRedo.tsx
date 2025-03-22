import { ArrowLeft, ArrowRight } from "lucide-react";

interface UndoRedoProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function UndoRedo({ undo, redo, canUndo, canRedo }: UndoRedoProps) {
  return (
    <div className="flex gap-2">
      <button
        className="btn btn-outline btn-sm"
        onClick={undo}
        disabled={!canUndo}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Undo
      </button>
      <button
        className="btn btn-outline btn-sm"
        onClick={redo}
        disabled={!canRedo}
      >
        <ArrowRight className="h-4 w-4 mr-2" />
        Redo
      </button>
    </div>
  );
}