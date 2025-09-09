// src/App.tsx
import React, { useRef, useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Topbar from "./components/Topbar"
import Planner from "./pages/Planner"
import PrintPage from "./pages/PrintPage"
import About from "./pages/About"
import Contact from "./pages/Contact"
import type { Trip } from "./lib/types"
import { uid } from "./lib/utils"

const DEFAULT_TRIP: Trip = {
  id: "t_" + uid(),
  ownerId: "local",
  title: "OneTrip",
  currency: "EUR",
  participants: 1,
  stops: [],
  legs: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

const HISTORY_LIMIT = 60

const App: React.FC = () => {
  const location = useLocation()
  const isPrint = location.pathname.startsWith("/print")

  const [trip, setTrip] = useState<Trip>(DEFAULT_TRIP)

  const undoStack = useRef<Trip[]>([])
  const redoStack = useRef<Trip[]>([])

  const setTripWithHistory = (next: Trip | ((t: Trip) => Trip)) => {
    setTrip(prev => {
      const value = typeof next === "function" ? (next as (t: Trip) => Trip)(prev) : next
      undoStack.current.push(prev)
      if (undoStack.current.length > HISTORY_LIMIT) undoStack.current.shift()
      redoStack.current = []
      return value
    })
  }

  const undo = () => {
    if (!undoStack.current.length) return
    setTrip(curr => {
      const prev = undoStack.current.pop()!
      redoStack.current.push(curr)
      return prev
    })
  }

  const redo = () => {
    if (!redoStack.current.length) return
    setTrip(curr => {
      const next = redoStack.current.pop()!
      undoStack.current.push(curr)
      return next
    })
  }

  const setTripField = (field: keyof Trip, value: any) =>
    setTripWithHistory(tr => ({
      ...tr,
      [field]: field === "participants" ? Math.max(1, Number(value) || 1) : value,
      updatedAt: Date.now(),
    }))

  const handleImportJSON = (f: File) => {
    const r = new FileReader()
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result))
        setTrip(parsed)
      } catch {
        alert("Invalid JSON file")
      }
    }
    r.readAsText(f)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide Topbar on /print so only the sheet exists */}
      {!isPrint && (
        <Topbar
          trip={trip}
          setTripField={setTripField}
          onUndo={undo}
          onRedo={redo}
          onImportJSON={handleImportJSON}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/planner" replace />} />
          <Route path="/planner" element={<Planner trip={trip} setTrip={setTripWithHistory} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/print" element={<PrintPage trip={trip} />} />
          <Route path="*" element={<Navigate to="/planner" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
