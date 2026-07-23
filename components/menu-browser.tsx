"use client"

import { useMemo, useState } from "react"
import { MenuCard } from "@/components/menu-card"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/lib/types"
import { Leaf } from "lucide-react"

export function MenuBrowser({ items, categories }: { items: MenuItem[], categories?: string[] }) {
  const categoryList = useMemo(() => {
    if (categories && categories.length > 0) {
      return ["All", ...categories]
    }
    const unique = Array.from(new Set(items.map((i) => i.category)))
    return ["All", ...unique]
  }, [items, categories])

  const [active, setActive] = useState("All")

  const filtered = active === "All" ? items : items.filter((i) => i.category === active)

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Leaf className="h-10 w-10 text-green-600" />
        </div>
        <p className="mt-4 text-lg font-medium">No menu items available</p>
        <p className="text-sm text-muted-foreground mt-2">Our chefs are preparing something delicious. Check back soon!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categoryList.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
              active === cat
                ? "border-green-600 bg-green-600 text-white shadow-md shadow-green-600/20 hover:bg-green-700"
                : "border-border bg-card text-muted-foreground hover:border-green-600/40 hover:text-foreground hover:bg-green-50/50 dark:hover:bg-green-950/10",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found in this category.</p>
        </div>
      )}
    </div>
  )
}