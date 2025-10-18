// src/components/ConfirmModal.tsx

import { EmojiButton } from './ui'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  children: React.ReactNode // Mesajı children olarak alıyoruz
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, children }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
         style={{ animationDuration: '150ms' }}
         onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
           onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[var(--color-brand)] mb-3">
          {title}
        </h2>
        <div className="text-sm text-[var(--color-muted)] mb-6">
          {children}
        </div>
        
        <div className="flex justify-end gap-3">
          <EmojiButton
            emoji="✖️"
            label="İptal"
            title="İptal"
            onClick={onClose}
            variant="btn"
            className="bg-neutral-200 text-black hover:bg-neutral-300"
          />
          <EmojiButton
            emoji="✔️"
            label="Onayla"
            title="Onayla"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            variant="btn"
            className="!bg-green-600 hover:!bg-green-700 border-green-600 text-white"
          />
        </div>
      </div>
    </div>
  )
}