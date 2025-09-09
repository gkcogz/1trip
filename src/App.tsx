// src/App.tsx
import React, { useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Topbar from "./components/Topbar"
import Planner from "./pages/Planner"
import PrintSheet from "./components/PrintSheet"
import About from "./pages/About"
import Contact from "./pages/Contact"
import type { Trip } from "./lib/types"
import { uid } from "./lib/utils"

// default trip for initialization
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

const App: React.FC = () => {
  const location = useLocation()
  const isPlanner = location.pathname.startsWith("/planner")

  // shared trip state
  const [trip, setTrip] = useState<Trip>(DEFAULT_TRIP)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show the generic Topbar only outside Planner */}
      {!isPlanner && (
        <Topbar
          trip={trip}
          setTripField={(f, v) =>
            setTrip((prev) => ({ ...prev, [f]: v, updatedAt: Date.now() }))
          }
        />
      )}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/planner" replace />} />
          <Route path="/planner" element={<Planner trip={trip} setTrip={setTrip} />} />
          <Route path="/print" element={<PrintSheet trip={trip} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/planner" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
