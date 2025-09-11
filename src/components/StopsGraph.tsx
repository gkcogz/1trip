// src/components/StopsGraph.tsx
import React, { useMemo, useRef } from 'react'
import { Trip, TransportMode } from '../lib/types'
import { EmojiButton } from './ui'
import { useI18n } from '../i18n'

type Props = {
  trip: Trip
  wrapperRef?: React.RefObject<HTMLDivElement> | null
  activeStopId?: string | null
  onActivate?: (id: string | null, fromPos?: { x: number; y: number }) => void
  onReset?: () => void
  printSafe?: boolean
}

function modeIcon(mode?: TransportMode) {
  if (mode === 'plane') return { emoji: '✈️', label: 'Plane' }
  if (mode === 'train') return { emoji: '🚄', label: 'Train' }
  if (mode === 'bus') return { emoji: '🚌', label: 'Bus' }
  if (mode === 'car') return { emoji: '🚗', label: 'Car' }
  if (mode === 'ship') return { emoji: '🚢', label: 'Ship' }
  if (mode === 'walk') return { emoji: '🚶', label: 'Walk' }
  return { emoji: '❓', label: 'Unknown' }
}

export default function StopsGraph({
  trip, wrapperRef, activeStopId, onActivate, onReset, printSafe = false
}: Props) {
  const { t } = useI18n()
  const stops = trip.stops ?? []
  const legs  = trip.legs  ?? []
  const n = stops.length

  const PAD = 8
  const xs = useMemo(
    () => stops.map((_, i) => (n <= 1 ? 50 : PAD + (i * (100 - 2 * PAD)) / (n - 1))),
    [n, stops]
  )

  const legMode = (i: number): TransportMode | undefined => {
    const from = stops[i]?.id
    const to   = stops[i + 1]?.id
    return legs.find(l => l.fromStopId === from && l.toStopId === to)?.mode as TransportMode | undefined
  }

  const graphRef = useRef<HTMLDivElement>(null)

  const handleNodeClick = (index: number) => {
    if (printSafe) return // disable clicks in print mode
    const id = stops[index].id
    if (!graphRef.current || !wrapperRef?.current || !onActivate) return
    const g = graphRef.current.getBoundingClientRect()
    const w = wrapperRef.current.getBoundingClientRect()
    const cx = g.left - w.left + (xs[index] / 100) * g.width
    const cy = g.top  - w.top  + g.height / 2
    onActivate(activeStopId === id ? null : id, { x: cx, y: cy })
  }

  const Y = 33
  const MASK_R = 2.25
  const SEG_STROKE = 4

  return (
    <div
      className={`relative rounded-2xl border border-[var(--color-border)] shadow-sm p-4 overflow-visible ${
        printSafe ? 'bg-transparent' : 'bg-white'
      }`}
      ref={graphRef}
    >
      {!printSafe && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-[var(--color-accent)]">{t('graph.header')}</div>
          {onReset && (
            <EmojiButton
              emoji="🗑️"
              label={t('common.reset')}
              title={t('graph.reset')}
              onClick={() => onReset()}
              variant="btn"
              className="!bg-red-600 hover:!bg-red-700 border-red-600 text-white px-3 py-1 rounded-lg"
            />
          )}
        </div>
      )}

      <div className="relative w-full h-16">
        {/* Base line */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {n >= 2 && (
            <line x1={8} y1={Y} x2={100 - 8} y2={Y}
                  stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" />
          )}
          {n >= 2 && xs.slice(0, -1).map((x, i) => {
            const x2 = xs[i + 1]
            return (
              <line key={`seg-${i}`} x1={x} y1={Y} x2={x2} y2={Y}
                    stroke="var(--color-brand)" strokeWidth={SEG_STROKE} strokeLinecap="round" />
            )
          })}
          {xs.map((x, i) => (
            <circle key={`mask-${i}`} cx={x} cy={Y} r={MASK_R} fill="white" />
          ))}
        </svg>

        {/* Transport icons with hover-expand */}
        {n >= 2 && xs.slice(0, -1).map((x, i) => {
          const x2 = xs[i + 1]
          const mid = (x + x2) / 2
          const { emoji, label } = modeIcon(legMode(i))
          return (
            <div
              key={`icon-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none text-xl group flex items-center"
              style={{ left: `${mid}%`, top: '50%' }}
            >
              <span>{emoji}</span>
              <span
                className="ml-1 max-w-0 opacity-0 overflow-hidden whitespace-nowrap 
                           group-hover:max-w-[100px] group-hover:opacity-100 
                           transition-all duration-200 ease-out text-sm text-[var(--color-accent)]"
              >
                {label}
              </span>
            </div>
          )
        })}

        {/* Stop nodes with active highlighting */}
        {stops.map((s, i) => {
          const isActive = s.id === activeStopId
          return (
            <div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
              style={{ left: `${xs[i]}%`, top: '50%' }}
              onClick={() => handleNodeClick(i)}
            >
              <span
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center 
                  ${isActive
                    ? 'bg-white border-[var(--color-brand)]'
                    : 'bg-white border-gray-300 opacity-60'
                  }`}
              >
                <span
                  className={`inline-block rounded-full w-3.5 h-3.5 
                    ${isActive ? 'bg-[var(--color-brand)]' : 'bg-gray-300'}`}
                />
              </span>
              <span
                className={`mt-2 text-[11px] leading-tight max-w-[120px] text-center truncate 
                  ${isActive ? 'text-[var(--color-accent)]' : 'text-gray-400'}`}
              >
                {s.city || `Stop ${i + 1}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
