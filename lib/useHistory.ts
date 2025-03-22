import { useState, useCallback } from 'react';
import { TextState } from '../types';

interface HistoryState<T> {
  state: T;
  addToHistory: (state: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory(initialState: TextState): HistoryState<TextState> {
  const [history, setHistory] = useState<TextState[]>([initialState]);
  const [index, setIndex] = useState<number>(0);

  const addToHistory = useCallback((state: TextState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, index + 1);
      newHistory.push(state);
      return newHistory;
    });
    setIndex((prev) => prev + 1);
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex((prev) => prev + 1);
    }
  }, [index, history.length]);

  return {
    state: history[index],
    addToHistory,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
}