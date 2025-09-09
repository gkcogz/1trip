import { jsx as _jsx } from "react/jsx-runtime";
// src/i18n.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import languages from './languages.json';
var I18N_KEY = 'onetrip_lang';
var I18nCtx = createContext(null);
function detectLang() {
    var stored = (typeof localStorage !== 'undefined' && localStorage.getItem(I18N_KEY));
    if (stored === 'tr' || stored === 'en' || stored === 'de')
        return stored;
    var n = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (n.startsWith('tr'))
        return 'tr';
    if (n.startsWith('de'))
        return 'de';
    return 'en';
}
export function I18nProvider(_a) {
    var children = _a.children;
    var _b = useState(detectLang()), lang = _b[0], setLangState = _b[1];
    useEffect(function () {
        try {
            localStorage.setItem(I18N_KEY, lang);
        }
        catch (_a) { }
        try {
            document.documentElement.lang = lang;
        }
        catch (_b) { }
    }, [lang]);
    var t = function (key, vars) {
        var _a, _b;
        var dict = languages[key];
        var template = (_b = (_a = dict === null || dict === void 0 ? void 0 : dict[lang]) !== null && _a !== void 0 ? _a : dict === null || dict === void 0 ? void 0 : dict.en) !== null && _b !== void 0 ? _b : key;
        if (!vars)
            return template;
        return template.replace(/\{(\w+)\}/g, function (_, k) { var _a; return String((_a = vars[k]) !== null && _a !== void 0 ? _a : "{".concat(k, "}")); });
    };
    var value = useMemo(function () { return ({
        lang: lang,
        setLang: function (l) { return setLangState(l); },
        t: t,
    }); }, [lang]);
    return _jsx(I18nCtx.Provider, { value: value, children: children });
}
export function useI18n() {
    var ctx = useContext(I18nCtx);
    if (!ctx)
        throw new Error('useI18n must be used within <I18nProvider>');
    return ctx;
}
