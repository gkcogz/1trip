import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-start justify-center pt-24 overflow-hidden bg-gradient-to-br from-[#2CA6A4]/50 via-[#0F2530]/40 to-[#FAF9F6]/50 animate-gradient">
      {/* --- DEĞİŞİKLİK BURADA: Boyut ve pozisyon güncellendi --- */}
      <Link to="/" title="Home" className="fixed top-4 left-6 z-50 print:hidden">
        <img
          src="/logo.png"
          alt="logo"
          className="h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110"
        />
      </Link>
      
      <span className="absolute w-72 h-72 bg-[#2CA6A4]/30 rounded-full top-[-80px] left-[-80px] animate-pulse-slow blur-3xl"></span>
      <span className="absolute w-96 h-96 bg-[#218C8A]/20 rounded-full bottom-[-100px] right-[-100px] animate-pulse-slow blur-3xl"></span>

      <form
        onSubmit={handleLogin}
        className="glass relative z-10 p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[var(--color-brand)]">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-lg p-3"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-[var(--color-brand)] font-semibold">
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}