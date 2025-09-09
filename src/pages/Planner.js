var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Planner.tsx
import { useRef, useState } from 'react';
import { uid, clamp } from '../lib/utils';
import Topbar from '../components/Topbar';
import BudgetPanel from '../components/BudgetPanel';
import StopsTimeline from '../components/StopsTimeline';
import StopSidebar from '../components/StopSidebar';
import { useI18n } from '../i18n';
export default function Planner(_a) {
    var trip = _a.trip, setTrip = _a.setTrip;
    var t = useI18n().t;
    var _b = useState(null), selectedStopId = _b[0], setSelectedStopId = _b[1];
    // --- history stacks ---
    var undoStack = useRef([]);
    var redoStack = useRef([]);
    var HISTORY_LIMIT = 60;
    // history-aware setter
    var setTripWithHistory = function (next) {
        setTrip(function (prev) {
            var value = typeof next === 'function' ? next(prev) : next;
            undoStack.current.push(prev);
            if (undoStack.current.length > HISTORY_LIMIT)
                undoStack.current.shift();
            redoStack.current = [];
            return value;
        });
    };
    var undo = function () {
        if (undoStack.current.length === 0)
            return;
        setTrip(function (curr) {
            var prev = undoStack.current.pop();
            redoStack.current.push(curr);
            return prev;
        });
        setSelectedStopId(null);
    };
    var redo = function () {
        if (redoStack.current.length === 0)
            return;
        setTrip(function (curr) {
            var next = redoStack.current.pop();
            undoStack.current.push(curr);
            return next;
        });
        setSelectedStopId(null);
    };
    // --- mutation helpers ---
    var setTripField = function (field, value) {
        return setTripWithHistory(function (trip) {
            var _a;
            return (__assign(__assign({}, trip), (_a = {}, _a[field] = field === 'participants' ? Math.max(1, Number(value) || 1) : value, _a.updatedAt = Date.now(), _a)));
        });
    };
    var addStop = function () {
        return setTripWithHistory(function (trip) {
            var sId = 's_' + uid();
            var newStop = {
                id: sId,
                city: '',
                stayNights: 2,
                activities: [],
                budget: {},
            };
            var stops = __spreadArray(__spreadArray([], trip.stops, true), [newStop], false);
            var legs = __spreadArray([], trip.legs, true);
            var prev = stops.length >= 2 ? stops[stops.length - 2] : undefined;
            if (prev)
                legs.push({
                    id: 'l_' + uid(),
                    fromStopId: prev.id,
                    toStopId: sId,
                    mode: 'train',
                    cost: 0,
                });
            return __assign(__assign({}, trip), { stops: stops, legs: legs, updatedAt: Date.now() });
        });
    };
    var deleteStop = function (stopId) {
        return setTripWithHistory(function (trip) {
            var stops = trip.stops.filter(function (s) { return s.id !== stopId; });
            var legs = [];
            for (var i = 0; i < stops.length - 1; i++) {
                legs.push({
                    id: 'l_' + uid(),
                    fromStopId: stops[i].id,
                    toStopId: stops[i + 1].id,
                    mode: 'train',
                    cost: 0,
                });
            }
            if (selectedStopId === stopId)
                setSelectedStopId(null);
            return __assign(__assign({}, trip), { stops: stops, legs: legs, updatedAt: Date.now() });
        });
    };
    var moveStop = function (stopId, dir) {
        return setTripWithHistory(function (trip) {
            var i = trip.stops.findIndex(function (s) { return s.id === stopId; });
            if (i < 0)
                return trip;
            var j = clamp(i + (dir === 'up' ? -1 : 1), 0, trip.stops.length - 1);
            if (i === j)
                return trip;
            var stops = __spreadArray([], trip.stops, true);
            var s = stops.splice(i, 1)[0];
            stops.splice(j, 0, s);
            var legs = [];
            for (var k = 0; k < stops.length - 1; k++) {
                legs.push({
                    id: 'l_' + uid(),
                    fromStopId: stops[k].id,
                    toStopId: stops[k + 1].id,
                    mode: 'train',
                    cost: 0,
                });
            }
            return __assign(__assign({}, trip), { stops: stops, legs: legs, updatedAt: Date.now() });
        });
    };
    var setStopField = function (stopId, field, value) {
        return setTripWithHistory(function (trip) {
            var stops = trip.stops.map(function (s) {
                var _a;
                return s.id !== stopId
                    ? s
                    : __assign(__assign({}, s), (_a = {}, _a[field] = field === 'stayNights' ? Number(value) || 0 : value, _a));
            });
            return __assign(__assign({}, trip), { stops: stops, updatedAt: Date.now() });
        });
    };
    var setLegField = function (legId, field, value) {
        return setTripWithHistory(function (trip) {
            var legs = trip.legs.map(function (l) {
                var _a;
                return l.id !== legId
                    ? l
                    : __assign(__assign({}, l), (_a = {}, _a[field] = field === 'cost' ? Number(value) || 0 : value, _a));
            });
            return __assign(__assign({}, trip), { legs: legs, updatedAt: Date.now() });
        });
    };
    var addActivity = function (stopId) {
        return setTripWithHistory(function (trip) {
            var stops = trip.stops.map(function (s) {
                return s.id !== stopId
                    ? s
                    : __assign(__assign({}, s), { activities: __spreadArray(__spreadArray([], s.activities, true), [
                            {
                                id: 'a_' + uid(),
                                title: t('planner.newActivity'),
                                category: 'other',
                                cost: 0,
                            },
                        ], false) });
            });
            return __assign(__assign({}, trip), { stops: stops, updatedAt: Date.now() });
        });
    };
    var setActivityField = function (stopId, actId, field, value) {
        return setTripWithHistory(function (trip) {
            var stops = trip.stops.map(function (s) {
                return s.id !== stopId
                    ? s
                    : __assign(__assign({}, s), { activities: s.activities.map(function (a) {
                            var _a;
                            return a.id !== actId
                                ? a
                                : __assign(__assign({}, a), (_a = {}, _a[field] = field === 'cost' ? Number(value) || 0 : value, _a));
                        }) });
            });
            return __assign(__assign({}, trip), { stops: stops, updatedAt: Date.now() });
        });
    };
    var deleteActivity = function (stopId, actId) {
        return setTripWithHistory(function (trip) {
            var stops = trip.stops.map(function (s) {
                return s.id !== stopId
                    ? s
                    : __assign(__assign({}, s), { activities: s.activities.filter(function (a) { return a.id !== actId; }) });
            });
            return __assign(__assign({}, trip), { stops: stops, updatedAt: Date.now() });
        });
    };
    return (_jsxs("div", { className: "min-h-screen text-[var(--color-ink)]", children: [_jsx(Topbar, { trip: trip, setTripField: setTripField, onUndo: undo, onRedo: redo, onImportJSON: function (f) {
                    var r = new FileReader();
                    r.onload = function () {
                        try {
                            var parsed = JSON.parse(String(r.result));
                            setTrip(parsed);
                        }
                        catch (_a) {
                            alert(t('planner.jsonError'));
                        }
                    };
                    r.readAsText(f);
                } }), _jsxs("div", { className: "mx-auto max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 print:hidden", children: [_jsx("div", { className: "space-y-4", children: _jsx(StopsTimeline, { trip: trip, addStop: addStop, setStopField: setStopField, setSelectedStopId: setSelectedStopId, deleteStop: deleteStop, moveStop: moveStop, setLegField: setLegField, setTripField: setTripField }) }), _jsx("aside", { className: "lg:sticky lg:top-24 h-max", children: _jsx(BudgetPanel, { trip: trip }) })] }), _jsx("div", { className: "print:hidden", children: _jsx(StopSidebar, { trip: trip, selectedStopId: selectedStopId, setSelectedStopId: setSelectedStopId, addActivity: addActivity, setActivityField: setActivityField, deleteActivity: deleteActivity, setStopField: setStopField }) }), _jsx("footer", { className: "border-t border-[var(--color-border)] mt-8 print:hidden", children: _jsxs("div", { className: "mx-auto max-w-7xl p-6 flex flex-col items-center justify-center text-sm opacity-80", children: ["\u00A9 ", new Date().getFullYear(), " OneTrip \u2014 ", t('planner.motto')] }) })] }));
}
