// src/components/LegEditor.tsx
import { useState } from 'react'
import { Trip } from '@lib/types'
import { useI18n } from '../i18n'
import { DateRange, RangeKeyDict } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

function ModeButton({
  active,
  onClick,
  emoji,
  label,
}: {
  active: boolean
  onClick: () => void
  emoji: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all
        ${
          active
            ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow'
            : 'bg-white text-[var(--color-accent)] border-[var(--color-border)] hover:bg-[var(--color-brand)]/10'
        }`}
      aria-label={label}
      title={label}
    >
      <span aria-hidden>{emoji}</span>
      <span
        className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap 
                   group-hover:max-w-[100px] group-hover:opacity-100 
                   transition-all duration-200 ease-out"
      >
        {label}
      </span>
    </button>
  )
}

export default function LegEditor({
  leg,
  setLegField,
  stopId,
  trip,
  setTripField,
}: {
  leg: Trip['legs'][number]
  setLegField: (id: string, field: any, value: any) => void
  stopId: string
  trip: Trip
  setTripField: (f: keyof Trip, v: any) => void
}) {
  const { t } = useI18n()
  if (!leg) return null

  const [showCalendar, setShowCalendar] = useState(false)
  const stop = trip.stops.find((s) => s.id === stopId)
  if (!stop) return null

  const calculateNights = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 ? Math.floor(diff) : 0
  }

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges.selection
    if (startDate && endDate) {
      const nights = calculateNights(startDate, endDate)
      setTripField(
        'stops',
        trip.stops.map((st) =>
          st.id === stop.id
            ? {
                ...st,
                arrivalDate: startDate.toISOString().slice(0, 10),
                departureDate: endDate.toISOString().slice(0, 10),
                stayNights: nights,
              }
            : st
        )
      )
    }
  }

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Sol: Konaklama süresi */}
        <div>
          <div className="mb-2 text-sm font-medium text-[var(--color-accent)]">
            {t('legEditor.stay')}
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white hover:bg-[var(--color-brand)]/10"
            >
              📅 {t('legEditor.stay')}
            </button>

            {/* 🌙 nights input + ℹ️ tooltip */}
            <div className="flex items-center gap-2 relative">
              <span className="text-lg">🌙</span>
              <input
                type="number"
                min={0}
                value={stop.stayNights || 0}
                onFocus={(e) => {
                  if (Number(e.currentTarget.value) === 0) {
                    e.currentTarget.value = ''
                  } else {
                    e.currentTarget.select()
                  }
                }}
                onChange={(e) =>
                  setTripField(
                    'stops',
                    trip.stops.map((st) =>
                      st.id === stop.id
                        ? { ...st, stayNights: Number(e.target.value) || 0 }
                        : st
                    )
                  )
                }
                className="w-24 px-2 py-1 rounded-lg border border-[var(--color-border)]"
                placeholder={t('legEditor.nights')}
              />

              {/* ℹ️ Info icon with tooltip */}
              <div className="relative group">
                <span className="ml-1 text-gray-500 cursor-pointer">ℹ️</span>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 p-2 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {t('legEditor.stayHint')}
                </div>
              </div>
            </div>
          </div>

          {/* Expandable calendar */}
          {showCalendar && (
            <div className="mt-2">
              <DateRange
                ranges={[
                  {
                    startDate: stop.arrivalDate ? new Date(stop.arrivalDate) : new Date(),
                    endDate: stop.departureDate
                      ? new Date(stop.departureDate)
                      : new Date(),
                    key: 'selection',
                  },
                ]}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
              />
            </div>
          )}
        </div>

        {/* ✅ Sağ: Ulaşım seçenekleri + maliyet */}
        <div>
          <div className="mb-2 text-sm font-medium text-[var(--color-accent)]">
            {t('legEditor.transport')}
          </div>
          <div className="flex flex-wrap gap-2 justify-start pr-4">
            <ModeButton
              active={leg.mode === 'plane'}
              onClick={() => setLegField(leg.id, 'mode', 'plane')}
              emoji="✈️"
              label={t('legEditor.plane')}
            />
            <ModeButton
              active={leg.mode === 'train'}
              onClick={() => setLegField(leg.id, 'mode', 'train')}
              emoji="🚄"
              label={t('legEditor.train')}
            />
            <ModeButton
              active={leg.mode === 'bus'}
              onClick={() => setLegField(leg.id, 'mode', 'bus')}
              emoji="🚌"
              label={t('legEditor.bus')}
            />
            <ModeButton
              active={leg.mode === 'car'}
              onClick={() => setLegField(leg.id, 'mode', 'car')}
              emoji="🚗"
              label={t('legEditor.car')}
            />
            <ModeButton
              active={leg.mode === 'ship'}
              onClick={() => setLegField(leg.id, 'mode', 'ship')}
              emoji="🚢"
              label={t('legEditor.ship')}
            />
            <div className="mr-4">
              <ModeButton
                active={leg.mode === 'walk'}
                onClick={() => setLegField(leg.id, 'mode', 'walk')}
                emoji="🚶"
                label={t('legEditor.walk')}
              />
            </div>
          </div>

          {/* Maliyet input */}
          <div className="mt-4">
            <label className="inline-flex items-center gap-2 px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white">
              <span>{t('legEditor.cost')}</span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                className="w-28 bg-transparent outline-none"
                value={leg.cost}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) =>
                  setLegField(leg.id, 'cost', Number(e.target.value) || 0)
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
