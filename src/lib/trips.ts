// src/lib/trips.ts

import { supabase } from './supabaseClient' // supabaseClient'tan import etmek daha doğru olabilir.
import { Trip } from './types'

/**
 * Bir seyahat planını (trip) Supabase veritabanına kaydeder veya günceller.
 * upsert metodu sayesinde, gönderilen id'ye sahip bir kayıt varsa onu günceller,
 * yoksa yeni bir kayıt oluşturur.
 * @param userId - Mevcut kullanıcının ID'si.
 * @param trip - Kaydedilecek seyahat nesnesi.
 */
export async function saveTrip(userId: string, trip: Trip) {
  // trip nesnesinin bir ID'si olduğundan emin olmak için kontrol ekledik.
  if (!trip.id) {
    console.error("Kaydedilecek rotanın bir ID'si yok! İşlem iptal edildi.");
    return;
  }

  const { error } = await supabase
    .from('trips')
    .upsert([
      {
        id: trip.id, // ÖNEMLİ: Her seyahati kendi ID'si ile eşleştirmek için bu satırı ekledik.
        user_id: userId,
        title: trip.title || 'İsimsiz Rota',
        currency: trip.currency,
        participants: trip.participants,
        data: trip // Tüm rota verisini JSONB olarak saklıyoruz.
      }
    ])
  if (error) throw error
}

/**
 * Belirli bir kullanıcıya ait tüm seyahat planlarını getirir.
 * @param userId - Mevcut kullanıcının ID'si.
 * @returns Kullanıcının seyahat planlarının bir dizisini döndürür.
 */
export async function getTrips(userId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false }) // En son güncellenen en üstte olacak şekilde sıraladık.
  if (error) throw error
  return data
}

// src/lib/trips.ts dosyasının altına ekleyin

/**
 * Belirtilen ID'ye sahip seyahat planını veritabanından siler.
 * @param tripId - Silinecek seyahatin ID'si.
 * @param userId - İşlemi yapan kullanıcının ID'si (güvenlik için).
 */
export async function deleteTrip(tripId: string, userId: string) {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId) // Sadece bu ID'ye sahip olanı sil
    .eq('user_id', userId); // ve sadece bu kullanıcıya aitse sil

  if (error) throw error;
}