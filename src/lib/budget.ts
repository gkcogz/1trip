import type { Trip, TripBudgetBreakdown } from './types'

export function computeBudget(trip: Trip): TripBudgetBreakdown {
  const transport = trip.legs.reduce((s, l) => s + (Number(l.cost) || 0), 0)

  const lodging = trip.stops.reduce(
    (s, st) => s + (Number(st.budget?.lodgingPerNight) || 0) * (Number(st.stayNights) || 0),
    0
  )

  const food = trip.stops.reduce(
    (s, st) => s + (Number(st.budget?.foodPerDay) || 0) * (Number(st.stayNights) || 0),
    0
  )

  const activities = trip.stops.reduce(
    (s, st) => s + st.activities.reduce((a, ac) => a + (Number(ac.cost) || 0), 0),
    0
  )

  const other = trip.stops.reduce((s, st) => s + (Number(st.budget?.other) || 0), 0)

  const total = transport + lodging + food + activities + other
  return { transport, lodging, food, activities, other, total }
}
