// src/components/StopsTimeline.tsx
import { useEffect, useRef, useState } from 'react'
import { Trip } from '@lib/types'
import SectionHeader from './SectionHeader'
import LegEditor from './LegEditor'
import StopsGraph from './StopsGraph'
import { EmojiButton } from './ui'
import { useI18n } from '../i18n'
import ResetModal from './ResetModal'

export default function StopsTimeline({
  trip,
  addStop,
  setStopField,
  setSelectedStopId,
  deleteStop,
  moveStop,
  setLegField,
  setTripField,
}: {
  trip: Trip
  addStop: () => void
  setStopField: (stopId: string, field: any, value: any) => void
  setSelectedStopId: (id: string | null) => void
  deleteStop: (id: string) => void
  moveStop: (id: string, dir: 'up' | 'down') => void
  setLegField: (id: string, field: any, value: any) => void
  setTripField: (f: keyof Trip, v: any) => void
}) {
  const { t } = useI18n()
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const [mountingId, setMountingId] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const setCardRef = (id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el
  }

  // yeni durak eklendiğinde flicker önle
  const prevCountRef = useRef<number>(trip.stops?.length ?? 0)
  useEffect(() => {
    const prev = prevCountRef.current
    const curr = trip.stops?.length ?? 0
    if (curr > prev && curr > 0) {
      const newStop = trip.stops[curr - 1]
      setSelectedStopId(null)
      setActiveStopId(newStop.id)
      setMountingId(newStop.id)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMountingId(null))
      })
      setTimeout(() => {
        cardRefs.current[newStop.id]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 0)
    }
    prevCountRef.current = curr
  }, [trip.stops, setSelectedStopId])

  // aktif durak silindiyse paneli kapat
  useEffect(() => {
    if (!activeStopId) return
    const stillThere = (trip.stops ?? []).some((s) => s.id === activeStopId)
    if (!stillThere) setActiveStopId(null)
  }, [trip.stops, activeStopId])

  const handleAddStop = () => {
    setSelectedStopId(null)
    addStop()
  }

  const handleActivateFromGraph = (id: string | null) => {
    if (!id) {
      setActiveStopId(null)
      return
    }
    setActiveStopId((prev) => (prev === id ? null : id))
    const el = cardRefs.current[id]
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  // ✅ Reset artık currency ve participants’i koruyor
  const handleResetTrip = () => {
    setActiveStopId(null)
    setSelectedStopId(null)
    setTripField('stops', [])
    setTripField('legs', [])
  }

  return (
    <div className="relative space-y-4" ref={wrapperRef}>
      <SectionHeader
        title={t('stops.header')}
        action={
          <EmojiButton
            emoji="➕"
            label={t('stops.add')}
            title={t('stops.add')}
            onClick={handleAddStop}
            variant="btn"
          />
        }
      />

      {trip.stops.length > 0 && (
        <StopsGraph
          trip={trip}
          wrapperRef={wrapperRef}
          activeStopId={activeStopId}
          onActivate={handleActivateFromGraph}
          onReset={() => setResetOpen(true)}
        />
      )}

      {trip.stops.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center text-[var(--color-muted)]">
          {t('stops.none')}
        </div>
      )}

      {trip.stops.map((s, i) => {
        if (!activeStopId || s.id !== activeStopId) return null

        const nights = s.stayNights || 0
        const b = s.budget || {}
        const lodgingTotal =
          typeof b.lodgingTotal === 'number'
            ? b.lodgingTotal
            : (b.lodgingPerNight || 0) * nights

        const mounting = mountingId === s.id

        const leg = trip.legs.find(
          (l) => l.fromStopId === s.id && l.toStopId === trip.stops[i + 1]?.id
        )

        return (
          <div
            key={s.id}
            ref={setCardRef(s.id)}
            className={
              'rounded-2xl bg-white border border-[var(--color-border)] shadow-md ring-2 ring-[var(--color-brand)] ' +
              'transition-opacity transition-transform duration-200 ease-out ' +
              (mounting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0')
            }
          >
            <div className="p-4 flex flex-col gap-3">
              <div className="flex gap-2">
                <EmojiButton emoji="⬆️" label={t('stops.up')} title={t('stops.up')} onClick={() => moveStop(s.id, 'up')} variant="ghost" />
                <EmojiButton emoji="⬇️" label={t('stops.down')} title={t('stops.down')} onClick={() => moveStop(s.id, 'down')} variant="ghost" />
                <input
                  value={s.city}
                  onChange={(e) => setStopField(s.id, 'city', e.target.value)}
                  placeholder={t('stops.city.placeholder')}
                  className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none"
                />
                <EmojiButton
                  emoji="🧺"
                  label={t('stops.activities')}
                  title={t('stops.activities')}
                  onClick={() => setSelectedStopId(s.id)}
                  variant="btn"
                />
                <EmojiButton
                  emoji="🗑"
                  label={t('stops.delete')}
                  title={t('stops.delete')}
                  onClick={() => deleteStop(s.id)}
                  variant="btn"
                  className="!bg-red-600 hover:!bg-red-700 border-red-600"
                />
              </div>
            </div>

            {i < trip.stops.length - 1 && leg && (
              <LegEditor
                leg={leg}
                stopId={s.id}
                trip={trip}
                setTripField={setTripField}
                setLegField={setLegField}
              />
            )}

            <div className="px-4 pb-4 text-sm text-neutral-600 flex flex-wrap gap-2">
              <span className="tag">
                {t('stops.tag.activities')}: {s.activities.length}
              </span>
              {lodgingTotal > 0 && (
                <span className="tag">
                  {t('stops.tag.lodging', { v: String(lodgingTotal) })}
                </span>
              )}
              {typeof b.foodPerDay === 'number' && b.foodPerDay > 0 && (
                <span className="tag">
                  {t('stops.tag.food', { v: String(b.foodPerDay) })}
                </span>
              )}
              {typeof b.other === 'number' && b.other > 0 && (
                <span className="tag">
                  {t('stops.tag.other', { v: String(b.other) })}
                </span>
              )}
            </div>
          </div>
        )
      })}

      <ResetModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleResetTrip}
      />
    </div>
  )
}
