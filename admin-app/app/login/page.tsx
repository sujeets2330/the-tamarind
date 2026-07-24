"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.message || "Login failed")
        return
      }
      
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950/30">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-3xl bg-emerald-500 blur-2xl opacity-30 animate-pulse" />
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/25">
              <Leaf className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Tamarind Pure Veg</h1>
          <p className="mt-2 text-sm text-gray-400">Admin Dashboard Login</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-xl p-8 shadow-2xl"
        >
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="email">
            Email Address
          </label>
          <div className="relative mb-5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-11 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="admin@tamarind.com"
            />
          </div>

          <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="password">
            Password
          </label>
          <div className="relative mb-6">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-11 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-sm font-semibold text-white transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <span>Default:</span>
          <code className="bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-700/30 text-emerald-400">
            admin@tamarind.com
          </code>
          <span className="text-gray-600">/</span>
          <code className="bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-700/30 text-emerald-400">
            admin123
          </code>
        </p>
      </div>
    </main>
  )
}