import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/PrintSheet.tsx
import { useMemo } from 'react';
import StopsGraph from './StopsGraph';
import { useI18n } from '../i18n'; // ← i18n entegrasyonu
function money(n, currency) {
    var v = typeof n === 'number' ? n : 0;
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(v);
    }
    catch (_a) {
        // Para birimi desteklenmiyorsa yine de okunur bir çıktı ver
        return "".concat(v.toFixed(2), " ").concat(currency);
    }
}
export default function PrintSheet(_a) {
    var _b, _c;
    var trip = _a.trip;
    var t = useI18n().t;
    var stops = (_b = trip.stops) !== null && _b !== void 0 ? _b : [];
    var legs = (_c = trip.legs) !== null && _c !== void 0 ? _c : [];
    var currency = trip.currency || 'EUR';
    var participants = Math.max(1, trip.participants || 1);
    // Durak bazlı bütçe hesapları
    var perStop = useMemo(function () {
        return stops.map(function (s) {
            var nights = s.stayNights || 0;
            var b = s.budget || {};
            var lodgingTotal = typeof b.lodgingTotal === 'number'
                ? b.lodgingTotal
                : (b.lodgingPerNight || 0) * nights;
            var foodTotal = (b.foodPerDay || 0) * Math.max(1, nights) * participants;
            var otherTotal = b.other || 0;
            var activitiesTotal = (s.activities || []).reduce(function (acc, a) { return acc + (a.cost || 0); }, 0);
            var subtotal = lodgingTotal + foodTotal + otherTotal + activitiesTotal;
            return { id: s.id, nights: nights, lodgingTotal: lodgingTotal, foodTotal: foodTotal, otherTotal: otherTotal, activitiesTotal: activitiesTotal, subtotal: subtotal };
        });
    }, [stops, participants]);
    var transportTotal = legs.reduce(function (acc, l) { return acc + (l.cost || 0); }, 0);
    var tripTotal = perStop.reduce(function (a, x) { return a + x.subtotal; }, 0) + transportTotal;
    var perPerson = tripTotal / Math.max(1, participants);
    return (_jsxs("div", { id: "print-sheet", className: "print-container", children: [_jsxs("div", { className: "print-header", children: [_jsxs("div", { children: [_jsx("h1", { className: "print-title", children: trip.title || t('print.title.fallback') }), _jsx("div", { className: "print-sub", children: t('print.header.line', {
                                    n: participants,
                                    travelers: participants > 1 ? t('print.travelers.plural') : t('print.travelers.singular'),
                                    cur: currency
                                }) })] }), trip.logoDataUrl && _jsx("img", { src: trip.logoDataUrl, alt: "logo", className: "print-logo" })] }), stops.length > 0 && (_jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('graph.header') }), _jsx(StopsGraph, { trip: trip, wrapperRef: { current: null }, activeStopId: null, onActivate: function () { } })] })), _jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('print.stopsActivities') }), _jsx("div", { className: "print-stops", children: stops.map(function (s, i) {
                            var p = perStop[i];
                            return (_jsxs("div", { className: "print-card", children: [_jsxs("div", { className: "print-card-head", children: [_jsx("div", { className: "print-stop-title", children: s.city || t('print.stopPlaceholder', { i: i + 1 }) }), _jsx("div", { className: "print-stop-sub", children: t('print.nightsSubtotal', {
                                                    nights: p.nights,
                                                    subtotal: money(p.subtotal, currency)
                                                }) })] }), (s.activities || []).length > 0 ? (_jsxs("table", { className: "print-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: { width: '45%' }, children: t('print.tbl.activity') }), _jsx("th", { style: { width: '20%' }, children: t('print.tbl.category') }), _jsx("th", { style: { width: '25%' }, children: t('print.tbl.note') }), _jsx("th", { style: { width: '10%' }, className: "text-right", children: t('print.tbl.cost') })] }) }), _jsx("tbody", { children: s.activities.map(function (a) { return (_jsxs("tr", { children: [_jsx("td", { children: a.title }), _jsx("td", { children: a.category || '-' }), _jsx("td", { children: a.note || '' }), _jsx("td", { className: "text-right", children: money(a.cost || 0, currency) })] }, a.id)); }) })] })) : (_jsx("div", { className: "print-muted", children: t('print.noActivities') })), _jsxs("div", { className: "print-grid", children: [_jsxs("div", { className: "print-grid-item", children: [t('print.lodgingTotal'), ": ", _jsx("b", { children: money(p.lodgingTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.foodFormula'), ": ", _jsx("b", { children: money(p.foodTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.otherTotal'), ": ", _jsx("b", { children: money(p.otherTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.activitiesTotal'), ": ", _jsx("b", { children: money(p.activitiesTotal, currency) })] })] })] }, s.id));
                        }) })] }), legs.length > 0 && (_jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('print.transport') }), _jsxs("table", { className: "print-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: t('print.fromTo') }), _jsx("th", { children: t('print.mode') }), _jsx("th", { className: "text-right", children: t('print.tbl.cost') })] }) }), _jsx("tbody", { children: legs.map(function (l) {
                                    var from = stops.find(function (s) { return s.id === l.fromStopId; });
                                    var to = stops.find(function (s) { return s.id === l.toStopId; });
                                    return (_jsxs("tr", { children: [_jsxs("td", { children: [((from === null || from === void 0 ? void 0 : from.city) || t('print.unknown')), " \u2192 ", ((to === null || to === void 0 ? void 0 : to.city) || t('print.unknown'))] }), _jsx("td", { children: l.mode || '-' }), _jsx("td", { className: "text-right", children: money(l.cost || 0, currency) })] }, l.id));
                                }) }), _jsx("tfoot", { children: _jsxs("tr", { children: [_jsx("td", { colSpan: 2, className: "text-right font-medium", children: t('print.transportTotal') }), _jsx("td", { className: "text-right font-medium", children: money(transportTotal, currency) })] }) })] })] })), _jsxs("section", { className: "print-section", children: [_jsx("h2", { className: "print-h2", children: t('print.overallTotals') }), _jsxs("div", { className: "print-grid", children: [_jsxs("div", { className: "print-grid-item", children: [t('print.groupTotal'), ": ", _jsx("b", { children: money(tripTotal, currency) })] }), _jsxs("div", { className: "print-grid-item", children: [t('print.perPerson'), ": ", _jsx("b", { children: money(perPerson, currency) })] })] })] })] }));
}
