export var uid = function () { return Math.random().toString(36).slice(2, 10); };
export var clamp = function (n, min, max) {
    return Math.max(min, Math.min(max, n));
};
export var currencyFmt = function (currency, n) {
    if (n === void 0) { n = 0; }
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(n);
    }
    catch (_a) {
        return "".concat(n.toFixed(2), " ").concat(currency);
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
