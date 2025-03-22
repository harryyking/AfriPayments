'use client';

interface UndoRedoProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function UndoRedo({ undo, redo, canUndo, canRedo }: UndoRedoProps) {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`py-2 px-4 rounded transition ${
          canUndo
            ? 'bg-gray-500 text-white hover:bg-gray-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`py-2 px-4 rounded transition ${
          canRedo
            ? 'bg-gray-500 text-white hover:bg-gray-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Redo
      </button>
    </div>
  );
}