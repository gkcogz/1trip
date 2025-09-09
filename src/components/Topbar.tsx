// src/components/Topbar.tsx
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { Trip } from '@lib/types'
import { toCSV } from '@lib/csv'
import { hashEncode } from '@lib/storage'
import ShareModal from './ShareModal'
import { useI18n } from '../i18n'

type TopbarProps = {
  trip?: Trip
  setTripField?: (f: keyof Trip, v: any) => void
  onUndo?: () => void
  onRedo?: () => void
  onImportJSON?: (file: File) => void
}

export default function Topbar({
  trip,
  setTripField,
  onUndo,
  onRedo,
  onImportJSON,
}: TopbarProps) {
  const { t, lang, setLang } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)
  const [showShare, setShowShare] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const hasPlannerControls = !!trip && !!setTripField

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const shareUrl = () =>
    trip ? location.origin + location.pathname + `#plan=${hashEncode(trip)}`
         : location.href

  const share = async () => {
    const url = shareUrl()
    const title = trip?.title || 'OneTrip'
    const text = 'Check out my trip plan'
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch { /* cancelled or unsupported */ }
    }
    setShowShare(true)
  }

  const exportJSON = () => {
    if (!trip) return
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (trip.title || 'trip') + '.json'
    a.click()
  }

  const exportCSV = () => {
    if (!trip) return
    const blob = new Blob([toCSV(trip)], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (trip.title || 'trip') + '.csv'
    a.click()
  }

  const handleGeneratePDF = () => {
    navigate("/print", { state: { from: location.pathname } })
  }

  const travelerEmoji = (n: number) => {
    if (n === 1) return '👤'
    if (n === 2) return '👥'
    if (n >= 3 && n <= 5) return '🧑‍🤝‍🧑'
    if (n > 5) return '🧑‍🤝‍🧑+'
    return '👤'
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--color-bg)]/85 border-b border-[var(--color-border)] shadow-sm print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">

        {/* LEFT: Hamburger + planner inputs */}
        <div className="flex items-center gap-3 min-w-0">
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
              <div className="absolute left-0 top-11 w-44 rounded-md border border-[var(--color-border)] bg-white shadow-md">
                <Link
                  to="/about"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('menu.about')}
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('menu.contact')}
                </Link>
              </div>
            )}
          </div>

          {hasPlannerControls && (
            <>
              <input
                className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none"
                placeholder={t('topbar.title.placeholder')}
                value={trip!.title}
                onChange={(e) => setTripField!('title', e.target.value)}
              />
              <select
                value={trip!.currency}
                onChange={(e) => setTripField!('currency', e.target.value)}
                className="px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white"
              >
                <option>EUR</option>
                <option>USD</option>
                <option>TRY</option>
                <option>GBP</option>
              </select>
              <label className="flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white">
                <span>{t('topbar.people')}</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={trip!.participants}
                  onChange={(e) => setTripField!('participants', Number(e.target.value))}
                  className="w-32 accent-[var(--color-brand)]"
                />
                <span className="font-medium text-[var(--color-accent)]">{trip!.participants}</span>
                <span className="text-xl">{travelerEmoji(trip!.participants)}</span>
              </label>
            </>
          )}
        </div>

        {/* CENTER: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" title="Home">
            <img
              src={trip?.logoDataUrl || '/logo.png'}
              alt="logo"
              className="h-12 w-12 rounded-full shadow-sm"
            />
          </Link>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white"
            onClick={share}
            title={t('topbar.actions.share')}
          >
            {t('topbar.actions.share')}
          </button>

          {/* Language Selector - minimal flags only */}
          <label className="px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white flex items-center gap-2">
            <span>🌐</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent outline-none"
            >
              <option value="tr">🇹🇷</option>
              <option value="en">🇬🇧</option>
              <option value="de">🇩🇪</option>
            </select>
          </label>

          {hasPlannerControls && (
            <nav className="toolbar flex items-center gap-2">
              <div className="segment">
                <button onClick={exportJSON} className="px-2 py-1 rounded-md border" title={t('topbar.exportJSON')}>🧾</button>
                <button onClick={exportCSV} className="px-2 py-1 rounded-md border" title={t('topbar.exportCSV')}>📊</button>
                <button onClick={handleGeneratePDF} className="px-2 py-1 rounded-md border" title={t('topbar.print')}>🖨️</button>
              </div>
              <div className="segment">
                <button onClick={onUndo} className="px-2 py-1 rounded-md border" title={t('topbar.undo')}>↩️</button>
                <button onClick={onRedo} className="px-2 py-1 rounded-md border" title={t('topbar.redo')}>↪️</button>
              </div>
              <div className="segment">
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.currentTarget.files?.[0]
                    if (f && onImportJSON) onImportJSON(f)
                    e.currentTarget.value = ''
                  }}
                />
                <button onClick={() => fileRef.current?.click()} className="px-2 py-1 rounded-md border" title={t('topbar.importJSON') || 'Import JSON'}>📥</button>
              </div>
            </nav>
          )}
        </div>
      </div>

      <ShareModal open={showShare} url={shareUrl()} onClose={() => setShowShare(false)} />
    </header>
  )
}
