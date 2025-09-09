import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
export default function Contact() {
    var _a = useState(''), name = _a[0], setName = _a[1];
    var _b = useState(''), email = _b[0], setEmail = _b[1];
    var _c = useState(''), message = _c[0], setMessage = _c[1];
    var onSubmit = useCallback(function (e) {
        e.preventDefault();
        if (!name || !email || !message) {
            alert('Please fill in your name, email, and message.');
            return;
        }
        var subject = encodeURIComponent("OneTrip contact \u2014 ".concat(name));
        var body = encodeURIComponent("Name: ".concat(name, "\nEmail: ").concat(email, "\n\nMessage:\n").concat(message));
        window.location.href = "mailto:hello@onetrip.app?subject=".concat(subject, "&body=").concat(body);
    }, [name, email, message]);
    return (_jsx("main", { className: "mx-auto max-w-5xl p-6 text-[var(--color-ink)]", children: _jsxs("div", { className: "card p-8", children: [_jsx("h1", { className: "section-title text-3xl mb-6", children: "Contact" }), _jsxs("p", { className: "text-[var(--color-muted)] leading-relaxed mb-8", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDC8C" }), "Have feedback, ideas, or found a bug? Drop us a message."] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1 text-sm font-medium", children: "Your name" }), _jsx("input", { className: "w-full", name: "name", placeholder: "Your name", value: name, onChange: function (e) { return setName(e.target.value); }, required: true })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1 text-sm font-medium", children: "Your email" }), _jsx("input", { className: "w-full", type: "email", name: "email", placeholder: "you@example.com", value: email, onChange: function (e) { return setEmail(e.target.value); }, required: true })] })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1 text-sm font-medium", children: "Your message" }), _jsx("textarea", { className: "w-full", name: "message", placeholder: "How can we help?", rows: 6, value: message, onChange: function (e) { return setMessage(e.target.value); }, required: true })] }), _jsx("div", { className: "flex items-center justify-end", children: _jsx("button", { className: "btn", type: "submit", children: "Send" }) })] }), _jsxs("div", { className: "mt-6 text-sm text-[var(--color-muted)]", children: ["Prefer email? Write to ", _jsx("a", { href: "mailto:hello@onetrip.app", children: "hello@onetrip.app" })] })] }) }));
}
