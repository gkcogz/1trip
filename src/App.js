import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Planner from "./pages/Planner";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrintPage from "./pages/PrintPage";
import Topbar from "./components/Topbar";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost"; // ✅ bunu eklemelisi
export default function App() {
    const location = useLocation();
    const isPlanner = location.pathname.startsWith("/planner") || location.pathname.startsWith("/print");
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [!isPlanner && _jsx(Topbar, {}), _jsx("main", { className: "flex-1", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/planner", replace: true }) }), _jsx(Route, { path: "/planner", element: _jsx(Planner, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/blog", element: _jsx(Blog, {}) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(BlogPost, {}) }), _jsx(Route, { path: "/print", element: _jsx(PrintPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/planner", replace: true }) })] }) })] }));
}
