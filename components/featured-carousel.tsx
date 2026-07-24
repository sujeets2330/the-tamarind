"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/types"

export function FeaturedCarousel({ items }: { items: MenuItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const itemsPerPage = isMobile ? 1 : 4
  const totalPages = Math.ceil(items.length / itemsPerPage)

  const scrollToPage = (page: number) => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = container.querySelector('.card-item')?.getBoundingClientRect()?.width || 0
    const gap = isMobile ? 16 : 16
    const scrollAmount = page * (cardWidth + gap) * itemsPerPage

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    })

    setCurrentPage(page)
  }

  const scroll = (direction: "left" | "right") => {
    const next =
      direction === "left"
        ? Math.max(0, currentPage - 1)
        : Math.min(totalPages - 1, currentPage + 1)

    scrollToPage(next)
  }

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = container.querySelector('.card-item')?.getBoundingClientRect()?.width || 0
    const gap = isMobile ? 16 : 16
    const page = Math.round(container.scrollLeft / ((cardWidth + gap) * itemsPerPage))

    setCurrentPage(page)

    setShowLeftArrow(container.scrollLeft > 5)
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 5
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const distance = touchStartX - touchEndX

    if (Math.abs(distance) > 50) {
      if (distance > 0 && currentPage < totalPages - 1) {
        scrollToPage(currentPage + 1)
      } else if (distance < 0 && currentPage > 0) {
        scrollToPage(currentPage - 1)
      }
    }

    setTouchStartX(0)
    setTouchEndX(0)
  }

  if (!items.length) return null

  return (
    <section className="bg-secondary/40 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 md:mb-10 text-center">
          <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-primary">
            Guest favourites
          </p>

          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-bold">
            Signature dishes
          </h2>

          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Our most loved pure vegetarian creations
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-primary hover:text-white transition-all duration-200 border border-gray-700 hover:border-primary p-2.5 -ml-4 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="card-item snap-start shrink-0 w-full md:w-[calc(25%-12px)]"
                >
                  <div 
                    className="overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:scale-[1.02] group cursor-pointer"
                    onClick={() => window.location.href = `/menu/${item.id}`}
                  >
                    <div className="relative h-32 md:h-40 bg-muted overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}

                      {item.is_veg && (
                        <div className="absolute left-2 top-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-[10px] text-white">
                            <Leaf className="h-3 w-3" />
                            Pure Veg
                          </span>
                        </div>
                      )}

                      {item.rating && (
                        <div className="absolute bottom-2 right-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {Number(item.rating).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 transition-colors duration-300 group-hover:bg-primary/5">
                      <div className="flex items-start justify-between">
                        <h3 className="truncate font-semibold transition-colors duration-300 group-hover:text-primary">
                          {item.name}
                        </h3>

                        <span className="font-bold text-primary transition-transform duration-300 group-hover:scale-110">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.category}
                      </p>

                      <Button
                        variant="outline"
                        className="mt-4 w-full transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/menu/${item.id}`
                        }}
                      >
                        View Item
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-primary hover:text-white transition-all duration-200 border border-gray-700 hover:border-primary p-2.5 -mr-4 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToPage(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentPage === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}