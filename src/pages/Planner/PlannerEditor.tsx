import { useState } from "react"
import { uid, clamp } from "../../lib/utils"
import StopsTimeline from "../../components/StopsTimeline"
import StopSidebar from "../../components/StopSidebar"
import BudgetPanel from "../../components/BudgetPanel"
import { useI18n } from "../../i18n"
import type { Trip } from "../../lib/types"

type PlannerEditorProps = {
  trip: Trip
  setTrip: (next: Trip | ((trip: Trip) => Trip)) => void
  handleNewTrip: () => void
  handleSaveTrip: () => void
  handleLoadTrips: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export default function PlannerEditor({
  trip,
  setTrip,
  handleNewTrip,
  handleSaveTrip,
  handleLoadTrips,
  canUndo,
  canRedo,
}: PlannerEditorProps) {
  const { t } = useI18n()
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  // --- 🏙️ STOP FONKSİYONLARI ---
  const addStop = () =>
    setTrip((trip) => {
      const sId = "s_" + uid()
      const newStop = { id: sId, city: "", stayNights: 2, activities: [], budget: {} }
      const stops = [...trip.stops, newStop]
      const legs = [...trip.legs]
      const prev = stops.length >= 2 ? stops[stops.length - 2] : undefined
      if (prev)
        legs.push({
          id: "l_" + uid(),
          fromStopId: prev.id,
          toStopId: sId,
          mode: "train",
          cost: 0,
        })
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const deleteStop = (stopId: string) =>
    setTrip((trip) => {
      const stops = trip.stops.filter((s) => s.id !== stopId)
      const legs: typeof trip.legs = []
      for (let i = 0; i < stops.length - 1; i++) {
        legs.push({
          id: "l_" + uid(),
          fromStopId: stops[i].id,
          toStopId: stops[i + 1].id,
          mode: "train",
          cost: 0,
        })
      }
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const moveStop = (stopId: string, dir: "up" | "down") =>
    setTrip((trip) => {
      const i = trip.stops.findIndex((s) => s.id === stopId)
      if (i < 0) return trip
      const j = clamp(i + (dir === "up" ? -1 : 1), 0, trip.stops.length - 1)
      if (i === j) return trip
      const stops = [...trip.stops]
      const [s] = stops.splice(i, 1)
      stops.splice(j, 0, s)
      const legs: typeof trip.legs = []
      for (let k = 0; k < stops.length - 1; k++) {
        legs.push({
          id: "l_" + uid(),
          fromStopId: stops[k].id,
          toStopId: stops[k + 1].id,
          mode: "train",
          cost: 0,
        })
      }
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const setStopField = (stopId: string, field: keyof Trip["stops"][0], value: any) =>
    setTrip((trip) => {
      const updatedStops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : { ...s, [field]: field === "stayNights" ? Number(value) || 0 : value }
      )
      return { ...trip, stops: updatedStops, updatedAt: Date.now() }
    })

  // --- 🚆 LEG FONKSİYONLARI ---
  const setLegField = (legId: string, field: keyof Trip["legs"][0], value: any) =>
    setTrip((trip) => {
      const updatedLegs = trip.legs.map((l) =>
        l.id !== legId
          ? l
          : { ...l, [field]: field === "cost" ? Number(value) || 0 : value }
      )
      return { ...trip, legs: updatedLegs, updatedAt: Date.now() }
    })

  // --- 🎯 ACTIVITY FONKSİYONLARI ---
  const addActivity = (stopId: string) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : {
              ...s,
              activities: [
                ...s.activities,
                {
                  id: "a_" + uid(),
                  title: t("planner.newActivity"),
                  category: "other",
                  cost: 0,
                },
              ],
            }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const setActivityField = (
    stopId: string,
    actId: string,
    field: keyof Trip["stops"][0]["activities"][0],
    value: any
  ) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : {
              ...s,
              activities: s.activities.map((a) =>
                a.id !== actId
                  ? a
                  : { ...a, [field]: field === "cost" ? Number(value) || 0 : value }
              ),
            }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const deleteActivity = (stopId: string, actId: string) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : { ...s, activities: s.activities.filter((a) => a.id !== actId) }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  // --- 🧩 RENDER ---
  return (
    <div className="min-h-screen text-[var(--color-ink)]">
      {/* Main Layout */}
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
            setTripField={(f, v) =>
              setTrip((tr) => ({ ...tr, [f]: v, updatedAt: Date.now() }))
            }
            onNewTrip={handleNewTrip}
            onSaveTrip={handleSaveTrip}
            onLoadTrips={handleLoadTrips}
          />
        </div>

        <aside className="lg:sticky lg:top-24 h-max">
          <BudgetPanel trip={trip} />
        </aside>
      </div>

      <p className="text-sm text-gray-500 mt-4 italic text-center print:hidden">
        {t("planner.autosave")}
      </p>

      {/* Sidebar */}
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

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-8 print:hidden">
        <div className="mx-auto max-w-7xl p-6 flex flex-col items-center justify-center text-sm opacity-80">
          © {new Date().getFullYear()} OneTrip — {t("planner.motto")}
        </div>
      </footer>
    </div>
  )
}
