// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Ortam değişkenleri: .env dosyasında tanımlanmalı
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
