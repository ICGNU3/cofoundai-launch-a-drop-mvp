
import { useState } from "react";

export function useUndoRedo<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const [state, setState] = useState<T>(initialState);

  const set = (next: T) => {
    setHistory((h) => (h.length > 8 ? [...h.slice(-8), state] : [...h, state]));
    setFuture([]);
    setState(next);
  };

  const undo = () => {
    setFuture((f) => [state, ...f]);
    setState(history[history.length - 1]);
    setHistory((h) => h.slice(0, h.length - 1));
  };

  const redo = () => {
    setHistory((h) => [...h, state]);
    setState(future[0]);
    setFuture((f) => f.slice(1));
  };

  return {
    state,
    set,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    setDirect: setState, // Set without storing history
  };
}
