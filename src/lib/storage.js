import { isNonEmptyString } from './utils';
var KEY = 'onetrip_trip';
export var loadTrip = function () {
    try {
        var raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : undefined;
    }
    catch (_a) {
        return undefined;
    }
};
export var saveTrip = function (t) {
    try {
        localStorage.setItem(KEY, JSON.stringify(t));
    }
    catch (_a) {
        // storage dolu olabilir; sessiz geç
    }
};
export var hashEncode = function (t) {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(t)))));
};
export var hashDecode = function () {
    try {
        var m = location.hash.match(/plan=([^&]+)/);
        if (!m)
            return undefined;
        var decoded = decodeURIComponent(m[1]);
        var json = decodeURIComponent(escape(atob(decoded)));
        var obj = JSON.parse(json);
        if (obj && typeof obj === 'object' && isNonEmptyString(obj.id)) {
            return obj;
        }
        return undefined;
    }
    catch (_a) {
        return undefined;
    }
};
