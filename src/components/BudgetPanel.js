import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { currencyFmt } from '../lib/utils';
import { useI18n } from '../i18n';
export default function BudgetPanel(props) {
    const { t } = useI18n();
    const trip = props.trip;
    const currency = trip?.currency ?? props.currency ?? 'EUR';
    const participants = Math.max(1, Number(trip?.participants ?? props.participants ?? 1));
    // 🔍 Debug: seçili currency konsolda görünsün
    console.log("BudgetPanel currency:", currency);
    let transport = 0;
    let lodging = 0;
    let food = 0;
    let activities = 0;
    let other = 0;
    let totalNights = 0;
    if (trip) {
        totalNights = (trip.stops ?? []).reduce((s, x) => s + (Number(x?.stayNights) || 0), 0);
        transport = (trip.legs ?? []).reduce((s, l) => s + (Number(l?.cost) || 0), 0);
        for (const s of trip.stops ?? []) {
            const nights = Number(s?.stayNights) || 0;
            const b = s?.budget || {};
            const lodgingTotal = typeof b.lodgingTotal === 'number'
                ? Number(b.lodgingTotal)
                : (Number(b.lodgingPerNight) || 0) * nights;
            lodging += lodgingTotal;
            const foodPerDay = Number(b.foodPerDay) || 0;
            food += foodPerDay * nights * participants;
            other += Number(b.other) || 0;
            activities += (s.activities ?? []).reduce((acc, a) => acc + (Number(a?.cost) || 0), 0);
        }
    }
    else if (props.budget) {
        const b = props.budget;
        transport = Number(b.transport) || 0;
        lodging = Number(b.lodging) || 0;
        food = Number(b.food) || 0;
        activities = Number(b.activities) || 0;
        other = Number(b.other) || 0;
        totalNights = Number(props.totalNights) || 0;
    }
    const groupTotal = transport + lodging + food + activities + other;
    const perPerson = groupTotal / participants;
    const perPersonPerDay = totalNights > 0 ? perPerson / totalNights : 0;
    const travelerEmoji = (n) => {
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
    const Row = ({ k, v, index }) => (_jsxs("div", { className: `flex items-center justify-between px-2 py-1 rounded-md ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'}`, children: [_jsx("span", { children: k }), _jsx("span", { className: "font-medium text-[var(--color-accent)]", children: currencyFmt(currency, v) })] }));
    const rows = [
        { k: t('budget.transport'), v: transport },
        { k: t('budget.lodging'), v: lodging },
        { k: t('budget.food'), v: food },
        { k: t('budget.activities'), v: activities },
        { k: t('budget.other'), v: other },
    ];
    return (_jsxs("div", { className: "rounded-2xl bg-white border border-[var(--color-border)] p-4 shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-3 text-[var(--color-brand)] border-b-2 border-[var(--color-brand)] pb-1", children: t('budget.title') }), _jsxs("div", { className: "space-y-1 text-sm text-[var(--color-ink)]", children: [rows.map((r, i) => (_jsx(Row, { k: r.k, v: r.v, index: i }, i))), _jsx("div", { className: "h-px bg-[var(--color-border)] my-2" }), _jsxs("div", { className: "flex items-center justify-between text-base", children: [_jsx("span", { className: "font-semibold", children: t('budget.totalPerPerson') }), _jsx("span", { className: "font-bold text-[var(--color-brand)]", children: currencyFmt(currency, perPerson) })] }), totalNights > 0 && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-semibold", children: t('budget.dailyPerPerson', { nights: totalNights.toString() }) }), _jsx("span", { className: "font-semibold text-[var(--color-brand)]", children: currencyFmt(currency, perPersonPerDay) })] })), _jsxs("div", { className: "flex items-center justify-between text-xs opacity-80", children: [_jsxs("span", { children: [t('budget.groupTotal', { participants: participants.toString() }), ' ', _jsx("span", { className: "ml-1", children: travelerEmoji(participants) })] }), _jsx("span", { className: "font-medium", children: currencyFmt(currency, groupTotal) })] })] })] }));
}
