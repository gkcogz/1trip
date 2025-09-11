// src/lib/types.ts

export type TransportMode =
  | 'plane'
  | 'train'
  | 'bus'
  | 'car'
  | 'ship'
  | 'walk'

export type Activity = {
  id: string
  title: string
  category: string
  cost: number
  note?: string
}

export type Budget = {
  lodgingPerNight?: number
  lodgingTotal?: number
  foodPerDay?: number
  other?: number
}

export type Stop = {
  id: string
  city: string
  /** ISO tarih (yyyy-mm-dd) formatında geliş tarihi */
  arrivalDate?: string
  /** ISO tarih (yyyy-mm-dd) formatında ayrılış tarihi */
  departureDate?: string
  /** Sistem tarafından arrival-departure farkından hesaplanır */
  stayNights: number
  activities: Activity[]
  budget: Budget
}

export type Leg = {
  id: string
  fromStopId: string
  toStopId: string
  mode: TransportMode
  cost: number
}

export type Trip = {
  id: string
  title: string
  currency: string
  participants: number
  stops: Stop[]
  legs: Leg[]
  logoDataUrl?: string
  createdAt?: number
  updatedAt?: number
  ownerId?: string
}

// ✅ BudgetPanel için eklenen tip
export type TripBudgetBreakdown = {
  transport?: number
  lodging?: number
  food?: number
  activities?: number
  other?: number
}
