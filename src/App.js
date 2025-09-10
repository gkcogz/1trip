import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import Planner from "./pages/Planner";
import PrintPage from "./pages/PrintPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { uid } from "./lib/utils";
const DEFAULT_TRIP = {
    id: "t_" + uid(),
    ownerId: "local",
    title: "OneTrip",
    currency: "EUR",
    participants: 1,
    stops: [],
    legs: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
};
const HISTORY_LIMIT = 60;
const App = () => {
    const location = useLocation();
    const isPrint = location.pathname.startsWith("/print");
    const [trip, setTrip] = useState(DEFAULT_TRIP);
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
    const setTripField = (field, value) => setTripWithHistory(tr => ({
        ...tr,
        [field]: field === "participants" ? Math.max(1, Number(value) || 1) : value,
        updatedAt: Date.now(),
    }));
    const handleImportJSON = (f) => {
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
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [!isPrint && (_jsx(Topbar, { trip: trip, setTripField: setTripField, onUndo: undo, onRedo: redo, onImportJSON: handleImportJSON })), _jsx("main", { className: "flex-1", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/planner", replace: true }) }), _jsx(Route, { path: "/planner", element: _jsx(Planner, { trip: trip, setTrip: setTripWithHistory }) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/print", element: _jsx(PrintPage, { trip: trip }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/planner", replace: true }) })] }) })] }));
};
export default App;
