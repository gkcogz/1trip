import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/StopsTimeline.tsx
import { useEffect, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';
import LegEditor from './LegEditor';
import StopsGraph from './StopsGraph';
import { EmojiButton } from './ui';
import { useI18n } from '../i18n';
import ResetModal from './ResetModal';
export default function StopsTimeline({ trip, addStop, setStopField, setSelectedStopId, deleteStop, moveStop, setLegField, setTripField, }) {
    const { t } = useI18n();
    const [activeStopId, setActiveStopId] = useState(null);
    const [mountingId, setMountingId] = useState(null);
    const [resetOpen, setResetOpen] = useState(false);
    const wrapperRef = useRef(null);
    const cardRefs = useRef({});
    const setCardRef = (id) => (el) => {
        cardRefs.current[id] = el;
    };
    // yeni durak eklendiğinde flicker önle
    const prevCountRef = useRef(trip.stops?.length ?? 0);
    useEffect(() => {
        const prev = prevCountRef.current;
        const curr = trip.stops?.length ?? 0;
        if (curr > prev && curr > 0) {
            const newStop = trip.stops[curr - 1];
            setSelectedStopId(null);
            setActiveStopId(newStop.id);
            setMountingId(newStop.id);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setMountingId(null));
            });
            setTimeout(() => {
                cardRefs.current[newStop.id]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 0);
        }
        prevCountRef.current = curr;
    }, [trip.stops, setSelectedStopId]);
    // aktif durak silindiyse paneli kapat
    useEffect(() => {
        if (!activeStopId)
            return;
        const stillThere = (trip.stops ?? []).some((s) => s.id === activeStopId);
        if (!stillThere)
            setActiveStopId(null);
    }, [trip.stops, activeStopId]);
    const handleAddStop = () => {
        setSelectedStopId(null);
        addStop();
    };
    const handleActivateFromGraph = (id) => {
        if (!id) {
            setActiveStopId(null);
            return;
        }
        setActiveStopId((prev) => (prev === id ? null : id));
        const el = cardRefs.current[id];
        if (el)
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    // ✅ Reset artık currency ve participants’i koruyor
    const handleResetTrip = () => {
        setActiveStopId(null);
        setSelectedStopId(null);
        setTripField('stops', []);
        setTripField('legs', []);
    };
    return (_jsxs("div", { className: "relative space-y-4", ref: wrapperRef, children: [_jsx(SectionHeader, { title: t('stops.header'), action: _jsx(EmojiButton, { emoji: "\u2795", label: t('stops.add'), title: t('stops.add'), onClick: handleAddStop, variant: "btn" }) }), trip.stops.length > 0 && (_jsx(StopsGraph, { trip: trip, wrapperRef: wrapperRef, activeStopId: activeStopId, onActivate: handleActivateFromGraph, onReset: () => setResetOpen(true) })), trip.stops.length === 0 && (_jsx("div", { className: "rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center text-[var(--color-muted)]", children: t('stops.none') })), trip.stops.map((s, i) => {
                if (!activeStopId || s.id !== activeStopId)
                    return null;
                const nights = s.stayNights || 0;
                const b = s.budget || {};
                const lodgingTotal = typeof b.lodgingTotal === 'number'
                    ? b.lodgingTotal
                    : (b.lodgingPerNight || 0) * nights;
                const mounting = mountingId === s.id;
                const leg = trip.legs.find((l) => l.fromStopId === s.id && l.toStopId === trip.stops[i + 1]?.id);
                return (_jsxs("div", { ref: setCardRef(s.id), className: 'rounded-2xl bg-white border border-[var(--color-border)] shadow-md ring-2 ring-[var(--color-brand)] ' +
                        'transition-opacity transition-transform duration-200 ease-out ' +
                        (mounting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'), children: [_jsx("div", { className: "p-4 flex flex-col gap-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(EmojiButton, { emoji: "\u2B06\uFE0F", label: t('stops.up'), title: t('stops.up'), onClick: () => moveStop(s.id, 'up'), variant: "ghost" }), _jsx(EmojiButton, { emoji: "\u2B07\uFE0F", label: t('stops.down'), title: t('stops.down'), onClick: () => moveStop(s.id, 'down'), variant: "ghost" }), _jsx("input", { value: s.city, onChange: (e) => setStopField(s.id, 'city', e.target.value), placeholder: t('stops.city.placeholder'), className: "flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none" }), _jsx(EmojiButton, { emoji: "\uD83E\uDDFA", label: t('stops.activities'), title: t('stops.activities'), onClick: () => setSelectedStopId(s.id), variant: "btn" }), _jsx(EmojiButton, { emoji: "\uD83D\uDDD1", label: t('stops.delete'), title: t('stops.delete'), onClick: () => deleteStop(s.id), variant: "btn", className: "!bg-red-600 hover:!bg-red-700 border-red-600" })] }) }), i < trip.stops.length - 1 && leg && (_jsx(LegEditor, { leg: leg, stopId: s.id, trip: trip, setTripField: setTripField, setLegField: setLegField })), _jsxs("div", { className: "px-4 pb-4 text-sm text-neutral-600 flex flex-wrap gap-2", children: [_jsxs("span", { className: "tag", children: [t('stops.tag.activities'), ": ", s.activities.length] }), lodgingTotal > 0 && (_jsx("span", { className: "tag", children: t('stops.tag.lodging', { v: String(lodgingTotal) }) })), typeof b.foodPerDay === 'number' && b.foodPerDay > 0 && (_jsx("span", { className: "tag", children: t('stops.tag.food', { v: String(b.foodPerDay) }) })), typeof b.other === 'number' && b.other > 0 && (_jsx("span", { className: "tag", children: t('stops.tag.other', { v: String(b.other) }) }))] })] }, s.id));
            }), _jsx(ResetModal, { open: resetOpen, onClose: () => setResetOpen(false), onConfirm: handleResetTrip })] }));
}
