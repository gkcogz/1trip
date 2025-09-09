import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmojiButton } from './ui';
import { useI18n } from '../i18n';
export default function ResetModal(_a) {
    var open = _a.open, onClose = _a.onClose, onConfirm = _a.onConfirm;
    var t = useI18n().t;
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4", children: [_jsx("h2", { className: "text-lg font-semibold text-[var(--color-brand)] mb-3", children: t('reset.title') }), _jsx("p", { className: "text-sm text-[var(--color-muted)] mb-6", children: t('reset.text') }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(EmojiButton, { emoji: "\u2716\uFE0F", label: t('common.cancel'), title: t('common.cancel'), onClick: onClose, variant: "btn", className: "bg-neutral-200 text-black hover:bg-neutral-300" }), _jsx(EmojiButton, { emoji: "\uD83D\uDDD1\uFE0F", label: t('common.reset'), title: t('common.reset'), onClick: function () {
                                onConfirm();
                                onClose();
                            }, variant: "btn", className: "!bg-red-600 hover:!bg-red-700 border-red-600 text-white" })] })] }) }));
}
