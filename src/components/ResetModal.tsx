// src/components/ResetModal.tsx
import React from 'react'
import { EmojiButton } from './ui'
import { useI18n } from '../i18n'

export default function ResetModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const { t } = useI18n()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold text-[var(--color-brand)] mb-3">
          {t('reset.title')}
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-6">
          {t('reset.text')}
        </p>

        <div className="flex justify-end gap-3">
          <EmojiButton
            emoji="✖️"
            label={t('common.cancel')}
            title={t('common.cancel')}
            onClick={onClose}
            variant="btn"
            className="bg-neutral-200 text-black hover:bg-neutral-300"
          />
          <EmojiButton
            emoji="🗑️"
            label={t('common.reset')}
            title={t('common.reset')}
            onClick={() => {
              onConfirm()
              onClose()
            }}
            variant="btn"
            className="!bg-red-600 hover:!bg-red-700 border-red-600 text-white"
          />
        </div>
      </div>
    </div>
  )
}
