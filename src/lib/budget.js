/**
 * Compute budget breakdown for a given trip.
 * Includes transport, lodging, food, activities, and other costs.
 */
export function computeBudget(trip) {
    const transport = (trip.legs ?? []).reduce((sum, leg) => sum + (Number(leg?.cost) || 0), 0);
    const lodging = (trip.stops ?? []).reduce((sum, st) => {
        const nights = Number(st.stayNights) || 0;
        const budget = st.budget || {};
        // lodgingTotal override, otherwise lodgingPerNight * nights
        const lodgingCost = typeof budget.lodgingTotal === 'number'
            ? budget.lodgingTotal
            : (Number(budget.lodgingPerNight) || 0) * nights;
        return sum + lodgingCost;
    }, 0);
    const food = (trip.stops ?? []).reduce((sum, st) => {
        const nights = Number(st.stayNights) || 0;
        const budget = st.budget || {};
        const foodPerDay = Number(budget.foodPerDay) || 0;
        return sum + foodPerDay * nights;
    }, 0);
    const activities = (trip.stops ?? []).reduce((sum, st) => {
        return (sum +
            (st.activities ?? []).reduce((aSum, ac) => aSum + (Number(ac?.cost) || 0), 0));
    }, 0);
    const other = (trip.stops ?? []).reduce((sum, st) => {
        return sum + (Number(st.budget?.other) || 0);
    }, 0);
    const total = transport + lodging + food + activities + other;
    return { transport, lodging, food, activities, other, total };
}
