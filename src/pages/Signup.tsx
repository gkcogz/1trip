import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) throw error

      alert("Signup successful! Please verify your email.")
      navigate("/login")
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* --- DEĞİŞİKLİK BURADA: Boyut ve pozisyon güncellendi --- */}
      <Link to="/" title="Home" className="fixed top-4 left-6 z-50 print:hidden">
        <img
          src="/logo.png"
          alt="logo"
          className="h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110"
        />
      </Link>

      <form
        onSubmit={handleSignup}
        className="glass p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[var(--color-brand)]">
          Sign Up
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[var(--color-brand)] font-semibold">
            Log in
          </a>
        </p>
      </form>
    </div>
  )
}