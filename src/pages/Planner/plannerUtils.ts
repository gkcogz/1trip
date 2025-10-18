import type { Trip } from "../../lib/types"

export const STORAGE_KEY = "onetrip_saved_trip"
export const HISTORY_LIMIT = 60

// Trip'i localStorage'dan yükler veya defaultTrip döner
export function loadTrip(initial: Trip): Trip {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : initial
  } catch {
    return initial
  }
}

// Undo/redo için yardımcı stack yönetimi
export function createHistoryStacks(limit = HISTORY_LIMIT) {
  const undoStack: Trip[] = []
  const redoStack: Trip[] = []

  const push = (prev: Trip) => {
    undoStack.push(prev)
    if (undoStack.length > limit) undoStack.shift()
    redoStack.length = 0
  }

  const undo = (current: Trip): Trip | null => {
    if (!undoStack.length) return null
    const prev = undoStack.pop()!
    redoStack.push(current)
    return prev
  }

  const redo = (current: Trip): Trip | null => {
    if (!redoStack.length) return null
    const next = redoStack.pop()!
    undoStack.push(current)
    return next
  }

  return { push, undo, redo }
}
