import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Badge({ children }) {
    return _jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full bg-neutral-100", children: children });
}
/**
 * Field:
 * - Etiket alanına sabit min yükseklik veriyoruz (2 satır sığacak kadar).
 * - Böylece etiket tek satır / çift satır olsa da inputlar aynı düşey hizadan başlar.
 */
export function Field({ label, children }) {
    return (_jsxs("label", { className: "block text-sm", children: [_jsx("div", { className: "mb-1 opacity-70 leading-snug min-h-[36px] flex items-end", children: label }), children] }));
}
/** ModeButton (toggleable chip, used in LegEditor) */
export function ModeButton({ active, onClick, children }) {
    return (_jsx("button", { onClick: onClick, className: `group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors
        ${active
            ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow'
            : 'bg-white text-[var(--color-accent)] border-[var(--color-border)] hover:bg-[var(--color-brand)]/10'}`, children: children }));
}
/**
 * EmojiButton:
 * - Emoji görünen, etiketi hover’da yumuşak şekilde açılan buton.
 * - SR-only etiket ile erişilebilirlik korunur.
 * - variant: 'btn' | 'ghost' | 'icon' | 'chip'
 */
export function EmojiButton({ emoji, label, title, onClick, variant = 'btn', className = '' }) {
    const base = variant === 'btn' ? 'btn' :
        variant === 'ghost' ? 'btn-ghost' :
            variant === 'icon' ? 'btn-icon' :
                /* chip */ 'chip';
    // İçerde metni hover’da açmak için group + transition kullanıyoruz.
    return (_jsxs("button", { type: "button", onClick: onClick, title: title || label, className: `group ${base} ${className}`, "aria-label": label, children: [_jsx("span", { "aria-hidden": true, className: "select-none", children: emoji }), _jsx("span", { className: "sr-only", children: label }), _jsx("span", { "aria-hidden": true, className: 
                // chip & icon dar oldukları için biraz farklı animasyon
                (variant === 'icon'
                    ? 'ml-0'
                    : 'ml-1') +
                    ' max-w-0 opacity-0 overflow-hidden whitespace-nowrap ' +
                    'group-hover:max-w-[220px] group-hover:opacity-100 transition-all duration-200 ease-out', children: label })] }));
}
