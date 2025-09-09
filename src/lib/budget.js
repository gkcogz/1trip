/**
 * Compute budget breakdown for a given trip.
 * Includes transport, lodging, food, activities, and other costs.
 */
export function computeBudget(trip) {
    var _a, _b, _c, _d, _e;
    var transport = ((_a = trip.legs) !== null && _a !== void 0 ? _a : []).reduce(function (sum, leg) { return sum + (Number(leg === null || leg === void 0 ? void 0 : leg.cost) || 0); }, 0);
    var lodging = ((_b = trip.stops) !== null && _b !== void 0 ? _b : []).reduce(function (sum, st) {
        var nights = Number(st.stayNights) || 0;
        var budget = st.budget || {};
        // lodgingTotal override, otherwise lodgingPerNight * nights
        var lodgingCost = typeof budget.lodgingTotal === 'number'
            ? budget.lodgingTotal
            : (Number(budget.lodgingPerNight) || 0) * nights;
        return sum + lodgingCost;
    }, 0);
    var food = ((_c = trip.stops) !== null && _c !== void 0 ? _c : []).reduce(function (sum, st) {
        var nights = Number(st.stayNights) || 0;
        var budget = st.budget || {};
        var foodPerDay = Number(budget.foodPerDay) || 0;
        return sum + foodPerDay * nights;
    }, 0);
    var activities = ((_d = trip.stops) !== null && _d !== void 0 ? _d : []).reduce(function (sum, st) {
        var _a;
        return (sum +
            ((_a = st.activities) !== null && _a !== void 0 ? _a : []).reduce(function (aSum, ac) { return aSum + (Number(ac === null || ac === void 0 ? void 0 : ac.cost) || 0); }, 0));
    }, 0);
    var other = ((_e = trip.stops) !== null && _e !== void 0 ? _e : []).reduce(function (sum, st) {
        var _a;
        return sum + (Number((_a = st.budget) === null || _a === void 0 ? void 0 : _a.other) || 0);
    }, 0);
    var total = transport + lodging + food + activities + other;
    return { transport: transport, lodging: lodging, food: food, activities: activities, other: other, total: total };
}
