import { Routes, Route, Navigate } from "react-router-dom";
import PlannerWrapper from "./pages/Planner";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrintPage from "./pages/PrintPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import StaticPageLayout from "./components/StaticPageLayout"; // Layout'u import ediyoruz

export default function App() {
  return (
    <Routes>
      {/* Layout KULLANMAYAN özel sayfalar (Planlayıcı, Giriş, Kayıt, Yazdırma) */}
      <Route path="/" element={<PlannerWrapper />} />
      {/* Ana sayfa yönlendirmesi için Navigate'i kaldırdık, PlannerWrapper'ı doğrudan kullanıyoruz */}
      <Route path="/planner" element={<PlannerWrapper />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/print" element={<PrintPage />} />

      {/* Standart Layout KULLANAN sayfalar (Blog, Hakkında, İletişim vb.) */}
      <Route element={<StaticPageLayout />}>
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Eşleşmeyen tüm yolları ana sayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}