import type { Metadata } from "next"
import { ShieldCheck, Leaf, Store } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { BookingForm } from "@/components/booking-form"
import { getBranches } from "@/lib/db"

export const metadata: Metadata = {
  title: "Book a Table — The Tamarind Pure Veg",
  description: "Reserve your table at The Tamarind Pure Veg. No account needed — just your name, mobile and city.",
}

export const dynamic = "force-dynamic"

const branchDetails: Record<number, { address: string; timings: string; days: string }> = {
  1: {
    address: "RK Colony, Nippani Road, Beside Canara Bank, Chikodi 591201",
    timings: "12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM",
    days: "Monday - Sunday"
  },
  2: {
    address: "Basaveshwar Circle, Opp. KLE Hospital, Chikodi 591201",
    timings: "7:00 AM - 9:00 PM",
    days: "Monday - Sunday"
  }
}

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

export default async function BookingPage() {
  const branches = await getBranches()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            {/* Left: info */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-600/10 px-3 py-1 text-sm font-medium text-green-600">
                <Leaf className="h-4 w-4" />
                Pure Vegetarian
              </div>
              <h1 className="mt-4 text-balance font-serif text-4xl font-bold sm:text-5xl">
                Book your table
              </h1>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Tell us who's coming and when. We'll reserve the perfect table for you 
                — no login, no fuss.
              </p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">
                    Instant confirmation with your booking details.
                  </span>
                </li>
              </ul>

              {/* Branch Details on Left Side */}
              <div className="mt-8 border-t border-border/60 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Our Branches
                </h3>
                <div className="space-y-4">
                  {branches.map((branch: any) => {
                    const details = branchDetails[branch.id as keyof typeof branchDetails]
                    const status = getBranchStatus(branch.id)
                    return (
                      <div key={branch.id} className="rounded-lg border border-border/60 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-green-600" />
                            <p className="text-sm font-medium text-foreground">
                              The Tamarind Pure Veg Branch {branch.id}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                            status.isOpen 
                              ? 'bg-green-600/10 text-green-600' 
                              : 'bg-red-600/10 text-red-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              status.isOpen ? 'bg-green-600 animate-pulse' : 'bg-red-600'
                            }`} />
                            {status.statusText}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {details?.address || 'Address not available'}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                           {details?.timings || 'Timings not available'}
                        </p>
                        <p className="text-xs text-muted-foreground/50 mt-0.5">
                           {details?.days || 'Days not available'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <BookingForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}