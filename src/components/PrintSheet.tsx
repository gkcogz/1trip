// src/components/PrintSheet.tsx
import React, { useMemo } from 'react'
import type { Trip } from '../lib/types'
import StopsGraph from './StopsGraph'
import { useI18n } from '../i18n'

function money(n: number | undefined, currency: string) {
  const v = typeof n === 'number' ? n : 0
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v)
  } catch {
    return `${v.toFixed(2)} ${currency}`
  }
}

export default function PrintSheet({ trip }: { trip: Trip }) {
  const { t } = useI18n()
  const stops = trip.stops ?? []
  const legs = trip.legs ?? []
  const currency = trip.currency || 'EUR'
  const participants = Math.max(1, trip.participants || 1)

  // Durak bazlı bütçe hesapları
  const perStop = useMemo(() => {
    return stops.map((s) => {
      const nights = s.stayNights || 0
      const b = (s as any).budget || {}
      const lodgingTotal =
        typeof b.lodgingTotal === 'number'
          ? b.lodgingTotal
          : (b.lodgingPerNight || 0) * nights
      const foodTotal = (b.foodPerDay || 0) * Math.max(1, nights) * participants
      const otherTotal = b.other || 0
      const activitiesTotal = (s.activities || []).reduce(
        (acc: number, a: any) => acc + (a.cost || 0),
        0
      )
      const subtotal = lodgingTotal + foodTotal + otherTotal + activitiesTotal
      return {
        id: s.id,
        nights,
        lodgingTotal,
        foodTotal,
        otherTotal,
        activitiesTotal,
        subtotal,
      }
    })
  }, [stops, participants])

  const transportTotal = legs.reduce((acc, l: any) => acc + (l.cost || 0), 0)
  const tripTotal = perStop.reduce((a, x) => a + x.subtotal, 0) + transportTotal
  const perPerson = tripTotal / Math.max(1, participants)

  return (
    <div id="print-sheet" className="print-container">
      {/* Header */}
      <div className="print-header">
        <div>
          <h1 className="print-title">
            {trip.title || t('print.title.fallback')}
          </h1>
          <div className="print-sub">
            {t('print.header.line', {
              n: participants,
              travelers:
                participants > 1
                  ? t('print.travelers.plural')
                  : t('print.travelers.singular'),
              cur: currency,
            })}
          </div>
        </div>
        {trip.logoDataUrl && (
          <img src={trip.logoDataUrl} alt="logo" className="print-logo" />
        )}
      </div>

      {/* Route overview */}
      {stops.length > 0 && (
        <section className="print-section">
          <h2 className="print-h2">{t('graph.header')}</h2>
          {/* Print-safe graph (no interactivity) */}
          <StopsGraph trip={trip} printSafe />
        </section>
      )}

      {/* Stops & Activities */}
      <section className="print-section">
        <h2 className="print-h2">{t('print.stopsActivities')}</h2>
        <div className="print-stops">
          {stops.map((s, i) => {
            const p = perStop[i]
            return (
              <div key={s.id} className="print-card">
                <div className="print-card-head">
                  <div className="print-stop-title">
                    {s.city || t('print.stopPlaceholder', { i: i + 1 })}
                  </div>
                  <div className="print-stop-sub">
                    {t('print.nightsSubtotal', {
                      nights: p.nights,
                      subtotal: money(p.subtotal, currency),
                    })}
                  </div>
                </div>

                {(s.activities || []).length > 0 ? (
                  <table className="print-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>
                          {t('print.tbl.activity')}
                        </th>
                        <th style={{ width: '15%' }}>
                          {t('print.tbl.category')}
                        </th>
                        <th style={{ width: '25%' }}>{t('print.tbl.note')}</th>
                        <th style={{ width: '15%' }}>{t('print.tbl.link')}</th>
                        <th
                          style={{ width: '15%' }}
                          className="text-right"
                        >
                          {t('print.tbl.cost')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.activities.map((a: any) => (
                        <tr key={a.id}>
                          <td>{a.title}</td>
                          <td>{a.category || '-'}</td>
                          <td>{a.note || ''}</td>
                          <td>
                            {a.link ? (
                              <a
                                href={a.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="print-link"
                              >
                                🔗 {t('print.open')}
                              </a>
                            ) : (
                              ''
                            )}
                          </td>
                          <td className="text-right">
                            {money(a.cost || 0, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="print-muted">
                    {t('print.noActivities')}
                  </div>
                )}

                <div className="print-grid">
                  <div className="print-grid-item">
                    {t('print.lodgingTotal')}:{' '}
                    <b>{money(p.lodgingTotal, currency)}</b>
                  </div>
                  <div className="print-grid-item">
                    {t('print.foodFormula')}:{' '}
                    <b>{money(p.foodTotal, currency)}</b>
                  </div>
                  <div className="print-grid-item">
                    {t('print.otherTotal')}:{' '}
                    <b>{money(p.otherTotal, currency)}</b>
                  </div>
                  <div className="print-grid-item">
                    {t('print.activitiesTotal')}:{' '}
                    <b>{money(p.activitiesTotal, currency)}</b>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Transport legs */}
      {legs.length > 0 && (
        <section className="print-section">
          <h2 className="print-h2">{t('print.transport')}</h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>{t('print.fromTo')}</th>
                <th>{t('print.mode')}</th>
                <th className="text-right">{t('print.tbl.cost')}</th>
              </tr>
            </thead>
            <tbody>
              {legs.map((l: any) => {
                const from = stops.find((s) => s.id === l.fromStopId)
                const to = stops.find((s) => s.id === l.toStopId)
                return (
                  <tr key={l.id}>
                    <td>
                      {(from?.city || t('print.unknown'))} →{' '}
                      {(to?.city || t('print.unknown'))}
                    </td>
                    <td>{l.mode || '-'}</td>
                    <td className="text-right">
                      {money(l.cost || 0, currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-right font-medium">
                  {t('print.transportTotal')}
                </td>
                <td className="text-right font-medium">
                  {money(transportTotal, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      )}

      {/* Totals */}
      <section className="print-section">
        <h2 className="print-h2">{t('print.overallTotals')}</h2>
        <div className="print-grid">
          <div className="print-grid-item">
            {t('print.groupTotal')}: <b>{money(tripTotal, currency)}</b>
          </div>
          <div className="print-grid-item">
            {t('print.perPerson')}: <b>{money(perPerson, currency)}</b>
          </div>
        </div>
      </section>
    </div>
  )
}
