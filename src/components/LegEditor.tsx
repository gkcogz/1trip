// src/components/LegEditor.tsx
import React from 'react'
import { Leg } from '../lib/types'
import { ModeButton } from './ui'
import { useI18n } from '../i18n'

export default function LegEditor({
  leg,
  setLegField,
}: {
  leg: Leg | undefined
  setLegField: (id: string, field: any, value: any) => void
}) {
  const { t } = useI18n()
  if (!leg) return null

  return (
    <div className="px-4 pb-4">
      <div className="rounded-xl border border-[var(--color-border)] p-3 bg-neutral-50 shadow-sm flex flex-wrap items-center gap-3">
        <span className="mr-1">{t('legEditor.header')}</span>

        <div className="flex items-center gap-2">
          <ModeButton
            active={leg.mode === 'plane'}
            onClick={() => setLegField(leg.id, 'mode', 'plane')}
          >
            <span aria-hidden>✈️</span>
            <span className="sr-only">{t('legEditor.plane')}</span>
            <span aria-hidden className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-200 ease-out">{t('legEditor.plane')}</span>
          </ModeButton>

          <ModeButton
            active={leg.mode === 'train'}
            onClick={() => setLegField(leg.id, 'mode', 'train')}
          >
            <span aria-hidden>🚆</span>
            <span className="sr-only">{t('legEditor.train')}</span>
            <span aria-hidden className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-200 ease-out">{t('legEditor.train')}</span>
          </ModeButton>

          <ModeButton
            active={leg.mode === 'bus'}
            onClick={() => setLegField(leg.id, 'mode', 'bus')}
          >
            <span aria-hidden>🚌</span>
            <span className="sr-only">{t('legEditor.bus')}</span>
            <span aria-hidden className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-200 ease-out">{t('legEditor.bus')}</span>
          </ModeButton>

          <ModeButton
            active={leg.mode === 'car'}
            onClick={() => setLegField(leg.id, 'mode', 'car')}
          >
            <span aria-hidden>🚗</span>
            <span className="sr-only">{t('legEditor.car')}</span>
            <span aria-hidden className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-200 ease-out">{t('legEditor.car')}</span>
          </ModeButton>
        </div>

        <label className="inline-flex items-center gap-2 px-2 py-2 rounded-lg border border-[var(--color-border)] bg-white ml-auto">
          <span>{t('legEditor.cost')}</span>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min={0}
            className="w-28 bg-transparent outline-none"
            value={leg.cost || 0}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => setLegField(leg.id, 'cost', Number(e.target.value) || 0)}
          />
        </label>
      </div>
    </div>
  )
}
