// src/hooks/useDebouncedAutosave.ts

import { useEffect, useRef } from 'react'
import type { Trip } from '@lib/types'
import type { User } from '@supabase/supabase-js'

type AutosaveProps = {
  // Kaydedilecek veri
  data: Trip
  // Mevcut kullanıcı (giriş yapmamışsa null olabilir)
  user: User | null
  // Kaydetme işlemini yapacak olan asenkron fonksiyon
  saveAction: (userId: string, data: Trip) => Promise<void>
  // Gecikme süresi (milisaniye cinsinden)
  delay?: number
}

/**
 * Verilen bir veri parçasını, her değiştiğinde belirli bir gecikme (debounce)
 * ile otomatik olarak kaydetmek için kullanılan bir custom hook.
 * @param {AutosaveProps} props - Hook'un alacağı parametreler.
 */
export default function useDebouncedAutosave({
  data,
  user,
  saveAction,
  delay = 1500, // Varsayılan gecikme 1.5 saniye
}: AutosaveProps) {
  // İlk render'da kaydetme işlemini engellemek için bir ref kullanıyoruz.
  const isFirstRender = useRef(true)
  // Timeout ID'sini saklamak için bir ref kullanıyoruz.
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Eğer bu ilk render ise, hiçbir şey yapma ve ref'i güncelle.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Eğer kullanıcı giriş yapmamışsa, kaydetme işlemi yapamayız.
    if (!user) {
      console.log('Kullanıcı giriş yapmadığı için otomatik kaydetme pasif.')
      return
    }

    // Eğer önceki bir zamanlayıcı varsa, onu temizle.
    // Bu, debounce mekanizmasının temelini oluşturur.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Yeni bir zamanlayıcı başlat.
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('Değişiklik algılandı, otomatik kaydetme başlıyor...')
        await saveAction(user.id, data)
        console.log('✅ Rota başarıyla otomatik olarak kaydedildi.')
      } catch (error) {
        console.error('🔴 Otomatik kaydetme sırasında bir hata oluştu:', error)
      }
    }, delay)

    // Bu effect'in cleanup fonksiyonu.
    // Component unmount olduğunda veya effect yeniden çalıştığında
    // çalışan zamanlayıcıyı temizler.
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, user, saveAction, delay]) // Bu bağımlılıklardan herhangi biri değiştiğinde effect yeniden çalışır.
}