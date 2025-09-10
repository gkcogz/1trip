import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmojiButton } from './ui';
import { useI18n } from '../i18n';
export default function ShareModal({ open, url, onClose }) {
    const { t } = useI18n();
    if (!open)
        return null;
    const encodedUrl = encodeURIComponent(url);
    const subject = encodeURIComponent('My OneTrip route');
    const body = encodeURIComponent(`Here is my trip plan:\n${url}`);
    const links = {
        email: `mailto:?subject=${subject}&body=${body}`,
        whatsapp: `https://wa.me/?text=${encodedUrl}`,
        x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent('My OneTrip route')}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert(t('common.copied'));
        }
        catch {
            alert(t('common.copyFailed'));
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4", children: [_jsx("h2", { className: "text-lg font-semibold text-[var(--color-brand)] mb-3", children: t('share.title') }), _jsx("p", { className: "text-sm text-[var(--color-muted)] mb-4", children: t('share.text') }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-4", children: [_jsx("a", { href: links.whatsapp, target: "_blank", rel: "noreferrer", children: _jsx(EmojiButton, { emoji: "\uD83D\uDFE2", label: t('share.whatsapp'), title: "WhatsApp", variant: "btn" }) }), _jsx("a", { href: links.facebook, target: "_blank", rel: "noreferrer", children: _jsx(EmojiButton, { emoji: "\uD83D\uDCD8", label: t('share.facebook'), title: "Facebook", variant: "btn" }) }), _jsx("a", { href: links.x, target: "_blank", rel: "noreferrer", children: _jsx(EmojiButton, { emoji: "\u274C", label: t('share.x'), title: "X", variant: "btn" }) }), _jsx("a", { href: links.email, children: _jsx(EmojiButton, { emoji: "\u2709\uFE0F", label: t('share.email'), title: "Email", variant: "btn" }) }), _jsx(EmojiButton, { emoji: "\uD83D\uDD17", label: t('common.copyLink'), title: t('common.copyLink'), onClick: copyLink, variant: "btn" })] }), _jsxs("div", { className: "flex items-center gap-2 border border-[var(--color-border)] rounded-xl p-2 mb-6 bg-neutral-50", children: [_jsx("input", { readOnly: true, value: url, onFocus: (e) => e.currentTarget.select(), className: "flex-1 bg-transparent outline-none px-2" }), _jsx(EmojiButton, { emoji: "\uD83D\uDCCB", label: t('share.copy'), title: t('share.copy'), onClick: copyLink, variant: "chip" })] }), _jsx("div", { className: "flex justify-end", children: _jsx(EmojiButton, { emoji: "\u2716\uFE0F", label: t('common.close'), title: t('common.close'), onClick: onClose, variant: "btn", className: "bg-neutral-200 text-black hover:bg-neutral-300" }) })] }) }));
}
