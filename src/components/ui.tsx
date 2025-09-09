import React from 'react'

export function Badge({children}:{children:React.ReactNode}){
  return <span className="inline-flex items-center px-2 py-1 rounded-full bg-neutral-100">{children}</span>
}

/**
 * Field:
 * - Etiket alanına sabit min yükseklik veriyoruz (2 satır sığacak kadar).
 * - Böylece etiket tek satır / çift satır olsa da inputlar aynı düşey hizadan başlar.
 */
export function Field({label,children}:{label:string,children:React.ReactNode}){
  return (
    <label className="block text-sm">
      {/* min-h- ile hizalama, items-end ile altına yasla */}
      <div className="mb-1 opacity-70 leading-snug min-h-[36px] flex items-end">
        {label}
      </div>
      {children}
    </label>
  )
}

/** ModeButton (toggleable chip, used in LegEditor) */
export function ModeButton({active,onClick,children}:{active:boolean,onClick:()=>void,children:React.ReactNode}){
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors
        ${active
          ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow'
          : 'bg-white text-[var(--color-accent)] border-[var(--color-border)] hover:bg-[var(--color-brand)]/10'
        }`}
    >
      {children}
    </button>
  )
}

/**
 * EmojiButton:
 * - Emoji görünen, etiketi hover’da yumuşak şekilde açılan buton.
 * - SR-only etiket ile erişilebilirlik korunur.
 * - variant: 'btn' | 'ghost' | 'icon' | 'chip'
 */
export function EmojiButton({
  emoji,
  label,
  title,
  onClick,
  variant = 'btn',
  className = ''
}:{
  emoji: string
  label: string
  title?: string
  onClick?: () => void
  variant?: 'btn'|'ghost'|'icon'|'chip'
  className?: string
}){
  const base =
    variant === 'btn'   ? 'btn' :
    variant === 'ghost' ? 'btn-ghost' :
    variant === 'icon'  ? 'btn-icon' :
    /* chip */            'chip'

  // İçerde metni hover’da açmak için group + transition kullanıyoruz.
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className={`group ${base} ${className}`}
      aria-label={label}
    >
      <span aria-hidden className="select-none">{emoji}</span>
      {/* SR-only label (her zaman var) */}
      <span className="sr-only">{label}</span>
      {/* Görsel etiket: default gizli, hover’da genişler */}
      <span
        aria-hidden
        className={
          // chip & icon dar oldukları için biraz farklı animasyon
          (variant === 'icon'
            ? 'ml-0'
            : 'ml-1') +
          ' max-w-0 opacity-0 overflow-hidden whitespace-nowrap ' +
          'group-hover:max-w-[220px] group-hover:opacity-100 transition-all duration-200 ease-out'
        }
      >
        {label}
      </span>
    </button>
  )
}
