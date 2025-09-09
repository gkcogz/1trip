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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import Planner from "./pages/Planner";
import PrintSheet from "./components/PrintSheet";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { uid } from "./lib/utils";
// default trip for initialization
var DEFAULT_TRIP = {
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
var App = function () {
    var location = useLocation();
    var isPlanner = location.pathname.startsWith("/planner");
    // shared trip state
    var _a = useState(DEFAULT_TRIP), trip = _a[0], setTrip = _a[1];
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [!isPlanner && (_jsx(Topbar, { trip: trip, setTripField: function (f, v) {
                    return setTrip(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[f] = v, _a.updatedAt = Date.now(), _a)));
                    });
                } })), _jsx("main", { className: "flex-1", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/planner", replace: true }) }), _jsx(Route, { path: "/planner", element: _jsx(Planner, { trip: trip, setTrip: setTrip }) }), _jsx(Route, { path: "/print", element: _jsx(PrintSheet, { trip: trip }) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/planner", replace: true }) })] }) })] }));
};
export default App;
