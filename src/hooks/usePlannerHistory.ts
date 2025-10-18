import { useRef } from "react"
import type { Trip } from "../lib/types"

const HISTORY_LIMIT = 60

/**
 * usePlannerHistory:
 * - Undo / Redo desteği sağlayan özel hook.
 * - Değişiklikleri otomatik olarak stack içinde saklar.
 */
export default function usePlannerHistory() {
  const undoStack = useRef<Trip[]>([])
  const redoStack = useRef<Trip[]>([])

  const push = (prev: Trip) => {
    undoStack.current.push(prev)
    if (undoStack.current.length > HISTORY_LIMIT) undoStack.current.shift()
    redoStack.current = []
  }

  const undo = (current: Trip): Trip | null => {
    if (!undoStack.current.length) return null
    const prev = undoStack.current.pop()!
    redoStack.current.push(current)
    return prev
  }

  const redo = (current: Trip): Trip | null => {
    if (!redoStack.current.length) return null
    const next = redoStack.current.pop()!
    undoStack.current.push(current)
    return next
  }

  const reset = () => {
    undoStack.current = []
    redoStack.current = []
  }

  return { push, undo, redo, reset }
}
