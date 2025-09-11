import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Planner.tsx
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { uid, clamp } from "../lib/utils";
import BudgetPanel from "../components/BudgetPanel";
import StopsTimeline from "../components/StopsTimeline";
import StopSidebar from "../components/StopSidebar";
import { useI18n } from "../i18n";
import Topbar from "../components/Topbar";
import PrintSheet from "../components/PrintSheet";
const STORAGE_KEY = "onetrip_saved_trip";
const HISTORY_LIMIT = 60;
function loadTrip(initial) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initial;
    }
    catch {
        return initial;
    }
}
export default function PlannerWrapper({ printMode = false }) {
    const defaultTrip = {
        id: "trip_" + uid(),
        title: "",
        currency: "EUR",
        participants: 1,
        stops: [],
        legs: [],
        updatedAt: Date.now(),
        ownerId: "local",
        createdAt: Date.now(),
    };
    const location = useLocation();
    const passedTrip = location.state?.trip;
    const [trip, setTrip] = useState(() => passedTrip ? passedTrip : loadTrip(defaultTrip));
    // her değişiklikte localStorage’a yaz
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
        }
        catch { }
    }, [trip]);
    // --- history stacks ---
    const undoStack = useRef([]);
    const redoStack = useRef([]);
    const setTripWithHistory = (next) => {
        setTrip(prev => {
            const value = typeof next === "function" ? next(prev) : next;
            undoStack.current.push(prev);
            if (undoStack.current.length > HISTORY_LIMIT)
                undoStack.current.shift();
            redoStack.current = [];
            return value;
        });
    };
    const undo = () => {
        if (!undoStack.current.length)
            return;
        setTrip(curr => {
            const prev = undoStack.current.pop();
            redoStack.current.push(curr);
            return prev;
        });
    };
    const redo = () => {
        if (!redoStack.current.length)
            return;
        setTrip(curr => {
            const next = redoStack.current.pop();
            undoStack.current.push(curr);
            return next;
        });
    };
    const setTripField = (field, value) => setTripWithHistory(trip => {
        const newTrip = {
            ...trip,
            [field]: field === "participants" ? Math.max(1, Number(value) || 1) : value,
            updatedAt: Date.now(),
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrip));
        }
        catch { }
        return newTrip;
    });
    // ✅ Print sayfası için doğrudan PrintSheet render
    if (printMode) {
        return _jsx(PrintSheet, { trip: trip });
    }
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Topbar, { trip: trip, setTripField: setTripField, onUndo: undo, onRedo: redo, onImportJSON: (f) => {
                    const r = new FileReader();
                    r.onload = () => {
                        try {
                            const parsed = JSON.parse(String(r.result));
                            setTrip(parsed);
                        }
                        catch {
                            alert("Invalid JSON file");
                        }
                    };
                    r.readAsText(f);
                } }), _jsx("main", { className: "flex-1", children: _jsx(Planner, { trip: trip, setTrip: setTripWithHistory }) })] }));
}
function Planner({ trip, setTrip }) {
    const { t } = useI18n();
    const [selectedStopId, setSelectedStopId] = useState(null);
    // --- mutation helpers ---
    const addStop = () => setTrip(trip => {
        const sId = "s_" + uid();
        const newStop = {
            id: sId,
            city: "",
            stayNights: 2,
            activities: [],
            budget: {},
        };
        const stops = [...trip.stops, newStop];
        const legs = [...trip.legs];
        const prev = stops.length >= 2 ? stops[stops.length - 2] : undefined;
        if (prev)
            legs.push({
                id: "l_" + uid(),
                fromStopId: prev.id,
                toStopId: sId,
                mode: "train",
                cost: 0,
            });
        return { ...trip, stops, legs, updatedAt: Date.now() };
    });
    const deleteStop = (stopId) => setTrip(trip => {
        const stops = trip.stops.filter(s => s.id !== stopId);
        const legs = [];
        for (let i = 0; i < stops.length - 1; i++) {
            legs.push({
                id: "l_" + uid(),
                fromStopId: stops[i].id,
                toStopId: stops[i + 1].id,
                mode: "train",
                cost: 0,
            });
        }
        if (selectedStopId === stopId)
            setSelectedStopId(null);
        return { ...trip, stops, legs, updatedAt: Date.now() };
    });
    const moveStop = (stopId, dir) => setTrip(trip => {
        const i = trip.stops.findIndex(s => s.id === stopId);
        if (i < 0)
            return trip;
        const j = clamp(i + (dir === "up" ? -1 : 1), 0, trip.stops.length - 1);
        if (i === j)
            return trip;
        const stops = [...trip.stops];
        const [s] = stops.splice(i, 1);
        stops.splice(j, 0, s);
        const legs = [];
        for (let k = 0; k < stops.length - 1; k++) {
            legs.push({
                id: "l_" + uid(),
                fromStopId: stops[k].id,
                toStopId: stops[k + 1].id,
                mode: "train",
                cost: 0,
            });
        }
        return { ...trip, stops, legs, updatedAt: Date.now() };
    });
    const setStopField = (stopId, field, value) => setTrip(trip => {
        const stops = trip.stops.map(s => s.id !== stopId
            ? s
            : {
                ...s,
                [field]: field === "stayNights" ? Number(value) || 0 : value,
            });
        return { ...trip, stops, updatedAt: Date.now() };
    });
    const setLegField = (legId, field, value) => setTrip(trip => {
        const legs = trip.legs.map(l => l.id !== legId
            ? l
            : {
                ...l,
                [field]: field === "cost" ? Number(value) || 0 : value,
            });
        return { ...trip, legs, updatedAt: Date.now() };
    });
    const addActivity = (stopId) => setTrip(trip => {
        const stops = trip.stops.map(s => s.id !== stopId
            ? s
            : {
                ...s,
                activities: [
                    ...s.activities,
                    {
                        id: "a_" + uid(),
                        title: t("planner.newActivity"),
                        category: "other",
                        cost: 0,
                    },
                ],
            });
        return { ...trip, stops, updatedAt: Date.now() };
    });
    const setActivityField = (stopId, actId, field, value) => setTrip(trip => {
        const stops = trip.stops.map(s => s.id !== stopId
            ? s
            : {
                ...s,
                activities: s.activities.map(a => a.id !== actId
                    ? a
                    : {
                        ...a,
                        [field]: field === "cost" ? Number(value) || 0 : value,
                    }),
            });
        return { ...trip, stops, updatedAt: Date.now() };
    });
    const deleteActivity = (stopId, actId) => setTrip(trip => {
        const stops = trip.stops.map(s => s.id !== stopId
            ? s
            : {
                ...s,
                activities: s.activities.filter(a => a.id !== actId),
            });
        return { ...trip, stops, updatedAt: Date.now() };
    });
    return (_jsxs("div", { className: "min-h-screen text-[var(--color-ink)]", children: [_jsxs("div", { className: "mx-auto max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 print:hidden", children: [_jsx("div", { className: "space-y-4", children: _jsx(StopsTimeline, { trip: trip, addStop: addStop, setStopField: setStopField, setSelectedStopId: setSelectedStopId, deleteStop: deleteStop, moveStop: moveStop, setLegField: setLegField, setTripField: (f, v) => setTrip(tr => ({ ...tr, [f]: v, updatedAt: Date.now() })) }) }), _jsx("aside", { className: "lg:sticky lg:top-24 h-max", children: _jsx(BudgetPanel, { trip: trip }) })] }), _jsx("p", { className: "text-sm text-gray-500 mt-4 italic text-center print:hidden", children: t("planner.autosave") }), _jsx("div", { className: "print:hidden", children: _jsx(StopSidebar, { trip: trip, selectedStopId: selectedStopId, setSelectedStopId: setSelectedStopId, addActivity: addActivity, setActivityField: setActivityField, deleteActivity: deleteActivity, setStopField: setStopField }) }), _jsx("footer", { className: "border-t border-[var(--color-border)] mt-8 print:hidden", children: _jsxs("div", { className: "mx-auto max-w-7xl p-6 flex flex-col items-center justify-center text-sm opacity-80", children: ["\u00A9 ", new Date().getFullYear(), " OneTrip \u2014 ", t("planner.motto")] }) })] }));
}
