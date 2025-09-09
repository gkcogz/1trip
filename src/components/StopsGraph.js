import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/StopsGraph.tsx
import { useMemo, useRef } from 'react';
import { EmojiButton } from './ui';
import { useI18n } from '../i18n';
var modeIcon = function (mode) {
    switch (mode) {
        case 'plane': return '✈️';
        case 'train': return '🚆';
        case 'bus': return '🚌';
        case 'car': return '🚗';
        default: return '•';
    }
};
export default function StopsGraph(_a) {
    var _b, _c;
    var trip = _a.trip, wrapperRef = _a.wrapperRef, activeStopId = _a.activeStopId, onActivate = _a.onActivate, onReset = _a.onReset;
    var t = useI18n().t;
    var stops = (_b = trip.stops) !== null && _b !== void 0 ? _b : [];
    var legs = (_c = trip.legs) !== null && _c !== void 0 ? _c : [];
    var n = stops.length;
    var PAD = 8;
    var xs = useMemo(function () { return stops.map(function (_, i) { return (n <= 1 ? 50 : PAD + (i * (100 - 2 * PAD)) / (n - 1)); }); }, [n, stops]);
    var legMode = function (i) {
        var _a, _b, _c;
        var from = (_a = stops[i]) === null || _a === void 0 ? void 0 : _a.id;
        var to = (_b = stops[i + 1]) === null || _b === void 0 ? void 0 : _b.id;
        return (_c = legs.find(function (l) { return l.fromStopId === from && l.toStopId === to; })) === null || _c === void 0 ? void 0 : _c.mode;
    };
    var graphRef = useRef(null);
    var handleNodeClick = function (index) {
        var id = stops[index].id;
        if (!graphRef.current || !wrapperRef.current) {
            onActivate(activeStopId === id ? null : id);
            return;
        }
        var g = graphRef.current.getBoundingClientRect();
        var w = wrapperRef.current.getBoundingClientRect();
        var cx = g.left - w.left + (xs[index] / 100) * g.width;
        var cy = g.top - w.top + g.height / 2;
        onActivate(activeStopId === id ? null : id, { x: cx, y: cy });
    };
    var Y = 33;
    var MASK_R = 2.25;
    var SEG_STROKE = 4;
    return (_jsxs("div", { className: "relative rounded-2xl bg-white border border-[var(--color-border)] shadow-sm p-4 overflow-visible", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("div", { className: "text-sm font-medium text-[var(--color-accent)]", children: t('graph.header') }), onReset && (_jsx(EmojiButton, { emoji: "\uD83D\uDDD1\uFE0F", label: t('common.reset'), title: t('graph.reset'), onClick: function () { return onReset(); }, variant: "btn", className: "!bg-red-600 hover:!bg-red-700 border-red-600 text-white px-3 py-1 rounded-lg" }))] }), _jsxs("div", { className: "relative w-full h-16", ref: graphRef, children: [_jsxs("svg", { viewBox: "0 0 100 100", className: "absolute inset-0 w-full h-full", preserveAspectRatio: "none", children: [n >= 2 && (_jsx("line", { x1: 8, y1: Y, x2: 100 - 8, y2: Y, stroke: "var(--color-border)", strokeWidth: "2", strokeLinecap: "round" })), n >= 2 && xs.slice(0, -1).map(function (x, i) {
                                var x2 = xs[i + 1];
                                return (_jsx("line", { x1: x, y1: Y, x2: x2, y2: Y, stroke: "var(--color-brand)", strokeWidth: SEG_STROKE, strokeLinecap: "round" }, "seg-".concat(i)));
                            }), xs.map(function (x, i) { return (_jsx("circle", { cx: x, cy: Y, r: MASK_R, fill: "white" }, "mask-".concat(i))); })] }), n >= 2 && xs.slice(0, -1).map(function (x, i) {
                        var x2 = xs[i + 1];
                        var mid = (x + x2) / 2;
                        var icon = modeIcon(legMode(i));
                        return (_jsx("span", { role: "img", "aria-label": "transport", className: "absolute -translate-x-1/2 -translate-y-1/2 select-none text-xl", style: { left: "".concat(mid, "%"), top: '50%' }, children: icon }, "icon-".concat(i)));
                    }), stops.map(function (s, i) {
                        var isActive = activeStopId === s.id;
                        return (_jsxs("button", { type: "button", title: s.city || "Stop ".concat(i + 1), onClick: function () { return handleNodeClick(i); }, className: "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group", style: { left: "".concat(xs[i], "%"), top: '50%' }, children: [_jsx("span", { className: 'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ' +
                                        (isActive
                                            ? 'bg-white border-[var(--color-brand)] shadow'
                                            : 'bg-white border-neutral-300 opacity-90 group-hover:opacity-100'), children: _jsx("span", { className: 'inline-block rounded-full w-3.5 h-3.5 ' +
                                            (isActive ? 'bg-[var(--color-brand)]' : 'bg-neutral-300') }) }), _jsx("span", { className: 'mt-2 text-[11px] leading-tight max-w-[120px] text-center truncate ' +
                                        (isActive ? 'text-[var(--color-accent)]' : 'text-neutral-500'), children: s.city || "Stop ".concat(i + 1) })] }, s.id));
                    })] })] }));
}
