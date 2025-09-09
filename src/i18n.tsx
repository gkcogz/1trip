// src/i18n.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import languages from './languages.json'

export type Lang = 'tr' | 'en' | 'de'
type Dict = Record<string, Record<Lang, string>>

type I18nValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18N_KEY = 'onetrip_lang'
const I18nCtx = createContext<I18nValue | null>(null)

function detectLang(): Lang {
  const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(I18N_KEY)) as Lang | null
  if (stored === 'tr' || stored === 'en' || stored === 'de') return stored
  const n = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
  if (n.startsWith('tr')) return 'tr'
  if (n.startsWith('de')) return 'de'
  return 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang())

  useEffect(() => {
    try { localStorage.setItem(I18N_KEY, lang) } catch {}
    try { document.documentElement.lang = lang } catch {}
  }, [lang])

  const t = (key: string, vars?: Record<string, string | number>) => {
    const dict = (languages as Dict)[key]
    const template = dict?.[lang] ?? dict?.en ?? key
    if (!vars) return template
    return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
  }

  const value = useMemo<I18nValue>(() => ({
    lang,
    setLang: (l) => setLangState(l),
    t,
  }), [lang])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>')
  return ctx
}
