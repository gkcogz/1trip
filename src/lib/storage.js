import { isNonEmptyString } from './utils';
const KEY = 'onetrip_trip';
export const loadTrip = () => {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : undefined;
    }
    catch {
        return undefined;
    }
};
export const saveTrip = (t) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(t));
    }
    catch {
        // storage dolu olabilir; sessiz geç
    }
};
export const hashEncode = (t) => encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(t)))));
export const hashDecode = () => {
    try {
        const m = location.hash.match(/plan=([^&]+)/);
        if (!m)
            return undefined;
        const decoded = decodeURIComponent(m[1]);
        const json = decodeURIComponent(escape(atob(decoded)));
        const obj = JSON.parse(json);
        if (obj && typeof obj === 'object' && isNonEmptyString(obj.id)) {
            return obj;
        }
        return undefined;
    }
    catch {
        return undefined;
    }
};
