// src/pages/Planner.tsx

import { useRef, useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import type { Trip } from "../lib/types"
import { uid, clamp } from "../lib/utils"
import BudgetPanel from "../components/BudgetPanel"
import StopsTimeline from "../components/StopsTimeline"
import StopSidebar from "../components/StopSidebar"
import { useI18n } from "../i18n"
import Topbar from "../components/Topbar"
import PrintSheet from "../components/PrintSheet"
import { hashDecode } from "../lib/storage"
import { useAuth } from "../auth/AuthProvider"
import { saveTrip, getTrips, deleteTrip } from "@lib/trips"
import PlannerSidebar from "../components/PlannerSidebar"
import { toCSV } from "@lib/csv"
import useDebouncedAutosave from "../hooks/useDebouncedAutosave"
import LoadTripModal from '../components/LoadTripModal'
import ConfirmModal from '../components/ConfirmModal'
import { showToast } from "../components/ui"

const STORAGE_KEY = "onetrip_saved_trip"
const HISTORY_LIMIT = 60

function loadTrip(initial: Trip): Trip {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : initial
  } catch {
    return initial
  }
}

export default function PlannerWrapper({ printMode = false }: { printMode?: boolean }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultTrip: Trip = {
    id: "trip_" + uid(),
    title: "",
    currency: "EUR",
    participants: 1,
    stops: [],
    legs: [],
    updatedAt: Date.now(),
    ownerId: "local",
    createdAt: Date.now(),
  }

  const passedTrip = (location.state as any)?.trip

  const [trip, setTrip] = useState<Trip>(() => (passedTrip ? passedTrip : loadTrip(defaultTrip)))
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [isLoadModalOpen, setLoadModalOpen] = useState(false)
  const [isConfirmNewTripOpen, setConfirmNewTripOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, tripId: null as string | null });

  useDebouncedAutosave({
    data: trip,
    user: user,
    saveAction: saveTrip,
    delay: 1500,
  })

  // --- LocalStorage senkronizasyonu (her trip değiştiğinde hem autosave hem print yedekleri güncel tutulsun) ---
  useEffect(() => {
    try {
      const serialized = JSON.stringify(trip)
      localStorage.setItem("onetrip_saved_trip", serialized)          // 🟢 ana localStorage yedeği
      localStorage.setItem("onetrip_temp_print_trip", serialized)     // 🟢 print için geçici yedek
    } catch (err) {
      console.warn("Could not sync trip to localStorage:", err)
    }
  }, [trip])



  useEffect(() => {
    if (window.location.hash.startsWith("#plan=")) {
      try {
        const decoded = hashDecode()
        if (decoded) {
          setTrip(decoded)
          window.history.replaceState(null, "", window.location.pathname)
        }
      } catch (e) {
        console.error("Failed to load trip from URL", e)
      }
    }
  }, [])

  const undoStack = useRef<Trip[]>([])
  const redoStack = useRef<Trip[]>([])

  const setTripWithHistory = (next: Trip | ((trip: Trip) => Trip)) => {
    setTrip((prev) => {
      const value = typeof next === "function" ? (next as (trip: Trip) => Trip)(prev) : next
      undoStack.current.push(prev)
      if (undoStack.current.length > HISTORY_LIMIT) undoStack.current.shift()
      redoStack.current = []
      return value
    })
  }

  const undo = () => {
    if (!undoStack.current.length) return
    setTrip((curr) => {
      const prev = undoStack.current.pop()!
      redoStack.current.push(curr)
      return prev
    })
  }

  const redo = () => {
    if (!redoStack.current.length) return
    setTrip((curr) => {
      const next = redoStack.current.pop()!
      undoStack.current.push(curr)
      return next
    })
  }

  const setTripField = (field: keyof Trip, value: any) =>
    setTripWithHistory((trip) => {
      return {
        ...trip,
        [field]: field === "participants" ? Math.max(1, Number(value) || 1) : value,
        updatedAt: Date.now(),
      }
    })

  const handleSaveTrip = async () => {
    if (!user) return alert("Please login first")
    try {
      await saveTrip(user.id, trip)
      showToast("Trip saved to Supabase ✅", "success")
    } catch (err: any) {
      showToast("Error saving trip: " + err.message, "error")
    }
  }

  const handleLoadTrips = async () => {
    if (!user) return alert("Please login first")
    try {
      const trips = await getTrips(user.id)
      setSavedTrips(trips)
      setLoadModalOpen(true)
    } catch (err: any) {
      alert("Error loading trips: " + err.message)
    }
  }
  
  const handleNewTrip = () => {
    setConfirmNewTripOpen(true);
  }

  const executeNewTrip = () => {
    const newTrip: Trip = {
      ...defaultTrip,
      id: "trip_" + uid(),
      ownerId: user?.id || 'local',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setTrip(newTrip)
    undoStack.current = []
    redoStack.current = []
  }

  const handleSelectTrip = (tripData: Trip) => {
    setTrip(tripData)
    setLoadModalOpen(false)
  }

  const handleDeleteTrip = (tripId: string) => {
    if (!user) return;
    setDeleteConfirmation({ isOpen: true, tripId: tripId });
  };

  const executeDeleteTrip = async () => {
    const tripIdToDelete = deleteConfirmation.tripId;
    if (!user || !tripIdToDelete) return;

    try {
      await deleteTrip(tripIdToDelete, user.id);
      setSavedTrips(currentTrips => currentTrips.filter(t => t.id !== tripIdToDelete));
      if (trip.id === tripIdToDelete) {
        executeNewTrip();
      }
    } catch (error: any) {
      alert("Hata: Rota silinemedi. " + error.message);
    }
  };

  const exportJSON = () => {
    if (!trip) return
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = (trip.title || "trip") + ".json"
    a.click()
  }

  const exportCSV = () => {
    if (!trip) return
    const blob = new Blob([toCSV(trip)], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = (trip.title || "trip") + ".csv"
    a.click()
  }

  const handleGeneratePDF = () => {
    if (!trip) return
    navigate("/print", { state: { trip, from: location.pathname } })
  }

  const onImportJSON = (file: File) => {
    const r = new FileReader()
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result))
        setTrip(parsed)
      } catch {
        alert("Invalid JSON file")
      }
    }
    r.readAsText(file)
  }

  if (printMode) {
    return <PrintSheet trip={trip} />
  }

  return (
    <div className="min-h-screen flex flex-col pl-24">
      <Link to="/" title="Home" className="fixed top-4 left-6 z-50 print-hidden">
        <img
          src={trip?.logoDataUrl || '/logo.png'}
          alt="logo"
          className="h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110"
        />
      </Link>

      <LoadTripModal
        isOpen={isLoadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        trips={savedTrips}
        onSelectTrip={handleSelectTrip}
        onDeleteTrip={handleDeleteTrip}
      />
      
      <ConfirmModal
        isOpen={isConfirmNewTripOpen}
        onClose={() => setConfirmNewTripOpen(false)}
        onConfirm={executeNewTrip}
        title="Yeni Rota Oluştur"
      >
        Mevcut rotadaki kaydedilmemiş değişiklikler kaybolabilir. Yeni ve boş bir rota oluşturmak istediğinize emin misiniz?
      </ConfirmModal>

      <ConfirmModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, tripId: null })}
        onConfirm={executeDeleteTrip}
        title="Rotayı Sil"
      >
        Bu rotayı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
      </ConfirmModal>
      
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.currentTarget.files?.[0]
          if (f) onImportJSON(f)
          e.currentTarget.value = ""
        }}
      />

      <PlannerSidebar
        onUndo={undo}
        onRedo={redo}
        onImportJSON={() => fileRef.current?.click()}
        onExportJSON={exportJSON}
        onExportCSV={exportCSV}
        onGeneratePDF={handleGeneratePDF}
      />

      <div className="flex-1 flex flex-col">
        <Topbar trip={trip} setTripField={setTripField} variant="planner"/>
        <main className="flex-1">
          <Planner
            trip={trip}
            setTrip={setTripWithHistory}
            handleNewTrip={handleNewTrip}
            handleSaveTrip={handleSaveTrip}
            handleLoadTrips={handleLoadTrips}
          />
        </main>
      </div>
    </div>
  )
}

type PlannerProps = {
  trip: Trip
  setTrip: (next: Trip | ((trip: Trip) => Trip)) => void
  handleNewTrip: () => void
  handleSaveTrip: () => void
  handleLoadTrips: () => void
}

function Planner({ trip, setTrip, handleNewTrip, handleSaveTrip, handleLoadTrips }: PlannerProps) {
  const { t } = useI18n()
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  const addStop = () =>
    setTrip((trip) => {
      const sId = "s_" + uid()
      const newStop = { id: sId, city: "", stayNights: 2, activities: [] as any[], budget: {} as any }
      const stops = [...trip.stops, newStop]
      const legs = [...trip.legs]
      const prev = stops.length >= 2 ? stops[stops.length - 2] : undefined
      if (prev)
        legs.push({ id: "l_" + uid(), fromStopId: prev.id, toStopId: sId, mode: "train", cost: 0 })
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const deleteStop = (stopId: string) =>
    setTrip((trip) => {
      const stops = trip.stops.filter((s) => s.id !== stopId)
      const legs: typeof trip.legs = []
      for (let i = 0; i < stops.length - 1; i++) {
        legs.push({ id: "l_" + uid(), fromStopId: stops[i].id, toStopId: stops[i + 1].id, mode: "train", cost: 0 })
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
        legs.push({ id: "l_" + uid(), fromStopId: stops[k].id, toStopId: stops[k + 1].id, mode: "train", cost: 0 })
      }
      return { ...trip, stops, legs, updatedAt: Date.now() }
    })

  const setStopField = (stopId: string, field: any, value: any) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId ? s : field === "stayNights" ? { ...s, [field]: Number(value) || 0 } : { ...s, [field]: value }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const setLegField = (legId: string, field: any, value: any) =>
    setTrip((trip) => {
      const legs = trip.legs.map((l) =>
        l.id !== legId ? l : field === "cost" ? { ...l, [field]: Number(value) || 0 } : { ...l, [field]: value }
      )
      return { ...trip, legs, updatedAt: Date.now() }
    })

  const addActivity = (stopId: string) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : { ...s, activities: [...s.activities, { id: "a_" + uid(), title: t("planner.newActivity"), category: "other", cost: 0 }] }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const setActivityField = (stopId: string, actId: string, field: any, value: any) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId
          ? s
          : { ...s, activities: s.activities.map((a) => (a.id !== actId ? a : { ...a, [field]: field === "cost" ? Number(value) || 0 : value })) }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  const deleteActivity = (stopId: string, actId: string) =>
    setTrip((trip) => {
      const stops = trip.stops.map((s) =>
        s.id !== stopId ? s : { ...s, activities: s.activities.filter((a) => a.id !== actId) }
      )
      return { ...trip, stops, updatedAt: Date.now() }
    })

  return (
    <div className="min-h-screen text-[var(--color-ink)]">
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
            setTripField={(f, v) => setTrip((tr) => ({ ...tr, [f]: v, updatedAt: Date.now() }))}
            onNewTrip={handleNewTrip}
            onSaveTrip={handleSaveTrip}
            onLoadTrips={handleLoadTrips}
          />
        </div>
        <aside className="lg:sticky lg:top-24 h-max">
          <BudgetPanel trip={trip} />
        </aside>
      </div>
      <p className="text-sm text-gray-500 mt-4 italic text-center print-hidden">{t("planner.autosave")}</p>
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
          © {new Date().getFullYear()} OneTrip — {t("planner.motto")}
        </div>
      </footer>
    </div>
  )
}