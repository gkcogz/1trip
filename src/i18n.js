import { jsx as _jsx } from "react/jsx-runtime";
// src/i18n.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import languages from './languages.json';
const I18N_KEY = 'onetrip_lang';
const I18nCtx = createContext(null);
function detectLang() {
    const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(I18N_KEY));
    if (stored === 'tr' || stored === 'en' || stored === 'de')
        return stored;
    const n = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (n.startsWith('tr'))
        return 'tr';
    if (n.startsWith('de'))
        return 'de';
    return 'en';
}
export function I18nProvider({ children }) {
    const [lang, setLangState] = useState(detectLang());
    useEffect(() => {
        try {
            localStorage.setItem(I18N_KEY, lang);
        }
        catch { }
        try {
            document.documentElement.lang = lang;
        }
        catch { }
    }, [lang]);
    const t = (key, vars) => {
        const dict = languages[key];
        const template = dict?.[lang] ?? dict?.en ?? key;
        if (!vars)
            return template;
        return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
    };
    const value = useMemo(() => ({
        lang,
        setLang: (l) => setLangState(l),
        t,
    }), [lang]);
    return _jsx(I18nCtx.Provider, { value: value, children: children });
}
export function useI18n() {
    const ctx = useContext(I18nCtx);
    if (!ctx)
        throw new Error('useI18n must be used within <I18nProvider>');
    return ctx;
}
