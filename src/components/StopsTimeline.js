import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/StopsTimeline.tsx
import { useEffect, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';
import LegEditor from './LegEditor';
import StopsGraph from './StopsGraph';
import { EmojiButton } from './ui';
import { useI18n } from '../i18n';
export default function StopsTimeline(_a) {
    var _b, _c;
    var trip = _a.trip, addStop = _a.addStop, setStopField = _a.setStopField, setSelectedStopId = _a.setSelectedStopId, deleteStop = _a.deleteStop, moveStop = _a.moveStop, setLegField = _a.setLegField, setTripField = _a.setTripField;
    var t = useI18n().t;
    var _d = useState(null), activeStopId = _d[0], setActiveStopId = _d[1];
    var _e = useState(null), mountingId = _e[0], setMountingId = _e[1];
    var wrapperRef = useRef(null);
    var cardRefs = useRef({});
    var setCardRef = function (id) { return function (el) {
        cardRefs.current[id] = el;
    }; };
    // open new stop + prevent flicker
    var prevCountRef = useRef((_c = (_b = trip.stops) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0);
    useEffect(function () {
        var _a, _b;
        var prev = prevCountRef.current;
        var curr = (_b = (_a = trip.stops) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        if (curr > prev && curr > 0) {
            var newStop_1 = trip.stops[curr - 1];
            setSelectedStopId(null);
            setActiveStopId(newStop_1.id);
            setMountingId(newStop_1.id);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { return setMountingId(null); });
            });
            setTimeout(function () {
                var _a;
                (_a = cardRefs.current[newStop_1.id]) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 0);
        }
        prevCountRef.current = curr;
    }, [trip.stops, setSelectedStopId]);
    // close panel if active stop removed
    useEffect(function () {
        var _a;
        if (!activeStopId)
            return;
        var stillThere = ((_a = trip.stops) !== null && _a !== void 0 ? _a : []).some(function (s) { return s.id === activeStopId; });
        if (!stillThere)
            setActiveStopId(null);
    }, [trip.stops, activeStopId]);
    var handleAddStop = function () {
        setSelectedStopId(null);
        addStop();
    };
    var handleActivateFromGraph = function (id) {
        if (!id) {
            setActiveStopId(null);
            return;
        }
        setActiveStopId(function (prev) { return (prev === id ? null : id); });
        var el = cardRefs.current[id];
        if (el)
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    var handleResetTrip = function () {
        setActiveStopId(null);
        setSelectedStopId(null);
        setTripField('stops', []);
        setTripField('legs', []);
    };
    var confirmAndReset = function () {
        if (window.confirm(t('reset.text')))
            handleResetTrip();
    };
    return (_jsxs("div", { className: "relative space-y-4", ref: wrapperRef, children: [_jsx(SectionHeader, { title: t('stops.header'), action: _jsx(EmojiButton, { emoji: "\u2795", label: t('stops.add'), title: t('stops.add'), onClick: handleAddStop, variant: "btn" }) }), trip.stops.length > 0 && (_jsx(StopsGraph, { trip: trip, wrapperRef: wrapperRef, activeStopId: activeStopId, onActivate: handleActivateFromGraph, onReset: confirmAndReset })), trip.stops.length === 0 && (_jsx("div", { className: "rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center text-[var(--color-muted)]", children: t('stops.none') })), trip.stops.map(function (s, i) {
                if (!activeStopId || s.id !== activeStopId)
                    return null;
                var nights = s.stayNights || 0;
                var b = s.budget || {};
                var lodgingTotal = typeof b.lodgingTotal === 'number'
                    ? b.lodgingTotal
                    : (b.lodgingPerNight || 0) * nights;
                var mounting = mountingId === s.id;
                return (_jsxs("div", { ref: setCardRef(s.id), className: 'rounded-2xl bg-white border border-[var(--color-border)] shadow-md ring-2 ring-[var(--color-brand)] ' +
                        'transition-opacity transition-transform duration-200 ease-out ' +
                        (mounting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'), children: [_jsxs("div", { className: "p-4 flex items-center gap-4", children: [_jsx(EmojiButton, { emoji: "\u2B06\uFE0F", label: t('stops.up'), title: t('stops.up'), onClick: function () { return moveStop(s.id, 'up'); }, variant: "ghost" }), _jsx(EmojiButton, { emoji: "\u2B07\uFE0F", label: t('stops.down'), title: t('stops.down'), onClick: function () { return moveStop(s.id, 'down'); }, variant: "ghost" }), _jsx("input", { value: s.city, onChange: function (e) { return setStopField(s.id, 'city', e.target.value); }, placeholder: t('stops.city.placeholder'), className: "flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none" }), _jsxs("label", { className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white", children: [_jsx("span", { children: t('stops.stayNights') }), _jsx("input", { type: "number", inputMode: "numeric", min: 0, value: s.stayNights, onFocus: function (e) { return e.currentTarget.select(); }, onChange: function (e) { return setStopField(s.id, 'stayNights', Number(e.target.value) || 0); }, className: "w-20 bg-transparent outline-none" })] }), _jsx(EmojiButton, { emoji: "\uD83E\uDDFA", label: t('stops.activities'), title: t('stops.activities'), onClick: function () { return setSelectedStopId(s.id); }, variant: "btn" }), _jsx(EmojiButton, { emoji: "\uD83D\uDDD1", label: t('stops.delete'), title: t('stops.delete'), onClick: function () {
                                        deleteStop(s.id);
                                    }, variant: "btn", className: "!bg-red-600 hover:!bg-red-700 border-red-600" })] }), i < trip.stops.length - 1 && (_jsx(LegEditor, { leg: trip.legs.find(function (l) { return l.fromStopId === s.id && l.toStopId === trip.stops[i + 1].id; }), setLegField: setLegField })), _jsxs("div", { className: "px-4 pb-4 text-sm text-neutral-600 flex flex-wrap gap-2", children: [_jsxs("span", { className: "tag", children: [t('stops.tag.activities'), ": ", s.activities.length] }), lodgingTotal > 0 && _jsx("span", { className: "tag", children: t('stops.tag.lodging', { v: String(lodgingTotal) }) }), typeof b.foodPerDay === 'number' && b.foodPerDay > 0 && (_jsx("span", { className: "tag", children: t('stops.tag.food', { v: String(b.foodPerDay) }) })), typeof b.other === 'number' && b.other > 0 && (_jsx("span", { className: "tag", children: t('stops.tag.other', { v: String(b.other) }) }))] })] }, s.id));
            })] }));
}
