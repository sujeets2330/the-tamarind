"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, X, Leaf, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setMenuDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuDropdownOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Leaf className="h-6 w-6 text-green-600" aria-hidden="true" />
          <span className="font-serif text-xl font-semibold tracking-tight">
            <span className="text-green-600">The Tamarind</span> Pure Veg
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-green-600",
              pathname === "/" ? "text-green-600" : "text-muted-foreground",
            )}
          >
            Home
          </Link>
          
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-green-600",
                pathname === "/menu" || pathname === "/menu/branch1" ? "text-green-600" : "text-muted-foreground",
              )}
            >
              Menu
              <ChevronDown className={`h-4 w-4 transition-transform ${menuDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {menuDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-border/60 bg-background/95 backdrop-blur-md shadow-lg py-1 z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/menu/branch1"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-green-50 hover:text-green-600 transition-colors"
                  onClick={() => setMenuDropdownOpen(false)}
                >
                  Tamarind Branch 1
                </Link>
                <Link
                  href="/menu"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-green-50 hover:text-green-600 transition-colors"
                  onClick={() => setMenuDropdownOpen(false)}
                >
                  Tamarind Branch 2
                </Link>
              </div>
            )}
          </div>
          
          <Link
            href="/booking"
            className={cn(
              "text-sm font-medium transition-colors hover:text-green-600",
              pathname === "/booking" ? "text-green-600" : "text-muted-foreground",
            )}
          >
            Book a Table
          </Link>
          
          <Button render={<Link href="/booking" />} size="sm" className="bg-green-600 hover:bg-green-700">
            Reserve
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-600",
                pathname === "/" ? "text-green-600" : "text-foreground",
              )}
            >
              Home
            </Link>
            <div className="border-b border-border/60 pb-1">
              <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Branches</div>
              <Link
                href="/menu/branch1"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Tamarind Branch 1
              </Link>
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                Tamarind Branch 2
              </Link>
            </div>
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-600",
                pathname === "/booking" ? "text-green-600" : "text-foreground",
              )}
            >
              Book a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}