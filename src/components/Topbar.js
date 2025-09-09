var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/Topbar.tsx
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toCSV } from '../lib/csv';
import { hashEncode } from '../lib/storage';
import ShareModal from './ShareModal';
import { useI18n } from '../i18n';
export default function Topbar(_a) {
    var _this = this;
    var _b;
    var trip = _a.trip, setTripField = _a.setTripField, onUndo = _a.onUndo, onRedo = _a.onRedo, onImportJSON = _a.onImportJSON;
    var _c = useI18n(), t = _c.t, lang = _c.lang, setLang = _c.setLang;
    var fileRef = useRef(null);
    var _d = useState(false), showShare = _d[0], setShowShare = _d[1];
    var _e = useState(false), menuOpen = _e[0], setMenuOpen = _e[1];
    var menuRef = useRef(null);
    var hasPlannerControls = !!trip && !!setTripField;
    useEffect(function () {
        var handleClickOutside = function (e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        var onKey = function (e) { if (e.key === 'Escape')
            setMenuOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', onKey);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, []);
    var shareUrl = function () {
        return trip ? location.origin + location.pathname + "#plan=".concat(hashEncode(trip))
            : location.href;
    };
    var share = function () { return __awaiter(_this, void 0, void 0, function () {
        var url, title, text, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = shareUrl();
                    title = (trip === null || trip === void 0 ? void 0 : trip.title) || 'OneTrip';
                    text = 'Check out my trip plan';
                    if (!navigator.share) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.share({ title: title, text: text, url: url })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setShowShare(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var exportJSON = function () {
        if (!trip)
            return;
        var blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (trip.title || 'trip') + '.json';
        a.click();
    };
    var exportCSV = function () {
        if (!trip)
            return;
        var blob = new Blob([toCSV(trip)], { type: 'text/csv' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (trip.title || 'trip') + '.csv';
        a.click();
    };
    var printPage = function () { return window.print(); };
    var travelerEmoji = function (n) {
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
    return (_jsxs("header", { className: "sticky top-0 z-40 backdrop-blur bg-[var(--color-bg)]/85 border-b border-[var(--color-border)] shadow-sm print:hidden", children: [_jsxs("div", { className: "mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { className: "flex flex-col justify-center items-center w-9 h-9 rounded-md border border-[var(--color-border)] bg-white hover:bg-gray-100", onClick: function () { return setMenuOpen(function (o) { return !o; }); }, "aria-label": "Open menu", title: "Menu", children: [_jsx("span", { className: "w-5 h-0.5 bg-gray-800 mb-1" }), _jsx("span", { className: "w-5 h-0.5 bg-gray-800 mb-1" }), _jsx("span", { className: "w-5 h-0.5 bg-gray-800" })] }), menuOpen && (_jsxs("div", { className: "absolute left-0 top-11 w-44 rounded-md border border-[var(--color-border)] bg-white shadow-md", children: [_jsx(Link, { to: "/about", className: "block px-4 py-2 hover:bg-gray-100", onClick: function () { return setMenuOpen(false); }, children: t('menu.about') }), _jsx(Link, { to: "/contact", className: "block px-4 py-2 hover:bg-gray-100", onClick: function () { return setMenuOpen(false); }, children: t('menu.contact') })] }))] }), hasPlannerControls && (_jsxs(_Fragment, { children: [_jsx("input", { className: "px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white outline-none", placeholder: t('topbar.title.placeholder'), value: trip.title, onChange: function (e) { return setTripField('title', e.target.value); } }), _jsxs("select", { value: trip.currency, onChange: function (e) { return setTripField('currency', e.target.value); }, className: "px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white", children: [_jsx("option", { children: "EUR" }), _jsx("option", { children: "USD" }), _jsx("option", { children: "TRY" }), _jsx("option", { children: "GBP" })] }), _jsxs("label", { className: "flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white", children: [_jsx("span", { children: t('topbar.people') }), _jsx("input", { type: "range", min: 1, max: 10, value: trip.participants, onChange: function (e) { return setTripField('participants', Number(e.target.value)); }, className: "w-32 accent-[var(--color-brand)]" }), _jsx("span", { className: "font-medium text-[var(--color-accent)]", children: trip.participants }), _jsx("span", { className: "text-xl", "aria-hidden": true, children: travelerEmoji((_b = trip === null || trip === void 0 ? void 0 : trip.participants) !== null && _b !== void 0 ? _b : 1) })] })] }))] }), _jsx("div", { className: "flex-shrink-0", children: _jsx(Link, { to: "/", title: "Home", children: _jsx("img", { src: (trip === null || trip === void 0 ? void 0 : trip.logoDataUrl) || '/logo.png', alt: "logo", className: "h-12 w-12 rounded-full shadow-sm" }) }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white", onClick: share, children: t('topbar.actions.share') }), _jsxs("select", { value: lang, onChange: function (e) { return setLang(e.target.value); }, className: "px-2 py-2 rounded-xl border border-[var(--color-border)] bg-white text-lg", "aria-label": t('topbar.lang'), children: [_jsx("option", { value: "tr", children: "\uD83C\uDDF9\uD83C\uDDF7" }), _jsx("option", { value: "en", children: "\uD83C\uDDEC\uD83C\uDDE7" }), _jsx("option", { value: "de", children: "\uD83C\uDDE9\uD83C\uDDEA" })] }), hasPlannerControls && (_jsxs("nav", { className: "toolbar flex items-center gap-2", children: [_jsxs("div", { className: "segment", children: [_jsx("button", { onClick: exportJSON, className: "px-2 py-1 rounded-md border", children: "\uD83E\uDDFE" }), _jsx("button", { onClick: exportCSV, className: "px-2 py-1 rounded-md border", children: "\uD83D\uDCCA" }), _jsx("button", { onClick: printPage, className: "px-2 py-1 rounded-md border", children: "\uD83D\uDDA8\uFE0F" })] }), _jsxs("div", { className: "segment", children: [_jsx("button", { onClick: onUndo, className: "px-2 py-1 rounded-md border", children: "\u21A9\uFE0F" }), _jsx("button", { onClick: onRedo, className: "px-2 py-1 rounded-md border", children: "\u21AA\uFE0F" })] }), _jsxs("div", { className: "segment", children: [_jsx("input", { ref: fileRef, type: "file", accept: "application/json", className: "hidden", onChange: function (e) {
                                                    var _a;
                                                    var f = (_a = e.currentTarget.files) === null || _a === void 0 ? void 0 : _a[0];
                                                    if (f && onImportJSON)
                                                        onImportJSON(f);
                                                    e.currentTarget.value = '';
                                                } }), _jsx("button", { onClick: function () { var _a; return (_a = fileRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, className: "px-2 py-1 rounded-md border", children: "\uD83D\uDCE5" })] })] }))] })] }), _jsx(ShareModal, { open: showShare, url: shareUrl(), onClose: function () { return setShowShare(false); } })] }));
}
