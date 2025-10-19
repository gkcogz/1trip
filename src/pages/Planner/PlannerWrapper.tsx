import { useRef, useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../auth/AuthProvider"
import { useI18n } from "../../i18n"
import { hashDecode } from "../../lib/storage"
import { saveTrip, getTrips } from "@lib/trips"
import useDebouncedAutosave from "../../hooks/useDebouncedAutosave"
import PlannerSidebar from "../../components/PlannerSidebar"
import Topbar from "../../components/Topbar"
import PrintSheet from "../../components/PrintSheet"
import LoadTripModal from "../../components/LoadTripModal"
import ConfirmModal from "../../components/ConfirmModal"
import { showToast } from "../../components/ui"
import PlannerEditor from "./PlannerEditor"
import { loadTrip } from "./plannerUtils"
import type { Trip } from "../../lib/types"
import { uid } from "../../lib/utils"
import usePlannerHistory from "../../hooks/usePlannerHistory"

export default function PlannerWrapper({ printMode = false }: { printMode?: boolean }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fileRef = useRef<HTMLInputElement>(null)

  // --- History Hook ---
  const { push, undo, redo, reset } = usePlannerHistory()

  // --- Default Trip ---
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

  // --- Trip State ---
  const passedTrip = (location.state as any)?.trip
  const [trip, setTrip] = useState<Trip>(() =>
    passedTrip ? passedTrip : loadTrip(defaultTrip)
  )
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [isLoadModalOpen, setLoadModalOpen] = useState(false)
  const [isConfirmNewTripOpen, setConfirmNewTripOpen] = useState(false)

  // --- Autosave & Local Sync ---
  useDebouncedAutosave({ data: trip, user, saveAction: saveTrip, delay: 1500 })

  useEffect(() => {
    try {
      const serialized = JSON.stringify(trip)
      localStorage.setItem("onetrip_saved_trip", serialized)
      localStorage.setItem("onetrip_temp_print_trip", serialized)
    } catch (err) {
      console.warn("Could not sync trip:", err)
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

  // --- Undo/Redo destekli Trip Setter ---
  const setTripWithHistory = (next: Trip | ((trip: Trip) => Trip)) => {
    setTrip((prev) => {
      const value =
        typeof next === "function" ? (next as (trip: Trip) => Trip)(prev) : next
      push(prev)
      return value
    })
  }

  // --- CRUD + Export Fonksiyonları ---
  const handleSaveTrip = async () => {
    if (!user) return showToast("Please login first", "info")
    try {
      await saveTrip(user.id, trip)
      showToast("Trip saved to Supabase ✅", "success")
    } catch (err: any) {
      showToast("Error saving trip: " + err.message, "error")
    }
  }

  const handleLoadTrips = async () => {
    if (!user) return showToast("Please login first", "info")
    try {
      const trips = await getTrips(user.id)
      setSavedTrips(trips)
      setLoadModalOpen(true)
    } catch (err: any) {
      showToast("Error loading trips: " + err.message, "error")
    }
  }

  const handleNewTrip = () => setConfirmNewTripOpen(true)

  const executeNewTrip = () => {
    reset()
    setTrip(defaultTrip)
    showToast("New trip started", "info")
  }

  const handleGeneratePDF = () => {
    if (!trip) return
    navigate("/print", { state: { trip, from: location.pathname } })
  }

  // --- Print Mode ---
  if (printMode) return <PrintSheet trip={trip} />

  // --- UI ---
  return (
    <div className="min-h-screen flex flex-col pl-24">
      <Link
        to="/"
        title="Home"
        className="fixed top-4 left-6 z-50 print-hidden"
      >
        <img
          src={trip?.logoDataUrl || "/logo.png"}
          alt="logo"
          className="h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110"
        />
      </Link>

      {/* 🔹 Sidebar (Undo/Redo entegre) */}
      <PlannerSidebar
        onUndo={() => {
          const prev = undo(trip)
          if (prev) setTrip(prev)
        }}
        onRedo={() => {
          const next = redo(trip)
          if (next) setTrip(next)
        }}
        onImportJSON={() => fileRef.current?.click()}
        onExportJSON={() => {
          const blob = new Blob([JSON.stringify(trip, null, 2)], {
            type: "application/json",
          })
          const a = document.createElement("a")
          a.href = URL.createObjectURL(blob)
          a.download = (trip.title || "trip") + ".json"
          a.click()
        }}
        onExportCSV={() => {
          showToast("CSV export coming soon ⚙️", "info")
        }}
        onGeneratePDF={handleGeneratePDF}
      />

      <Topbar trip={trip} setTripField={() => {}} variant="planner" />

      {/* 🔹 Main Planner Editor */}
      <main className="flex-1">
        <PlannerEditor
          trip={trip}
          setTrip={setTripWithHistory}
          handleNewTrip={handleNewTrip}
          handleSaveTrip={handleSaveTrip}
          handleLoadTrips={handleLoadTrips}
        />
      </main>

      {/* 🔹 Modals */}
      <LoadTripModal
        isOpen={isLoadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        trips={savedTrips}
        onSelectTrip={setTrip}
        onDeleteTrip={() => {}} // ✅ add this line
      />

      <ConfirmModal
        isOpen={isConfirmNewTripOpen}
        onClose={() => setConfirmNewTripOpen(false)}
        onConfirm={executeNewTrip}
        title="Yeni Rota Oluştur"
      >
        Mevcut rotadaki kaydedilmemiş değişiklikler kaybolabilir. Emin misiniz?
      </ConfirmModal>
    </div>
  )
}
