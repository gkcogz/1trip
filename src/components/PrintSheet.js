import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/PrintSheet.tsx
import { useMemo } from 'react';
import StopsGraph from './StopsGraph';
import { useI18n } from '../i18n';
function money(n, currency) {
    const v = typeof n === 'number' ? n : 0;
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v);
    }
    catch {
        return `${v.toFixed(2)} ${currency}`;
    }
}
export default function PrintSheet({ trip }) {
    const { t } = useI18n();
    const stops = trip.stops ?? [];
    const legs = trip.legs ?? [];
    const currency = trip.currency || 'EUR';
    const participants = Math.max(1, trip.participants || 1);
    // Durak bazlı bütçe hesapları
    const perStop = useMemo(() => {
        return stops.map((s) => {
            const nights = s.stayNights || 0;
            const b = s.budget || {};
            const lodgingTotal = typeof b.lodgingTotal === 'number'
                ? b.lodgingTotal
                : (b.lodgingPerNight || 0) * nights;
            const foodTotal = (b.foodPerDay || 0) * Math.max(1, nights) * participants;
            const otherTotal = b.other || 0;
            const activitiesTotal = (s.activities || []).reduce((acc, a) => acc + (a.cost || 0), 0);
            const subtotal = lodgingTotal + foodTotal + otherTotal + activitiesTotal;
            return { id: s.id, nights, lodgingTotal, foodTotal, otherTotal, activitiesTotal, subtotal };
        });
    }, [stops, participants]);
    const transportTotal = legs.reduce((acc, l) => acc + (l.cost || 0), 0);
    const tripTotal = perStop.reduce((a, x) => a + x.subtotal, 0) + transportTotal;
    const perPerson = tripTotal / Math.max(1, participants);
    return (_jsxs("div", { id: "print-sheet", className: "print-container", children: [_jsxs("div", { className: "print-header", children: [_jsxs("div", { children: [_jsx("h1", { className: "print-title", children: trip.title || t('print.title.fallback') }), _jsx("div", { className: "print-sub", children: t('print.header.line', {
                                    n: participants,
                                    travelers: participants > 1 ? t('print.travelers.plural') : t('print.travelers.singular'),
                                    cur: currency
                                }) })] }), trip.logoDataUrl && _jsx("img", { src: trip.logoDataUrl, alt: "logo", className: "print-logo" })] }), stops.length > 0 && (_jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('graph.header') }), _jsx(StopsGraph, { trip: trip, printSafe: true })] })), _jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('print.stopsActivities') }), _jsx("div", { className: "print-stops", children: stops.map((s, i) => {
                            const p = perStop[i];
                            return (_jsxs("div", { className: "print-card", children: [_jsxs("div", { className: "print-card-head", children: [_jsx("div", { className: "print-stop-title", children: s.city || t('print.stopPlaceholder', { i: i + 1 }) }), _jsx("div", { className: "print-stop-sub", children: t('print.nightsSubtotal', {
                                                    nights: p.nights,
                                                    subtotal: money(p.subtotal, currency)
                                                }) })] }), (s.activities || []).length > 0 ? (_jsxs("table", { className: "print-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: { width: '45%' }, children: t('print.tbl.activity') }), _jsx("th", { style: { width: '20%' }, children: t('print.tbl.category') }), _jsx("th", { style: { width: '25%' }, children: t('print.tbl.note') }), _jsx("th", { style: { width: '10%' }, className: "text-right", children: t('print.tbl.cost') })] }) }), _jsx("tbody", { children: s.activities.map((a) => (_jsxs("tr", { children: [_jsx("td", { children: a.title }), _jsx("td", { children: a.category || '-' }), _jsx("td", { children: a.note || '' }), _jsx("td", { className: "text-right", children: money(a.cost || 0, currency) })] }, a.id))) })] })) : (_jsx("div", { className: "print-muted", children: t('print.noActivities') })), _jsxs("div", { className: "print-grid", children: [_jsxs("div", { className: "print-grid-item", children: [t('print.lodgingTotal'), ": ", _jsx("b", { children: money(p.lodgingTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.foodFormula'), ": ", _jsx("b", { children: money(p.foodTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.otherTotal'), ": ", _jsx("b", { children: money(p.otherTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.activitiesTotal'), ": ", _jsx("b", { children: money(p.activitiesTotal, currency) })] })] })] }, s.id));
                        }) })] }), legs.length > 0 && (_jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('print.transport') }), _jsxs("table", { className: "print-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: t('print.fromTo') }), _jsx("th", { children: t('print.mode') }), _jsx("th", { className: "text-right", children: t('print.tbl.cost') })] }) }), _jsx("tbody", { children: legs.map((l) => {
                                    const from = stops.find(s => s.id === l.fromStopId);
                                    const to = stops.find(s => s.id === l.toStopId);
                                    return (_jsxs("tr", { children: [_jsxs("td", { children: [(from?.city || t('print.unknown')), " \u2192 ", (to?.city || t('print.unknown'))] }), _jsx("td", { children: l.mode || '-' }), _jsx("td", { className: "text-right", children: money(l.cost || 0, currency) })] }, l.id));
                                }) }), _jsx("tfoot", { children: _jsxs("tr", { children: [_jsx("td", { colSpan: 2, className: "text-right font-medium", children: t('print.transportTotal') }), _jsx("td", { className: "text-right font-medium", children: money(transportTotal, currency) })] }) })] })] })), _jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('print.overallTotals') }), _jsxs("div", { className: "print-grid", children: [_jsxs("div", { className: "print-grid-item", children: [t('print.groupTotal'), ": ", _jsx("b", { children: money(tripTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.perPerson'), ": ", _jsx("b", { children: money(perPerson, currency) })] })] })] })] }));
}
