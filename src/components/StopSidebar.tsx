// src/components/StopSidebar.tsx
import { Trip } from '@lib/types'
import { Field, EmojiButton } from './ui'
import { useI18n } from '../i18n'

export default function StopSidebar({
  trip,
  selectedStopId,
  setSelectedStopId,
  addActivity,
  setActivityField,
  deleteActivity,
  setStopField,
}: {
  trip: Trip
  selectedStopId: string | null
  setSelectedStopId: (v: string | null) => void
  addActivity: (stopId: string) => void
  setActivityField: (stopId: string, actId: string, field: any, value: any) => void
  deleteActivity: (stopId: string, actId: string) => void
  setStopField: (stopId: string, field: any, value: any) => void
}) {
  const { t } = useI18n()
  const stop = trip.stops.find((s) => s.id === selectedStopId)

  return (
    <>
      {stop && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          onClick={() => setSelectedStopId(null)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-[420px] max-w-[90vw] bg-white border-l border-[var(--color-border)] shadow-2xl transition-transform duration-300 z-50 ${
          stop ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[var(--color-border)]">
          <div className="font-semibold text-[var(--color-brand)]">{t('sidebar.title')}</div>
          <EmojiButton
            emoji="✖️"
            label={t('common.close')}
            title={t('common.close')}
            onClick={() => setSelectedStopId(null)}
            variant="ghost"
          />
        </div>

        {stop && (
          <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-[calc(100%-56px)]">
            <div className="space-y-1">
              <div className="text-sm text-[var(--color-muted)]">{t('sidebar.selected')}</div>
              <div className="text-lg font-semibold text-[var(--color-accent)]">
                {stop.city || t('sidebar.untitled')}
              </div>
            </div>

            {/* Activities */}
            <section>
              <h4 className="font-semibold mb-2 text-[var(--color-brand)]">
                {t('sidebar.activities')}
              </h4>
              <div className="space-y-2">
                {stop.activities.length === 0 && (
                  <div className="text-sm text-[var(--color-muted)]">{t('sidebar.none')}</div>
                )}
                {stop.activities.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-[var(--color-border)] p-3 bg-neutral-50 shadow-sm"
                  >
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] mb-2 bg-white"
                      value={a.title}
                      onChange={(e) =>
                        setActivityField(stop.id, a.id, 'title', e.target.value)
                      }
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <select
                        className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white"
                        value={a.category}
                        onChange={(e) =>
                          setActivityField(stop.id, a.id, 'category', e.target.value)
                        }
                      >
                        <option value="nature">{t('sidebar.category.nature')}</option>
                        <option value="food">{t('sidebar.category.food')}</option>
                        <option value="culture">{t('sidebar.category.culture')}</option>
                        <option value="nightlife">{t('sidebar.category.nightlife')}</option>
                        <option value="other">{t('sidebar.category.other')}</option>
                      </select>
                      <input
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white"
                        placeholder={t('sidebar.note')}
                        value={a.note || ''}
                        onChange={(e) =>
                          setActivityField(stop.id, a.id, 'note', e.target.value)
                        }
                      />
                    </div>

                    {/* 🔗 Link kutusu */}
                    <input
                      type="url"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] mb-2 bg-white"
                      placeholder="https://example.com"
                      value={a.link || ''}
                      onChange={(e) =>
                        setActivityField(stop.id, a.id, 'link', e.target.value)
                      }
                    />

                    <label className="inline-flex items-center gap-2 px-2 py-2 rounded-lg border border-[var(--color-border)] bg-white">
                      <span>{t('sidebar.cost')}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min={0}
                        className="w-28 bg-transparent outline-none"
                        value={a.cost || 0}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) =>
                          setActivityField(stop.id, a.id, 'cost', Number(e.target.value) || 0)
                        }
                      />
                    </label>

                    <EmojiButton
                      emoji="🗑"
                      label={t('sidebar.delete')}
                      title={t('sidebar.delete')}
                      onClick={() => deleteActivity(stop.id, a.id)}
                      variant="btn"
                      className="ml-2 !bg-red-600 hover:!bg-red-700 border-red-600"
                    />
                  </div>
                ))}
                <EmojiButton
                  emoji="➕"
                  label={t('sidebar.addActivity')}
                  title={t('sidebar.addActivity')}
                  onClick={() => addActivity(stop.id)}
                  variant="btn"
                />
              </div>
            </section>

            {/* Lodging & Food & Other */}
            <section className="space-y-2">
              <h4 className="font-semibold text-[var(--color-brand)]">
                {t('sidebar.lodgingFoodOther')}
              </h4>

              {(() => {
                const nights = stop.stayNights || 0
                const b = stop.budget || {}
                const lodgingTotal =
                  typeof b.lodgingTotal === 'number'
                    ? b.lodgingTotal
                    : (b.lodgingPerNight || 0) * nights

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Field label={t('sidebar.lodgingTotal')}>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min={0}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white"
                        value={lodgingTotal}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) =>
                          setStopField(stop.id, 'budget', {
                            ...b,
                            lodgingTotal: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </Field>

                    <Field label={t('sidebar.foodPerDay')}>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min={0}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white"
                        value={b.foodPerDay || 0}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) =>
                          setStopField(stop.id, 'budget', {
                            ...b,
                            foodPerDay: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </Field>

                    <Field label={t('sidebar.otherTotal')}>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        min={0}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white"
                        value={b.other || 0}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) =>
                          setStopField(stop.id, 'budget', {
                            ...b,
                            other: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </Field>
                  </div>
                )
              })()}
            </section>
          </div>
        )}
      </div>
    </>
  )
}
