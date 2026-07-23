import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, MapPin, Star, Leaf, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { getMenuItems } from "@/lib/menu"

function getBranchStatus(branchId: number): { isOpen: boolean; statusText: string } {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours + minutes / 60

  if (branchId === 1) {
    const open1 = currentTime >= 12 && currentTime < 16
    const open2 = currentTime >= 19 && currentTime < 23
    const isOpen = open1 || open2
    return { isOpen, statusText: isOpen ? 'Open Now' : 'Closed' }
  } else if (branchId === 2) {
    const isOpen = currentTime >= 7 && currentTime < 21
    return { isOpen, statusText: isOpen ? 'Open Now' : 'Closed' }
  }

  return { isOpen: false, statusText: 'Closed' }
}

export default async function HomePage() {
  const menuData = await getMenuItems()
  const items = Array.isArray(menuData) ? menuData : (menuData as any).items || []
  const featured = items.length > 0 ? items : []

  const branch1Status = getBranchStatus(1)
  const branch2Status = getBranchStatus(2)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero */}
<section className="relative">
  <div className="absolute inset-0">
    <Image
      src="/hero.jpeg"
      alt="Pure vegetarian restaurant - The Tamarind Pure Veg"
      fill
      priority
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
  </div>

  <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center px-4 py-28 sm:px-6 md:py-40">
    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-600/10 px-3 py-1 text-xs font-medium backdrop-blur">
      <Leaf className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
      Pure Vegetarian · Since 2016
    </span>
     
    <h1 className="max-w-2xl text-balance font-serif text-4xl font-bold leading-tight sm:text-6xl">
      <span className="text-green-600">The Tamarind</span> Pure Veg
    </h1>
    <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
      Authentic Indian vegetarian cuisine made with love. Fresh ingredients, 
      hand-picked spices, and a cozy table waiting just for you. 
      Reserve in seconds — no account needed.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Button render={<Link href="/booking" />} size="lg" className="bg-green-600 hover:bg-green-700">
        Book a Table
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  </div>
</section>
        {/* Highlights with Open/Closed Status below timings */}
        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  icon: Store, 
                  title: "Branch 1", 
                  text: "RK Colony, Nippani Road, Beside Canara Bank, Chikodi 591201",
                  timing: "12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM",
                  status: branch1Status
                },
                { 
                  icon: Store, 
                  title: "Branch 2", 
                  text: "Basaveshwar Circle, Opp. KLE Hospital, Chikodi 591201",
                  timing: "7:00 AM - 9:00 PM",
                  status: branch2Status
                },
                { 
                  icon: Star, 
                  title: "4.8 / 5 rating", 
                  text: "Loved by 3,000+ guests",
                  timing: "Mon - Sun"
                },
              ].map((h) => (
                <div key={h.title} className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <h.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{h.title}</p>
                    <p className="text-sm text-muted-foreground">{h.text}</p>
                    {h.timing && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {h.timing}
                      </p>
                    )}
                    {h.status && (
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          h.status.isOpen 
                            ? 'bg-green-600/10 text-green-600' 
                            : 'bg-red-600/10 text-red-600'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            h.status.isOpen ? 'bg-green-600 animate-pulse' : 'bg-red-600'
                          }`} />
                          {h.status.statusText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image 
                src="/about.jpeg" 
                alt="Pure vegetarian kitchen at Tamarind - Fresh ingredients and authentic Indian cooking" 
                fill 
                className="object-cover" 
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                  <Leaf className="h-4 w-4" />
                  Pure Vegetarian
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  THE KITCHEN
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-balance font-serif text-3xl font-bold sm:text-4xl">
                Pure Vegetarian Delights
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Every dish at Tamarind starts with the freshest vegetables, hand-picked spices, and 
                produce sourced each morning from local farmers. Our kitchen blends time-honoured 
                family recipes with a modern, lighter touch — so the flavours feel both familiar and new.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                From crispy dosas to aromatic biryanis, every item on our menu is 100% vegetarian. 
                Whether it's a quiet dinner for two or a celebration with the whole family, we 
                have a table with your name on it.
              </p>
              
              <div className="relative inline-block mt-6">
                <Button variant="outline" className="border-green-600/30 hover:border-green-600 text-green-700 hover:text-green-800 hover:bg-green-50 flex items-center gap-1">
                  Explore our pure veg menu
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="absolute left-0 mt-2 w-56 opacity-0 invisible pointer-events-none transition-all duration-200 z-50">
                  <div className="rounded-lg border border-border/60 bg-background/95 backdrop-blur-md shadow-lg py-1">
                    <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border/40">
                      Select Branch
                    </div>
                    <Link
                      href="/menu/branch1"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      Tamarind Branch 1
                    </Link>
                    <Link
                      href="/menu"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      Tamarind Branch 2
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured dishes */}
        {featured.length > 0 && <FeaturedCarousel items={featured} />}

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-700 px-6 py-12 text-center text-white sm:py-16 shadow-2xl shadow-green-700/20">
            <h2 className="text-balance font-serif text-3xl font-bold sm:text-4xl">
              Hungry? Let's get you a table
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-white/85">
              Pick a slot, tell us how many are coming, and we'll match you to the perfect table.
            </p>
            <Button render={<Link href="/booking" />} size="lg" variant="secondary" className="mt-6 bg-white text-green-700 hover:bg-gray-100 hover:text-green-800 shadow-lg shadow-white/20">
              Reserve now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}