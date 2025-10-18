import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Trip } from '@lib/types'
import { hashEncode } from '@lib/storage'
import ShareModal from './ShareModal'
import { useI18n } from '../i18n'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from '@lib/supabase'

type TopbarProps = {
  trip?: Trip
  setTripField?: (f: keyof Trip, v: any) => void
  variant?: 'planner' | 'default'
}

export default function Topbar({
  trip,
  setTripField,
  variant = 'default',
}: TopbarProps) {
  const { t, lang, setLang } = useI18n()
  const [showShare, setShowShare] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLangMenuOpen, setLangMenuOpen] = useState(false)
  const [isCurrencyMenuOpen, setCurrencyMenuOpen] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const currencyMenuRef = useRef<HTMLDivElement>(null)
  
  const { user } = useAuth()
  const hasPlannerControls = variant === 'planner' && !!trip && !!setTripField

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setLangMenuOpen(false)
        setCurrencyMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const shareUrl = () =>
    trip
      ? `${window.location.origin}${window.location.pathname}#plan=${hashEncode(trip)}`
      : window.location.href

  const share = async () => {
    const url = shareUrl()
    const title = trip?.title || 'OneTrip'
    const text = 'Check out my trip plan'
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch { /* user cancelled or not supported */ }
    }
    setShowShare(true)
  }

  const languageOptions: { [key: string]: { flag: string; name: string } } = {
    en: { flag: '🇬🇧', name: 'English' },
    tr: { flag: '🇹🇷', name: 'Türkçe' },
    de: { flag: '🇩🇪', name: 'Deutsch' },
  }

  const currencyOptions: { [key: string]: { symbol: string; name: string } } = {
    EUR: { symbol: '€', name: 'Euro' },
    USD: { symbol: '$', name: 'US Dollar' },
    TRY: { symbol: '₺', name: 'Turkish Lira' },
    GBP: { symbol: '£', name: 'British Pound' },
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--color-bg)]/85 border-b border-[var(--color-border)] shadow-sm print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {hasPlannerControls && (
            <>
              <input
                className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none"
                placeholder={t('topbar.title.placeholder')}
                value={trip!.title}
                onChange={(e) => setTripField!('title', e.target.value)}
              />
              
              <div className="relative" ref={currencyMenuRef}>
                <button
                  onClick={() => setCurrencyMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100/50 transition-colors"
                  title="Change currency"
                >
                  <span className="font-semibold text-[var(--color-accent)]">{currencyOptions[trip!.currency]?.symbol || trip!.currency}</span>
                  <span className="text-sm font-bold">{trip!.currency}</span>
                  {/* --- AŞAĞI OK İKONU BURADAN KALDIRILDI --- */}
                </button>
                {isCurrencyMenuOpen && (
                  <div 
                    className="absolute left-0 top-12 w-48 rounded-xl border border-[var(--color-border)] bg-white shadow-lg py-1 animate-fadeIn"
                    style={{ animationDuration: '150ms' }}
                  >
                    {Object.entries(currencyOptions).map(([code, { symbol, name }]) => (
                      <button
                        key={code}
                        onClick={() => { setTripField!('currency', code); setCurrencyMenuOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <span className="font-semibold w-5 text-center text-lg">{symbol}</span>
                        <span className="font-medium text-sm">{name} ({code})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white">
                <span>{t('topbar.people')}</span>
                <input
                  type="range" min={1} max={10}
                  value={Number(trip!.participants ?? 1)}
                  onChange={(e) => setTripField!('participants', Number(e.target.value))}
                  className="w-32 accent-[var(--color-brand)]"
                />
                <span className="font-medium text-[var(--color-accent)]">{Number(trip!.participants ?? 1)}</span>
                <span className="text-xl">👥</span>
              </label>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white"
            onClick={share}
            title={t('topbar.actions.share')}
          >
            {t('topbar.actions.share')}
          </button>

          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(o => !o)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100/50 transition-colors"
              title="Change language"
            >
              <span className="text-xl select-none">{languageOptions[lang]?.flag || '🌐'}</span>
            </button>
            {isLangMenuOpen && (
              <div 
                className="absolute right-0 top-12 w-40 rounded-xl border border-[var(--color-border)] bg-white shadow-lg py-1 animate-fadeIn"
                style={{ animationDuration: '150ms' }}
              >
                {Object.entries(languageOptions).map(([code, { flag, name }]) => (
                  <button
                    key={code}
                    onClick={() => { setLang(code as any); setLangMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    <span className="text-xl">{flag}</span>
                    <span className="font-medium text-sm">{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <span className="text-sm text-[var(--color-muted)]">{user.email}</span>
              <button onClick={handleLogout} className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded-lg bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]">
              Login
            </Link>
          )}

          <div className="relative" ref={menuRef}>
            <button
              className="flex flex-col justify-center items-center w-9 h-9 rounded-md border border-[var(--color-border)] bg-white hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
              title="Menu"
            >
              <span className="w-5 h-0.5 bg-gray-800 mb-1"></span>
              <span className="w-5 h-0.5 bg-gray-800 mb-1"></span>
              <span className="w-5 h-0.5 bg-gray-800"></span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 rounded-md border border-[var(--color-border)] bg-white shadow-md">
                <Link to="/blog" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  {t('menu.blog')}
                </Link>
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  {t('menu.about')}
                </Link>
                <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  {t('menu.contact')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <ShareModal open={showShare} url={shareUrl()} title={trip?.title || 'OneTrip route'} onClose={() => setShowShare(false)} />
    </header>
  )
}