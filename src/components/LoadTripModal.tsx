// src/components/LoadTripModal.tsx

import type { Trip } from '../lib/types'
import { EmojiButton } from './ui'

// Supabase'den gelen trip verisinin tipini belirliyoruz
type SupabaseTrip = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  title: string
  currency: string
  participants: number
  data: Trip // Asıl trip nesnesi 'data' alanında
}

type Props = {
  isOpen: boolean
  onClose: () => void
  trips: SupabaseTrip[]
  onSelectTrip: (tripData: Trip) => void
  onDeleteTrip: (tripId: string) => void // YENİ: Silme fonksiyonu prop'u
}

export default function LoadTripModal({ isOpen, onClose, trips, onSelectTrip, onDeleteTrip }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
         style={{ animationDuration: '150ms' }}
         onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4"
           onClick={(e) => e.stopPropagation()} // Pencereye tıklayınca kapanmasını engelle
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-brand)]">
                Kayıtlı Rotalarım
            </h2>
            <EmojiButton
                emoji="✖️"
                label="Kapat"
                title="Kapat"
                onClick={onClose}
                variant="ghost"
            />
        </div>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {trips.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] text-center py-8">
              Henüz kayıtlı bir rotanız bulunmuyor.
            </p>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-[var(--color-border)]"
              >
                <div>
                  <div className="font-medium text-[var(--color-accent)]">{trip.title || 'İsimsiz Rota'}</div>
                  <div className="text-xs text-[var(--color-muted)] mt-1">
                    Son güncelleme: {new Date(trip.updated_at).toLocaleString()}
                  </div>
                </div>
                {/* DEĞİŞİKLİK: Butonlar gruplandı ve sil butonu eklendi */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSelectTrip(trip.data)}
                        className="px-3 py-1.5 bg-[var(--color-brand)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
                    >
                        Yükle
                    </button>
                    <button
                        onClick={() => onDeleteTrip(trip.id)}
                        title="Bu rotayı sil"
                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        🗑️
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}