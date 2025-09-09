// src/components/BudgetPanel.tsx
import { Trip, TripBudgetBreakdown } from '@lib/types'
import { currencyFmt } from '@lib/utils'
import { useI18n } from '../i18n'

type Props = {
  trip?: Trip
  currency?: string
  participants?: number
  budget?: TripBudgetBreakdown
  totalNights?: number
}

export default function BudgetPanel(props: Props) {
  const { t } = useI18n()
  const trip = props.trip
  const currency = trip?.currency ?? props.currency ?? 'EUR'
  const participants = Math.max(1, Number(trip?.participants ?? props.participants ?? 1))

  let transport = 0
  let lodging = 0
  let food = 0
  let activities = 0
  let other = 0
  let totalNights = 0

  if (trip) {
    totalNights = (trip.stops ?? []).reduce((s, x: any) => s + (Number(x?.stayNights) || 0), 0)
    transport = (trip.legs ?? []).reduce((s: number, l: any) => s + (Number(l?.cost) || 0), 0)

    for (const s of trip.stops ?? []) {
      const nights = Number((s as any)?.stayNights) || 0
      const b = (s as any)?.budget || {}

      const lodgingTotal =
        typeof b.lodgingTotal === 'number'
          ? Number(b.lodgingTotal)
          : (Number(b.lodgingPerNight) || 0) * nights
      lodging += lodgingTotal

      const foodPerDay = Number(b.foodPerDay) || 0
      food += foodPerDay * nights * participants

      other += Number(b.other) || 0

      activities += (s.activities ?? []).reduce(
        (acc: number, a: any) => acc + (Number(a?.cost) || 0),
        0
      )
    }
  } else if (props.budget) {
    const b = props.budget
    transport = Number(b.transport) || 0
    lodging = Number(b.lodging) || 0
    food = Number(b.food) || 0
    activities = Number(b.activities) || 0
    other = Number(b.other) || 0
    totalNights = Number(props.totalNights) || 0
  }

  const groupTotal = transport + lodging + food + activities + other
  const perPerson = groupTotal / participants
  const perPersonPerDay = totalNights > 0 ? perPerson / totalNights : 0

  const travelerEmoji = (n: number) => {
    if (n === 1) return '👤'
    if (n === 2) return '👥'
    if (n >= 3 && n <= 5) return '🧑‍🤝‍🧑'
    if (n > 5) return '🧑‍🤝‍🧑+'
    return '👤'
  }

  const Row = ({ k, v, index }: { k: string; v: number; index: number }) => (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded-md ${
        index % 2 === 0 ? 'bg-white' : 'bg-neutral-100'
      }`}
    >
      <span>{k}</span>
      <span className="font-medium text-[var(--color-accent)]">
        {currencyFmt(currency, v)}
      </span>
    </div>
  )

  const rows = [
    { k: t('budget.transport'), v: transport },
    { k: t('budget.lodging'), v: lodging },
    { k: t('budget.food'), v: food },
    { k: t('budget.activities'), v: activities },
    { k: t('budget.other'), v: other },
  ]

  return (
    <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-[var(--color-brand)] border-b-2 border-[var(--color-brand)] pb-1">
        {t('budget.title')}
      </h3>

      <div className="space-y-1 text-sm text-[var(--color-ink)]">
        {rows.map((r, i) => (
          <Row key={i} k={r.k} v={r.v} index={i} />
        ))}

        <div className="h-px bg-[var(--color-border)] my-2" />

        {/* per-person total */}
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold">{t('budget.totalPerPerson')}</span>
          <span className="font-bold text-[var(--color-brand)]">
            {currencyFmt(currency, perPerson)}
          </span>
        </div>

        {totalNights > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              {t('budget.dailyPerPerson', { nights: totalNights.toString() })}
            </span>
            <span className="font-semibold text-[var(--color-brand)]">
              {currencyFmt(currency, perPersonPerDay)}
            </span>
          </div>
        )}

        {/* group total */}
        <div className="flex items-center justify-between text-xs opacity-80">
          <span>
            {t('budget.groupTotal', { participants: participants.toString() })}{' '}
            <span className="ml-1">{travelerEmoji(participants)}</span>
          </span>
          <span className="font-medium">{currencyFmt(currency, groupTotal)}</span>
        </div>
      </div>
    </div>
  )
}
