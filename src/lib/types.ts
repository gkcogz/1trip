// src/lib/types.ts

// --- Primitive types ---
export type TransportMode = 'plane' | 'train' | 'bus' | 'car'
export type ActivityCategory = 'nature' | 'food' | 'culture' | 'nightlife' | 'other'

// --- Activity ---
export interface Activity {
  id: string
  title: string
  category: ActivityCategory
  note?: string
  cost?: number
  timeTag?: string
}

// --- Stop Budget ---
export interface StopBudget {
  lodgingPerNight?: number
  lodgingTotal?: number   // 🔹 hesaplama kolaylığı için eklendi
  foodPerDay?: number
  other?: number
}

// --- Stop ---
export interface Stop {
  id: string
  city: string
  stayNights: number
  startDate?: string
  activities: Activity[]
  budget: StopBudget
}

// --- Leg ---
export interface Leg {
  id: string
  fromStopId: string
  toStopId: string
  mode?: TransportMode
  cost?: number
  durationHours?: number
}

// --- Budget breakdown ---
export interface TripBudgetBreakdown {
  transport: number
  lodging: number
  food: number
  activities: number
  other: number
  total: number
}

// --- Trip ---
export interface Trip {
  id: string
  ownerId?: string         // opsiyonel yaptık: bazı yerlerde yok
  title?: string
  currency?: string
  participants?: number
  stops: Stop[]
  legs: Leg[]
  createdAt?: number
  updatedAt?: number
  logoDataUrl?: string
}
