// src/App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Planner from "./pages/Planner"
import About from "./pages/About"
import Contact from "./pages/Contact"
import PrintPage from "./pages/PrintPage"
import Topbar from "./components/Topbar"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"  // ✅ bunu eklemelisi


export default function App() {
  const location = useLocation()
  const isPlanner = location.pathname.startsWith("/planner") || location.pathname.startsWith("/print")

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔥 Topbar'ı Planner dışındaki sayfalarda da göster */}
      {!isPlanner && <Topbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/planner" replace />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/print" element={<PrintPage />} />
          <Route path="*" element={<Navigate to="/planner" replace />} />
        </Routes>
      </main>
    </div>
  )
}
