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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EmojiButton } from './ui';
import { useI18n } from '../i18n';
export default function ShareModal(_a) {
    var _this = this;
    var open = _a.open, url = _a.url, onClose = _a.onClose;
    var t = useI18n().t;
    if (!open)
        return null;
    var encodedUrl = encodeURIComponent(url);
    var subject = encodeURIComponent('My OneTrip route');
    var body = encodeURIComponent("Here is my trip plan:\n".concat(url));
    var links = {
        email: "mailto:?subject=".concat(subject, "&body=").concat(body),
        whatsapp: "https://wa.me/?text=".concat(encodedUrl),
        x: "https://twitter.com/intent/tweet?url=".concat(encodedUrl, "&text=").concat(encodeURIComponent('My OneTrip route')),
        facebook: "https://www.facebook.com/sharer/sharer.php?u=".concat(encodedUrl),
    };
    var copyLink = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(url)];
                case 1:
                    _b.sent();
                    alert(t('common.copied'));
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    alert(t('common.copyFailed'));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4", children: [_jsx("h2", { className: "text-lg font-semibold text-[var(--color-brand)] mb-3", children: t('share.title') }), _jsx("p", { className: "text-sm text-[var(--color-muted)] mb-4", children: t('share.text') }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-4", children: [_jsx("a", { href: links.whatsapp, target: "_blank", rel: "noreferrer", children: _jsx(EmojiButton, { emoji: "\uD83D\uDFE2", label: t('share.whatsapp'), title: "WhatsApp", variant: "btn" }) }), _jsx("a", { href: links.facebook, target: "_blank", rel: "noreferrer", children: _jsx(EmojiButton, { emoji: "\uD83D\uDCD8", label: t('share.facebook'), title: "Facebook", variant: "btn" }) }), _jsx("a", { href: links.x, target: "_blank", rel: "noreferrer", children: _jsx(EmojiButton, { emoji: "\u274C", label: t('share.x'), title: "X", variant: "btn" }) }), _jsx("a", { href: links.email, children: _jsx(EmojiButton, { emoji: "\u2709\uFE0F", label: t('share.email'), title: "Email", variant: "btn" }) }), _jsx(EmojiButton, { emoji: "\uD83D\uDD17", label: t('common.copyLink'), title: t('common.copyLink'), onClick: copyLink, variant: "btn" })] }), _jsxs("div", { className: "flex items-center gap-2 border border-[var(--color-border)] rounded-xl p-2 mb-6 bg-neutral-50", children: [_jsx("input", { readOnly: true, value: url, onFocus: function (e) { return e.currentTarget.select(); }, className: "flex-1 bg-transparent outline-none px-2" }), _jsx(EmojiButton, { emoji: "\uD83D\uDCCB", label: t('share.copy'), title: t('share.copy'), onClick: copyLink, variant: "chip" })] }), _jsx("div", { className: "flex justify-end", children: _jsx(EmojiButton, { emoji: "\u2716\uFE0F", label: t('common.close'), title: t('common.close'), onClick: onClose, variant: "btn", className: "bg-neutral-200 text-black hover:bg-neutral-300" }) })] }) }));
}
