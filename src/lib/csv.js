// src/lib/csv.ts
/** Convert Trip to flat CSV (Excel/Sheets compatible). */
export function toCSV(trip) {
    var rows = [[
            'type', 'from', 'to', 'mode', 'stop', 'item', 'category', 'note', 'cost'
        ]];
    // Transport legs
    trip.legs.forEach(function (l) {
        var _a, _b, _c;
        var from = ((_a = trip.stops.find(function (s) { return s.id === l.fromStopId; })) === null || _a === void 0 ? void 0 : _a.city) || '';
        var to = ((_b = trip.stops.find(function (s) { return s.id === l.toStopId; })) === null || _b === void 0 ? void 0 : _b.city) || '';
        rows.push(['transport', from, to, (_c = l.mode) !== null && _c !== void 0 ? _c : '', '', '', '', '', String(l.cost || 0)]);
    });
    // Stops & activities
    trip.stops.forEach(function (st) {
        var _a, _b, _c;
        var stay = Number(st.stayNights) || 0;
        var lp = Number((_a = st.budget) === null || _a === void 0 ? void 0 : _a.lodgingPerNight) || 0;
        var fp = Number((_b = st.budget) === null || _b === void 0 ? void 0 : _b.foodPerDay) || 0;
        var oth = Number((_c = st.budget) === null || _c === void 0 ? void 0 : _c.other) || 0;
        if (lp)
            rows.push(['lodging', '', '', '', st.city, "lodging x".concat(stay, " nights"), '', '', String(lp * stay)]);
        if (fp)
            rows.push(['food', '', '', '', st.city, "food x".concat(stay, " days"), '', '', String(fp * stay)]);
        if (oth)
            rows.push(['other', '', '', '', st.city, 'other', '', '', String(oth)]);
        st.activities.forEach(function (ac) {
            var _a;
            rows.push(['activity', '', '', '', st.city, ac.title, (_a = ac.category) !== null && _a !== void 0 ? _a : '', ac.note || '', String(ac.cost || 0)]);
        });
    });
    // Convert to CSV string
    return rows
        .map(function (r) { return r.map(function (v) { return "\"".concat(String(v).replace(/"/g, '""'), "\""); }).join(','); })
        .join('\n');
}
