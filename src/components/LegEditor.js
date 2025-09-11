import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/LegEditor.tsx
import { useState } from 'react';
import { useI18n } from '../i18n';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
function ModeButton({ active, onClick, emoji, label, }) {
    return (_jsxs("button", { onClick: onClick, className: `group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all
        ${active
            ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow'
            : 'bg-white text-[var(--color-accent)] border-[var(--color-border)] hover:bg-[var(--color-brand)]/10'}`, "aria-label": label, title: label, children: [_jsx("span", { "aria-hidden": true, children: emoji }), _jsx("span", { className: "max-w-0 opacity-0 overflow-hidden whitespace-nowrap \r\n                   group-hover:max-w-[100px] group-hover:opacity-100 \r\n                   transition-all duration-200 ease-out", children: label })] }));
}
export default function LegEditor({ leg, setLegField, stopId, trip, setTripField, }) {
    const { t } = useI18n();
    if (!leg)
        return null;
    const [showCalendar, setShowCalendar] = useState(false);
    const stop = trip.stops.find((s) => s.id === stopId);
    if (!stop)
        return null;
    const calculateNights = (start, end) => {
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return diff > 0 ? Math.floor(diff) : 0;
    };
    const handleDateChange = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        if (startDate && endDate) {
            const nights = calculateNights(startDate, endDate);
            setTripField('stops', trip.stops.map((st) => st.id === stop.id
                ? {
                    ...st,
                    arrivalDate: startDate.toISOString().slice(0, 10),
                    departureDate: endDate.toISOString().slice(0, 10),
                    stayNights: nights,
                }
                : st));
        }
    };
    return (_jsx("div", { className: "px-4 pb-4 space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("div", { className: "mb-2 text-sm font-medium text-[var(--color-accent)]", children: t('legEditor.stay') }), _jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsxs("button", { onClick: () => setShowCalendar(!showCalendar), className: "px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white hover:bg-[var(--color-brand)]/10", children: ["\uD83D\uDCC5 ", t('legEditor.stay')] }), _jsxs("div", { className: "flex items-center gap-2 relative", children: [_jsx("span", { className: "text-lg", children: "\uD83C\uDF19" }), _jsx("input", { type: "number", min: 0, value: stop.stayNights || 0, onFocus: (e) => {
                                                if (Number(e.currentTarget.value) === 0) {
                                                    e.currentTarget.value = '';
                                                }
                                                else {
                                                    e.currentTarget.select();
                                                }
                                            }, onChange: (e) => setTripField('stops', trip.stops.map((st) => st.id === stop.id
                                                ? { ...st, stayNights: Number(e.target.value) || 0 }
                                                : st)), className: "w-24 px-2 py-1 rounded-lg border border-[var(--color-border)]", placeholder: t('legEditor.nights') }), _jsxs("div", { className: "relative group", children: [_jsx("span", { className: "ml-1 text-gray-500 cursor-pointer", children: "\u2139\uFE0F" }), _jsx("div", { className: "absolute left-1/2 -translate-x-1/2 mt-2 w-56 p-2 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10", children: t('legEditor.stayHint') })] })] })] }), showCalendar && (_jsx("div", { className: "mt-2", children: _jsx(DateRange, { ranges: [
                                    {
                                        startDate: stop.arrivalDate ? new Date(stop.arrivalDate) : new Date(),
                                        endDate: stop.departureDate
                                            ? new Date(stop.departureDate)
                                            : new Date(),
                                        key: 'selection',
                                    },
                                ], onChange: handleDateChange, moveRangeOnFirstSelection: false }) }))] }), _jsxs("div", { children: [_jsx("div", { className: "mb-2 text-sm font-medium text-[var(--color-accent)]", children: t('legEditor.transport') }), _jsxs("div", { className: "flex flex-wrap gap-2 justify-start pr-4", children: [_jsx(ModeButton, { active: leg.mode === 'plane', onClick: () => setLegField(leg.id, 'mode', 'plane'), emoji: "\u2708\uFE0F", label: t('legEditor.plane') }), _jsx(ModeButton, { active: leg.mode === 'train', onClick: () => setLegField(leg.id, 'mode', 'train'), emoji: "\uD83D\uDE84", label: t('legEditor.train') }), _jsx(ModeButton, { active: leg.mode === 'bus', onClick: () => setLegField(leg.id, 'mode', 'bus'), emoji: "\uD83D\uDE8C", label: t('legEditor.bus') }), _jsx(ModeButton, { active: leg.mode === 'car', onClick: () => setLegField(leg.id, 'mode', 'car'), emoji: "\uD83D\uDE97", label: t('legEditor.car') }), _jsx(ModeButton, { active: leg.mode === 'ship', onClick: () => setLegField(leg.id, 'mode', 'ship'), emoji: "\uD83D\uDEA2", label: t('legEditor.ship') }), _jsx("div", { className: "mr-4", children: _jsx(ModeButton, { active: leg.mode === 'walk', onClick: () => setLegField(leg.id, 'mode', 'walk'), emoji: "\uD83D\uDEB6", label: t('legEditor.walk') }) })] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "inline-flex items-center gap-2 px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white", children: [_jsx("span", { children: t('legEditor.cost') }), _jsx("input", { type: "number", inputMode: "decimal", step: "any", min: 0, className: "w-28 bg-transparent outline-none", value: leg.cost, onFocus: (e) => e.currentTarget.select(), onChange: (e) => setLegField(leg.id, 'cost', Number(e.target.value) || 0) })] }) })] })] }) }));
}
