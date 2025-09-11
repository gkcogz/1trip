// src/pages/PrintPage.tsx
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PrintSheet from "../components/PrintSheet"
import type { Trip } from "../lib/types"

const STORAGE_KEY = "onetrip_saved_trip"

export default function PrintPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const passedTrip = (location.state as any)?.trip as Trip | undefined

  const trip: Trip | null =
    passedTrip ??
    (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })()

  // ✅ otomatik yazdır + geri dön
  useEffect(() => {
    const t = setTimeout(() => {
      const backTo = (location.state as any)?.from ?? "/"
      const handleAfterPrint = () => {
        window.removeEventListener("afterprint", handleAfterPrint)
        navigate(backTo, { replace: true })
      }
      window.addEventListener("afterprint", handleAfterPrint)
      window.print()
    }, 100)
    return () => clearTimeout(t)
  }, [location.state, navigate])

  if (!trip) return <div style={{ padding: 24 }}>No trip data</div>
  return <PrintSheet trip={trip} />
}
