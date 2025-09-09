// src/state/useTrip.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { computeBudget } from '@lib/budget';
import { loadTrip, saveTrip } from '@lib/storage';
export function useTrip(initial) {
    var _a = useState(loadTrip() || initial), trip = _a[0], setTrip = _a[1];
    var undoRef = useRef([]);
    var redoRef = useRef([]);
    var pushHistory = function (prev) {
        undoRef.current.push(prev);
        if (undoRef.current.length > 50)
            undoRef.current.shift();
        redoRef.current = [];
    };
    var set = function (updater) { return setTrip(function (prev) {
        var before = structuredClone(prev);
        var next = updater(before);
        next.updatedAt = Date.now();
        pushHistory(prev);
        return next;
    }); };
    var undo = function () {
        if (!undoRef.current.length)
            return;
        var prev = undoRef.current.pop();
        redoRef.current.push(trip);
        setTrip(prev);
    };
    var redo = function () {
        if (!redoRef.current.length)
            return;
        var next = redoRef.current.pop();
        undoRef.current.push(trip);
        setTrip(next);
    };
    useEffect(function () { saveTrip(trip); }, [trip]);
    var budget = useMemo(function () { return computeBudget(trip); }, [trip]);
    return { trip: trip, setTrip: set, undo: undo, redo: redo, budget: budget };
}
