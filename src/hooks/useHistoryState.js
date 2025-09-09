import { useCallback, useRef, useState } from 'react';
export default function useHistoryState(initial, limit) {
    if (limit === void 0) { limit = 50; }
    var _a = useState(initial), present = _a[0], setPresent = _a[1];
    var undoStack = useRef([]);
    var redoStack = useRef([]);
    var set = useCallback(function (next) {
        setPresent(function (prev) {
            var value = typeof next === 'function' ? next(prev) : next;
            undoStack.current.push(prev);
            if (undoStack.current.length > limit)
                undoStack.current.shift();
            redoStack.current = []; // clear redo chain on new change
            return value;
        });
    }, [limit]);
    var canUndo = undoStack.current.length > 0;
    var canRedo = redoStack.current.length > 0;
    var undo = useCallback(function () {
        if (!canUndo)
            return;
        setPresent(function (prev) {
            var last = undoStack.current.pop();
            redoStack.current.push(prev);
            return last;
        });
    }, [canUndo]);
    var redo = useCallback(function () {
        if (!canRedo)
            return;
        setPresent(function (prev) {
            var next = redoStack.current.pop();
            undoStack.current.push(prev);
            return next;
        });
    }, [canRedo]);
    return { state: present, set: set, undo: undo, redo: redo, canUndo: canUndo, canRedo: canRedo };
}
