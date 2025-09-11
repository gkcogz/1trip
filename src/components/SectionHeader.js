import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/SectionHeader.tsx
export default function SectionHeader({ title, action }) {
    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-[var(--color-accent)] border-b-2 border-[var(--color-brand)] pb-1", children: title }), _jsx("div", { children: action })] }));
}
