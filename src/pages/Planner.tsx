// src/pages/Planner.tsx
import { useRef, useState } from 'react'
import type { Trip } from '../lib/types'
import { uid, clamp } from '../lib/utils'
import BudgetPanel from '../components/BudgetPanel'
import StopsTimeline from '../components/StopsTimeline'
import StopSidebar from '../components/StopSidebar'
import ResetModal from '../components/ResetModal'
import { useI18n } from '../i18n'

type PlannerProps = {
  trip: Trip
  setTrip: (next: Trip | ((trip: Trip) => Trip)) => void
}

export default function Planner({ trip, setTrip }: PlannerProps) {
  const { t } = useI18n()
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  // --- reset modal state ---
  const [showReset, setShowReset] = useState(false)
  const openReset = () => setShowReset(true)
  const closeReset = () => setShowReset(false)

  // --- history stacks ---
  const undoStack = useRef<Trip[]>([])
  const redoStack = useRef<Trip[]>([])
  const HISTORY_LIMIT = 60

  // history-aware setter
  const setTripWithHistory = (next: Trip | ((trip: Trip) => Trip)) => {
    setTrip((prev) => {
      const value =
        typeof next === 'function' ? (next as (trip: Trip) => Trip)(prev) : next
      undoStack.current.push(prev)
      if (undoStack.current.length > HISTORY_LIMIT) undoStack.current.shift()
      redoStack.current = []
      return value
    })
  }

  const undo = () => {
    if (undoStack.current.length === 0) return
    setTrip((curr) => {
      const prev = undoStack.current.pop()!
      redoStack.current.push(curr)
      return prev
    })
    setSelectedStopId(null)
  }

  const redo = () => {
    if (redoStack.current.length === 0) return
    setTrip((curr) => {
      const next = redoStack.current.pop()!
      undoStack.current.push(curr)
      return next
    })
    setSelectedStopId(null)
  }

  // --- mutation helpers ---
  const setTripField = (field: keyof Trip, value: any) =>
    setTripWithHistory((trip) => ({
      ...trip,
      [field]: field === 'participants' ? Math.max(1, Number(value) || 1) : value,
      updatedAt: Date.now(),
    }))

  const addStop = () =>
    setTripWithHistory((trip) => {
      const sId = 's_' + uid()
      const newStop = {
        id: sId,
        city: '',
        stayNights: 2,
        activities: [] as any[],
        budget: {} as any,
      }
      const stops = [...trip.stops, newStop]
      const legs = [...trip.legs]
      const prev = stops.length >= 2 ? stops[stops.length - 2] : undefined
      if (prev)
        legs.push({
          id: 'l_' + uid(),
          fromStopId: prev.id,
          toStopId: sId,
          mode: 'train',
          cost: 0,
        })
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const deleteStop = (stopId: string) =>
    setTripWithHistory((trip) => {
      const stops = trip.stops.filter((s) => s.id !== stopId)
      const legs: typeof trip.legs = []
      for (let i = 0; i < stops.length - 1; i++) {
        legs.push({
          id: 'l_' + uid(),
          fromStopId: stops[i].id,
          toStopId: stops[i + 1].id,
          mode: 'train',
          cost: 0,
        })
      }
      if (selectedStopId === stopId) setSelectedStopId(null)
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const moveStop = (stopId: string, dir: 'up' | 'down') =>
    setTripWithHistory((trip) => {
      const i = trip.stops.findIndex((s) => s.id === stopId)
      if (i < 0) return trip
      const j = clamp(i + (dir === 'up' ? -1 : 1), 0, trip.stops.length - 1)
      if (i === j) return trip
      const stops = [...trip.stops]
      const [s] = stops.splice(i, 1)
      stops.splice(j, 0, s)
      const legs: typeof trip.legs = []
      for (let k = 0; k < stops.length - 1; k++) {
        legs.push({
          id: 'l_' + uid(),
          fromStopId: stops[k].id,
          toStopId: stops[k + 1].id,
          mode: 'train',
          cost: 0,
        })
      }
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const setStopField = (stopId: string, field: any, value: any) =>
    setTripWithHistory((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : ({
              ...s,
              [field]: field === 'stayNights' ? Number(value) || 0 : value,
            } as any),
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const setLegField = (legId: string, field: any, value: any) =>
    setTripWithHistory((trip) => {
      const legs = trip.legs.map((l) =>
        l.id !== legId
          ? l
          : ({
              ...l,
              [field]: field === 'cost' ? Number(value) || 0 : value,
            } as any),
      )
      return { ...trip, legs, updatedAt: Date.now() }
    })

  const addActivity = (stopId: string) =>
    setTripWithHistory((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : ({
              ...s,
              activities: [
                ...s.activities,
                {
                  id: 'a_' + uid(),
                  title: t('planner.newActivity'),
                  category: 'other',
                  cost: 0,
                },
              ],
            } as any),
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const setActivityField = (stopId: string, actId: string, field: any, value: any) =>
    setTripWithHistory((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : ({
              ...s,
              activities: s.activities.map((a) =>
                a.id !== actId
                  ? a
                  : ({
                      ...a,
                      [field]: field === 'cost' ? Number(value) || 0 : value,
                    } as any),
              ),
            } as any),
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const deleteActivity = (stopId: string, actId: string) =>
    setTripWithHistory((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : ({
              ...s,
              activities: s.activities.filter((a) => a.id !== actId),
            } as any),
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  // --- reset all handler (called from the modal) ---
  const confirmResetAll = () => {
    setTripWithHistory((t0) => ({
      ...t0,
      title: '',
      stops: [],
      legs: [],
      // keep currency/participants if you want; or reset to defaults:
      // currency: 'EUR',
      participants: Math.max(1, Number(t0.participants) || 1),
      updatedAt: Date.now(),
    }))
    setSelectedStopId(null)
  }

  return (
    <div className="min-h-screen text-[var(--color-ink)]">
      {/* Planner UI (Topbar is now only in App.tsx) */}
      <div className="mx-auto max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 print:hidden">
        <div className="space-y-4">
          <StopsTimeline
            trip={trip}
            addStop={addStop}
            setStopField={setStopField}
            setSelectedStopId={setSelectedStopId}
            deleteStop={deleteStop}
            moveStop={moveStop}
            setLegField={setLegField}
            setTripField={setTripField}
            // NEW: ask parent to open custom reset modal
            onRequestResetAll={openReset}
          />
        </div>

        <aside className="lg:sticky lg:top-24 h-max">
          <BudgetPanel trip={trip} />
        </aside>
      </div>

      <div className="print:hidden">
        <StopSidebar
          trip={trip}
          selectedStopId={selectedStopId}
          setSelectedStopId={setSelectedStopId}
          addActivity={addActivity}
          setActivityField={setActivityField}
          deleteActivity={deleteActivity}
          setStopField={setStopField}
        />
      </div>

      <footer className="border-t border-[var(--color-border)] mt-8 print:hidden">
        <div className="mx-auto max-w-7xl p-6 flex flex-col items-center justify-center text-sm opacity-80">
          © {new Date().getFullYear()} OneTrip — {t('planner.motto')}
        </div>
      </footer>

      {/* Custom Reset Modal */}
      <ResetModal
        open={showReset}
        onClose={closeReset}
        onConfirm={confirmResetAll}
      />
    </div>
  )
}
