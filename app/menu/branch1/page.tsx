import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { MenuBrowser } from "@/components/menu-browser"
import { getMenuItemsByBranch } from "@/lib/menu"
import { getCategories } from "@/lib/db"

export const metadata: Metadata = {
  title: "Menu — Tamarind Branch 1",
  description: "Explore our 100% pure vegetarian menu from Tamarind Branch 1.",
}

export const dynamic = "force-dynamic"

export default async function Branch1MenuPage() {
  const menuData = await getMenuItemsByBranch(1)
  const categories = await getCategories()
  
  const items = Array.isArray(menuData) ? menuData : menuData.items || []
  const vegItems = items.filter((item: any) => item.is_veg === true || item.is_veg === 1)
  
  const categoryNames = categories.map((c: any) => c.name)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-b from-green-50/50 to-background dark:from-green-950/10">
          <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              100% Pure Vegetarian
            </div>
            <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Tamarind Branch 1</h1>
            <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              Freshly prepared with love. Every dish is 100% vegetarian and made with the finest ingredients.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <MenuBrowser items={vegItems} categories={categoryNames} />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}