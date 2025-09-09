import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { currencyFmt } from '../lib/utils';
import { useI18n } from '../i18n';
export default function BudgetPanel(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var t = useI18n().t;
    var trip = props.trip;
    var currency = (_b = (_a = trip === null || trip === void 0 ? void 0 : trip.currency) !== null && _a !== void 0 ? _a : props.currency) !== null && _b !== void 0 ? _b : 'EUR';
    var participants = Math.max(1, Number((_d = (_c = trip === null || trip === void 0 ? void 0 : trip.participants) !== null && _c !== void 0 ? _c : props.participants) !== null && _d !== void 0 ? _d : 1));
    var transport = 0;
    var lodging = 0;
    var food = 0;
    var activities = 0;
    var other = 0;
    var totalNights = 0;
    if (trip) {
        totalNights = ((_e = trip.stops) !== null && _e !== void 0 ? _e : []).reduce(function (s, x) { return s + (Number(x === null || x === void 0 ? void 0 : x.stayNights) || 0); }, 0);
        transport = ((_f = trip.legs) !== null && _f !== void 0 ? _f : []).reduce(function (s, l) { return s + (Number(l === null || l === void 0 ? void 0 : l.cost) || 0); }, 0);
        for (var _i = 0, _j = (_g = trip.stops) !== null && _g !== void 0 ? _g : []; _i < _j.length; _i++) {
            var s = _j[_i];
            var nights = Number(s === null || s === void 0 ? void 0 : s.stayNights) || 0;
            var b = (s === null || s === void 0 ? void 0 : s.budget) || {};
            var lodgingTotal = typeof b.lodgingTotal === 'number'
                ? Number(b.lodgingTotal)
                : (Number(b.lodgingPerNight) || 0) * nights;
            lodging += lodgingTotal;
            var foodPerDay = Number(b.foodPerDay) || 0;
            food += foodPerDay * nights * participants;
            other += Number(b.other) || 0;
            activities += ((_h = s.activities) !== null && _h !== void 0 ? _h : []).reduce(function (acc, a) { return acc + (Number(a === null || a === void 0 ? void 0 : a.cost) || 0); }, 0);
        }
    }
    else if (props.budget) {
        var b = props.budget;
        transport = Number(b.transport) || 0;
        lodging = Number(b.lodging) || 0;
        food = Number(b.food) || 0;
        activities = Number(b.activities) || 0;
        other = Number(b.other) || 0;
        totalNights = Number(props.totalNights) || 0;
    }
    var groupTotal = transport + lodging + food + activities + other;
    var perPerson = groupTotal / participants;
    var perPersonPerDay = totalNights > 0 ? perPerson / totalNights : 0;
    var travelerEmoji = function (n) {
        if (n === 1)
            return '👤';
        if (n === 2)
            return '👥';
        if (n >= 3 && n <= 5)
            return '🧑‍🤝‍🧑';
        if (n > 5)
            return '🧑‍🤝‍🧑+';
        return '👤';
    };
    var Row = function (_a) {
        var k = _a.k, v = _a.v, index = _a.index;
        return (_jsxs("div", { className: "flex items-center justify-between px-2 py-1 rounded-md ".concat(index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'), children: [_jsx("span", { children: k }), _jsx("span", { className: "font-medium text-[var(--color-accent)]", children: currencyFmt(currency, v) })] }));
    };
    var rows = [
        { k: t('budget.transport'), v: transport },
        { k: t('budget.lodging'), v: lodging },
        { k: t('budget.food'), v: food },
        { k: t('budget.activities'), v: activities },
        { k: t('budget.other'), v: other },
    ];
    return (_jsxs("div", { className: "rounded-2xl bg-white border border-[var(--color-border)] p-4 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-3 text-[var(--color-brand)] border-b-2 border-[var(--color-brand)] pb-1", children: t('budget.title') }), _jsxs("div", { className: "space-y-1 text-sm text-[var(--color-ink)]", children: [rows.map(function (r, i) { return (_jsx(Row, { k: r.k, v: r.v, index: i }, i)); }), _jsx("div", { className: "h-px bg-[var(--color-border)] my-2" }), _jsxs("div", { className: "flex items-center justify-between text-base", children: [_jsx("span", { className: "font-semibold", children: t('budget.totalPerPerson') }), _jsx("span", { className: "font-bold text-[var(--color-brand)]", children: currencyFmt(currency, perPerson) })] }), totalNights > 0 && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-semibold", children: t('budget.dailyPerPerson', { nights: totalNights.toString() }) }), _jsx("span", { className: "font-semibold text-[var(--color-brand)]", children: currencyFmt(currency, perPersonPerDay) })] })), _jsxs("div", { className: "flex items-center justify-between text-xs opacity-80", children: [_jsxs("span", { children: [t('budget.groupTotal', { participants: participants.toString() }), ' ', _jsx("span", { className: "ml-1", children: travelerEmoji(participants) })] }), _jsx("span", { className: "font-medium", children: currencyFmt(currency, groupTotal) })] })] })] }));
}
