"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  
  async function logout() {
    await fetch("/api/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }
  
  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-4 py-2.5 text-sm font-medium transition-all duration-300 border border-rose-500/20 hover:border-rose-500/40 backdrop-blur-sm"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  )
}