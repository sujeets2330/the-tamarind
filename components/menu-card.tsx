import Link from "next/link"
import Image from "next/image"
import { Leaf, UtensilsCrossed, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/types"

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
      <Link href={`/menu/${item.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          {item.image_url ? (
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <UtensilsCrossed className="h-12 w-12 text-green-600/40 dark:text-green-400/40" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.category}</span>
            </div>
          )}
          
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              <Leaf className="h-3 w-3" aria-hidden="true" />
              Pure Veg
            </span>
          </div>
          
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {item.category}
            </span>
          </div>
          
          {item.rating && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {item.rating}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/menu/${item.id}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="shrink-0 font-semibold text-primary text-lg">{formatPrice(item.price)}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{item.description}</p>
        </Link>
        
        <div className="mt-4">
          <Link href={`/menu/${item.id}`} className="w-full">
            <Button size="sm" className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-300">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View Item
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}