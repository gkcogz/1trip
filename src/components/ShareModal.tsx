// src/components/ShareModal.tsx
import React from 'react'
import { EmojiButton } from './ui'
import { useI18n } from '../i18n'

type Props = {
  open: boolean
  url: string
  title?: string    // ✅ EKLENDİ: e-postada konu için
  onClose: () => void
}

export default function ShareModal({ open, url, title, onClose }: Props) {
  const { t } = useI18n()
  if (!open) return null

  const encodedUrl = encodeURIComponent(url)
  const subjectText = title && title.trim() ? `${title} — OneTrip` : t('share.title')
  const subject = encodeURIComponent(subjectText)
  const body = encodeURIComponent(`${t('share.text')}\n${url}`)

  const links = {
    emailDefault: `mailto:?subject=${subject}&body=${body}`,
    emailGmail: `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`,
    whatsapp: `https://wa.me/?text=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(subjectText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert(t('common.copied'))
    } catch {
      alert(t('common.copyFailed'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e)=>e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-[var(--color-brand)] mb-3">{t('share.title')}</h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          {t('share.text')}
        </p>

        {/* share buttons row */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <a href={links.whatsapp} target="_blank" rel="noreferrer">
            <EmojiButton emoji="🟢" label={t('share.whatsapp')} title="WhatsApp" variant="btn" />
          </a>
          <a href={links.facebook} target="_blank" rel="noreferrer">
            <EmojiButton emoji="📘" label={t('share.facebook')} title="Facebook" variant="btn" />
          </a>
          <a href={links.x} target="_blank" rel="noreferrer">
            <EmojiButton emoji="𝕏" label={t('share.x')} title="X" variant="btn" />
          </a>

          {/* ✅ İki e-posta seçeneği */}
          <a href={links.emailDefault}>
            <EmojiButton emoji="✉️" label={t('share.email')} title={t('share.email')} variant="btn" />
          </a>
          <a href={links.emailGmail} target="_blank" rel="noreferrer">
            <EmojiButton emoji="📧" label="Gmail" title="Gmail" variant="btn" />
          </a>

          <EmojiButton emoji="🔗" label={t('common.copyLink')} title={t('common.copyLink')} onClick={copyLink} variant="btn" />
        </div>

        {/* link field */}
        <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-xl p-2 mb-6 bg-neutral-50">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 bg-transparent outline-none px-2"
          />
          <EmojiButton emoji="📋" label={t('share.copy')} title={t('share.copy')} onClick={copyLink} variant="chip" />
        </div>

        <div className="flex justify-end">
          <EmojiButton emoji="✖️" label={t('common.close')} title={t('common.close')} onClick={onClose} variant="btn" className="bg-neutral-200 text-black hover:bg-neutral-300" />
        </div>
      </div>
    </div>
  )
}
