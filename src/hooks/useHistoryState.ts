import { useCallback, useRef, useState } from 'react';

export default function useHistoryState<T>(initial: T, limit = 50) {
  const [present, setPresent] = useState<T>(initial);
  const undoStack = useRef<T[]>([]);
  const redoStack = useRef<T[]>([]);

  const set = useCallback((next: T | ((p: T) => T)) => {
    setPresent(prev => {
      const value = typeof next === 'function' ? (next as any)(prev) : next;
      undoStack.current.push(prev);
      if (undoStack.current.length > limit) undoStack.current.shift();
      redoStack.current = []; // clear redo chain on new change
      return value;
    });
  }, [limit]);

  const canUndo = undoStack.current.length > 0;
  const canRedo = redoStack.current.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    setPresent(prev => {
      const last = undoStack.current.pop()!;
      redoStack.current.push(prev);
      return last;
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    setPresent(prev => {
      const next = redoStack.current.pop()!;
      undoStack.current.push(prev);
      return next;
    });
  }, [canRedo]);

  return { state: present, set, undo, redo, canUndo, canRedo };
}
