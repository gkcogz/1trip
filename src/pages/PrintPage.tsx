// src/pages/PrintPage.tsx
import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PrintSheet from "../components/PrintSheet"
import type { Trip } from "../lib/types"

type Props = { trip: Trip }

export default function PrintPage({ trip }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Give React a tick so the sheet mounts before printing
    const t = setTimeout(() => {
      const backTo = (location.state as any)?.from ?? "/planner"

      const handleAfterPrint = () => {
        window.removeEventListener("afterprint", handleAfterPrint)
        navigate(backTo, { replace: true })
      }

      window.addEventListener("afterprint", handleAfterPrint)
      window.print()
    }, 50)

    return () => clearTimeout(t)
  }, [location.state, navigate])

  // IMPORTANT: only the sheet is rendered on this route
  return <PrintSheet trip={trip} />
}
