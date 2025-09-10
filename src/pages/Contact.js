import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            alert('Please fill in your name, email, and message.');
            return;
        }
        const subject = encodeURIComponent(`OneTrip contact — ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:hello@onetrip.app?subject=${subject}&body=${body}`;
    }, [name, email, message]);
    return (_jsx("main", { className: "mx-auto max-w-5xl p-6 text-[var(--color-ink)]", children: _jsxs("div", { className: "card p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("img", { src: "/favicon.png", alt: "OneTrip logo", className: "w-10 h-10 rounded-lg shadow-md" }), _jsx("h1", { className: "section-title text-3xl", children: "Contact" })] }), _jsxs("p", { className: "text-[var(--color-muted)] leading-relaxed mb-8", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDC8C" }), "Have feedback, ideas, or found a bug? Drop us a message."] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1 text-sm font-medium", children: "Your name" }), _jsx("input", { className: "w-full", name: "name", placeholder: "Your name", value: name, onChange: (e) => setName(e.target.value), required: true })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1 text-sm font-medium", children: "Your email" }), _jsx("input", { className: "w-full", type: "email", name: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block mb-1 text-sm font-medium", children: "Your message" }), _jsx("textarea", { className: "w-full", name: "message", placeholder: "How can we help?", rows: 6, value: message, onChange: (e) => setMessage(e.target.value), required: true })] }), _jsx("div", { className: "flex items-center justify-end", children: _jsx("button", { className: "btn", type: "submit", children: "Send" }) })] }), _jsxs("div", { className: "mt-6 text-sm text-[var(--color-muted)]", children: ["Prefer email? Write to ", _jsx("a", { href: "mailto:hello@onetrip.app", children: "hello@onetrip.app" })] })] }) }));
}
