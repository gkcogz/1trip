import type { Trip } from './types'

/** Trip'i düz bir CSV haline çevirir (Excel/Sheets uyumlu). */
export function toCSV(trip: Trip): string {
  const rows: (string | number)[][] = [[
    'type', 'from', 'to', 'mode', 'stop', 'item', 'category', 'note', 'cost'
  ]]

  trip.legs.forEach(l => {
    const from = trip.stops.find(s => s.id === l.fromStopId)?.city || ''
    const to   = trip.stops.find(s => s.id === l.toStopId)?.city || ''
    rows.push(['transport', from, to, l.mode, '', '', '', '', String(l.cost || 0)])
  })

  trip.stops.forEach(st => {
    const stay = Number(st.stayNights) || 0
    const lp = Number(st.budget?.lodgingPerNight) || 0
    const fp = Number(st.budget?.foodPerDay) || 0
    const oth = Number(st.budget?.other) || 0

    if (lp) rows.push(['lodging','','','',st.city,`lodging x${stay} nights`,'','',String(lp*stay)])
    if (fp) rows.push(['food',   '','', '',st.city,`food x${stay} days`,   '','',String(fp*stay)])
    if (oth) rows.push(['other', '','', '',st.city,'other',               '','',String(oth)])

    st.activities.forEach(ac =>
      rows.push(['activity','','','',st.city,ac.title,ac.category,ac.note || '', String(ac.cost || 0)])
    )
  })

  return rows
    .map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','))
    .join('\n')
}
