import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/Topbar.tsx
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toCSV } from '@lib/csv';
import { hashEncode } from '@lib/storage';
import ShareModal from './ShareModal';
import { useI18n } from '../i18n';
export default function Topbar({ trip, setTripField, onUndo, onRedo, onImportJSON, }) {
    const { t, lang, setLang } = useI18n();
    const fileRef = useRef(null);
    const [showShare, setShowShare] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const hasPlannerControls = !!trip && !!setTripField;
    const navigate = useNavigate();
    const routeLocation = useLocation();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const onKey = (e) => { if (e.key === 'Escape')
            setMenuOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, []);
    // URL oluştur
    const shareUrl = () => trip
        ? `${window.location.origin}${window.location.pathname}#plan=${hashEncode(trip)}`
        : window.location.href;
    const share = async () => {
        const url = shareUrl();
        const title = trip?.title || 'OneTrip';
        const text = 'Check out my trip plan';
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return;
            }
            catch { /* user cancelled or not supported */ }
        }
        setShowShare(true);
    };
    const exportJSON = () => {
        if (!trip)
            return;
        const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (trip.title || 'trip') + '.json';
        a.click();
    };
    const exportCSV = () => {
        if (!trip)
            return;
        const blob = new Blob([toCSV(trip)], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (trip.title || 'trip') + '.csv';
        a.click();
    };
    // ✅ Print butonu artık /print route’una trip state ile gidiyor
    const handleGeneratePDF = () => {
        if (!trip)
            return;
        navigate('/print', { state: { trip, from: routeLocation.pathname } });
    };
    const travelerEmoji = (n) => {
        if (n === 1)
            return '👤';
        if (n === 2)
            return '👥';
        if (n >= 3 && n <= 5)
            return '🧑‍🤝‍🧑';
        if (n > 5)
            return '🧑‍🤝‍🧑+';
        return '👤';
    };
    return (_jsxs("header", { className: "sticky top-0 z-40 backdrop-blur bg-[var(--color-bg)]/85 border-b border-[var(--color-border)] shadow-sm print:hidden", children: [_jsxs("div", { className: "mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { className: "flex flex-col justify-center items-center w-9 h-9 rounded-md border border-[var(--color-border)] bg-white hover:bg-gray-100", onClick: () => setMenuOpen(o => !o), "aria-label": "Open menu", title: "Menu", children: [_jsx("span", { className: "w-5 h-0.5 bg-gray-800 mb-1" }), _jsx("span", { className: "w-5 h-0.5 bg-gray-800 mb-1" }), _jsx("span", { className: "w-5 h-0.5 bg-gray-800" })] }), menuOpen && (_jsxs("div", { className: "absolute left-0 top-11 w-44 rounded-md border border-[var(--color-border)] bg-white shadow-md", children: [_jsx(Link, { to: "/blog", className: "block px-4 py-2 hover:bg-gray-100", onClick: () => setMenuOpen(false), children: t('menu.blog') }), _jsx(Link, { to: "/about", className: "block px-4 py-2 hover:bg-gray-100", onClick: () => setMenuOpen(false), children: t('menu.about') }), _jsx(Link, { to: "/contact", className: "block px-4 py-2 hover:bg-gray-100", onClick: () => setMenuOpen(false), children: t('menu.contact') })] }))] }), hasPlannerControls && (_jsxs(_Fragment, { children: [_jsx("input", { className: "px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none", placeholder: t('topbar.title.placeholder'), value: trip.title, onChange: (e) => setTripField('title', e.target.value) }), _jsxs("select", { value: trip.currency, onChange: (e) => setTripField('currency', e.target.value), className: "px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white", children: [_jsx("option", { children: "EUR" }), _jsx("option", { children: "USD" }), _jsx("option", { children: "TRY" }), _jsx("option", { children: "GBP" })] }), _jsxs("label", { className: "flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white", children: [_jsx("span", { children: t('topbar.people') }), _jsx("input", { type: "range", min: 1, max: 10, value: Number(trip.participants ?? 1), onChange: (e) => setTripField('participants', Number(e.target.value)), className: "w-32 accent-[var(--color-brand)]" }), _jsx("span", { className: "font-medium text-[var(--color-accent)]", children: Number(trip.participants ?? 1) }), _jsx("span", { className: "text-xl", children: travelerEmoji(Number(trip?.participants ?? 1)) })] })] }))] }), _jsx("div", { className: "flex-shrink-0", children: _jsx(Link, { to: "/", title: "Home", children: _jsx("img", { src: trip?.logoDataUrl || '/logo.png', alt: "logo", className: "h-12 w-12 rounded-full shadow-sm" }) }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white", onClick: share, title: t('topbar.actions.share'), children: t('topbar.actions.share') }), _jsxs("label", { className: "px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white flex items-center gap-2", children: [_jsx("span", { children: "\uD83C\uDF10" }), _jsxs("select", { value: lang, onChange: (e) => setLang(e.target.value), className: "bg-transparent outline-none", children: [_jsx("option", { value: "tr", children: "\uD83C\uDDF9\uD83C\uDDF7" }), _jsx("option", { value: "en", children: "\uD83C\uDDEC\uD83C\uDDE7" }), _jsx("option", { value: "de", children: "\uD83C\uDDE9\uD83C\uDDEA" })] })] }), hasPlannerControls && (_jsxs("nav", { className: "toolbar flex items-center gap-2", children: [_jsxs("div", { className: "segment", children: [_jsx("button", { onClick: exportJSON, className: "px-2 py-1 rounded-md border", title: t('topbar.exportJSON'), children: "\uD83E\uDDFE" }), _jsx("button", { onClick: exportCSV, className: "px-2 py-1 rounded-md border", title: t('topbar.exportCSV'), children: "\uD83D\uDCCA" }), _jsx("button", { onClick: handleGeneratePDF, className: "px-2 py-1 rounded-md border", title: t('topbar.print'), children: "\uD83D\uDDA8\uFE0F" })] }), _jsxs("div", { className: "segment", children: [_jsx("button", { onClick: onUndo, className: "px-2 py-1 rounded-md border", title: t('topbar.undo'), children: "\u21A9\uFE0F" }), _jsx("button", { onClick: onRedo, className: "px-2 py-1 rounded-md border", title: t('topbar.redo'), children: "\u21AA\uFE0F" })] }), _jsxs("div", { className: "segment", children: [_jsx("input", { ref: fileRef, type: "file", accept: "application/json", className: "hidden", onChange: (e) => {
                                                    const f = e.currentTarget.files?.[0];
                                                    if (f && onImportJSON)
                                                        onImportJSON(f);
                                                    e.currentTarget.value = '';
                                                } }), _jsx("button", { onClick: () => fileRef.current?.click(), className: "px-2 py-1 rounded-md border", title: t('topbar.importJSON') || 'Import JSON', children: "\uD83D\uDCE5" })] })] }))] })] }), _jsx(ShareModal, { open: showShare, url: shareUrl(), onClose: () => setShowShare(false) })] }));
}
