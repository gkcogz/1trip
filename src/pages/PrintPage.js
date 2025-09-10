import { jsx as _jsx } from "react/jsx-runtime";
// src/pages/PrintPage.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrintSheet from "../components/PrintSheet";
export default function PrintPage({ trip }) {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        // Give React a tick so the sheet mounts before printing
        const t = setTimeout(() => {
            const backTo = location.state?.from ?? "/planner";
            const handleAfterPrint = () => {
                window.removeEventListener("afterprint", handleAfterPrint);
                navigate(backTo, { replace: true });
            };
            window.addEventListener("afterprint", handleAfterPrint);
            window.print();
        }, 50);
        return () => clearTimeout(t);
    }, [location.state, navigate]);
    // IMPORTANT: only the sheet is rendered on this route
    return _jsx(PrintSheet, { trip: trip });
}
