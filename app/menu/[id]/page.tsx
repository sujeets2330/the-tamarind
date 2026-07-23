import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Leaf, Star, Clock, UtensilsCrossed } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { getMenuItems, getMenuItemById } from "@/lib/menu"
import type { MenuItem } from "@/lib/types"

export async function generateStaticParams() {
  const { items } = await getMenuItems()
  return items.map((item: MenuItem) => ({
    id: String(item.id),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getMenuItemById(parseInt(id))
  
  if (!item) {
    return {
      title: "Item not found",
    }
  }
  
  return {
    title: `${item.name} — Pure Veg Tamarind`,
    description: item.description,
  }
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

export default async function MenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getMenuItemById(parseInt(id))
  
  if (!item) {
    notFound()
  }

  const { items } = await getMenuItems()
  const relatedItems = items
    .filter((i: MenuItem) => i.category === item.category && i.id !== item.id)
    .slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                {item.image_url ? (
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
                    <UtensilsCrossed className="h-20 w-20 text-green-600/30" />
                    <p className="text-sm text-muted-foreground">Image coming soon</p>
                  </div>
                )}
                
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                    <Leaf className="h-4 w-4" />
                    Pure Veg
                  </span>
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col p-6 md:p-8">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="font-serif text-3xl font-bold md:text-4xl">{item.name}</h1>
                    <span className="shrink-0 text-2xl font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  
                  {item.rating && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2.5 py-1 text-sm font-medium text-green-600">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {item.rating} / 5
                      </div>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">100+ reviews</span>
                    </div>
                  )}
                  
                  <div className="mt-6 border-t border-border/60 pt-6">
                    <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Description
                    </h2>
                    <p className="mt-2 text-base leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="mt-6 border-t border-border/60 pt-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-green-100 p-1.5 text-green-600">
                          <Leaf className="h-4 w-4" />
                        </div>
                        <span className="text-sm">100% Vegetarian</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5 text-blue-600">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span className="text-sm">Freshly prepared</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link 
                      href="https://www.zomato.com/your-restaurant-link" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" className="w-full bg-red-500 hover:bg-red-600">
                        <svg 
                          className="h-5 w-5 mr-2" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                          <circle cx="12" cy="12" r="2"/>
                        </svg>
                        Order with Zomato
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">You might also like</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedItems.map((relatedItem: MenuItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/menu/${relatedItem.id}`}
                    className="group rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {relatedItem.name}
                      </h3>
                      <span className="font-semibold text-primary">{formatPrice(relatedItem.price)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{relatedItem.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}