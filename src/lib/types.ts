export type TransportMode = 'plane' | 'train' | 'bus' | 'car'
export type ActivityCategory = 'nature' | 'food' | 'culture' | 'nightlife' | 'other'

export interface Activity {
  id: string
  title: string
  category: ActivityCategory
  note?: string
  cost?: number
  timeTag?: string
}

export interface StopBudget {
  lodgingPerNight?: number
  foodPerDay?: number
  other?: number
}

export interface Stop {
  id: string
  city: string
  stayNights: number
  startDate?: string
  activities: Activity[]
  budget: StopBudget
}

export interface TransportLeg {
  id: string
  fromStopId: string
  toStopId: string
  mode: TransportMode
  cost?: number
  durationHours?: number
}

export interface TripBudgetBreakdown {
  transport: number
  lodging: number
  food: number
  activities: number
  other: number
  total: number
}

export interface Trip {
  id: string
  ownerId: string
  title: string
  currency: string
  participants: number
  stops: Stop[]
  legs: TransportLeg[]
  createdAt: number
  updatedAt: number
  logoDataUrl?: string
}
