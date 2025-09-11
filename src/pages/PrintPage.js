import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/PrintPage.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrintSheet from "../components/PrintSheet";
const STORAGE_KEY = "onetrip_saved_trip";
export default function PrintPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const passedTrip = location.state?.trip;
    const trip = passedTrip ??
        (() => {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : null;
            }
            catch {
                return null;
            }
        })();
    // ✅ otomatik yazdır + geri dön
    useEffect(() => {
        const t = setTimeout(() => {
            const backTo = location.state?.from ?? "/";
            const handleAfterPrint = () => {
                window.removeEventListener("afterprint", handleAfterPrint);
                navigate(backTo, { replace: true });
            };
            window.addEventListener("afterprint", handleAfterPrint);
            window.print();
        }, 100);
        return () => clearTimeout(t);
    }, [location.state, navigate]);
    if (!trip)
        return _jsx("div", { style: { padding: 24 }, children: "No trip data" });
    return _jsx(PrintSheet, { trip: trip });
}
