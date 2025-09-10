export const uid = () => Math.random().toString(36).slice(2, 10);
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const currencyFmt = (currency, n = 0) => {
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
    }
    catch {
        return `${n.toFixed(2)} ${currency}`;
    }
};
export function deepClone(v) {
    if (typeof structuredClone === 'function')
        return structuredClone(v);
    return JSON.parse(JSON.stringify(v));
}
export function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}
