"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/types"

export function FeaturedCarousel({ items }: { items: MenuItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Swipe state
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const itemsPerView = isMobile ? 1 : 3
  const totalSlides = Math.ceil(items.length / itemsPerView)

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.querySelector('.menu-card')?.getBoundingClientRect()?.width || (isMobile ? 280 : 320)
      const gap = isMobile ? 12 : 24
      const scrollAmount = index * (cardWidth + gap)
      
      setCurrentIndex(index)
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(totalSlides - 1, currentIndex + 1)
    scrollToSlide(newIndex)
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      
      const container = scrollContainerRef.current
      const cardWidth = container.querySelector('.menu-card')?.getBoundingClientRect()?.width || (isMobile ? 280 : 320)
      const gap = isMobile ? 12 : 24
      const newIndex = Math.round(scrollLeft / (cardWidth + gap))
      setCurrentIndex(newIndex)
    }
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX - touchEndX
    
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0 && currentIndex < totalSlides - 1) {
        scrollToSlide(currentIndex + 1)
      } else if (swipeDistance < 0 && currentIndex > 0) {
        scrollToSlide(currentIndex - 1)
      }
    }
    
    setTouchStartX(0)
    setTouchEndX(0)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section className="bg-secondary/40 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 md:mb-10 text-center">
          <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-primary">Guest favourites</p>
          <h2 className="mt-1 md:mt-2 font-serif text-2xl md:text-3xl font-bold">Signature dishes</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Our most loved pure vegetarian creations</p>
        </div>
        
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 border border-gray-200 dark:border-gray-700 ${
                isMobile ? '-ml-2 p-1.5' : '-ml-4 p-2'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-gray-700 dark:text-gray-300`} />
            </button>
          )}

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-x-auto scroll-smooth touch-pan-y"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-3 md:gap-6" style={{ width: 'max-content' }}>
              {items.map((item) => (
                <div key={item.id} className="menu-card w-[200px] md:w-[240px] flex-shrink-0">
                  <div className="bg-background rounded-xl border border-border/60 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Image - Small & Compact */}
                    <div className="relative h-32 md:h-40 bg-muted/30">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                      {item.is_veg && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-600/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            <Leaf className="h-2.5 w-2.5" />
                            Pure Veg
                          </span>
                        </div>
                      )}
                      {item.rating && (
                        <div className="absolute bottom-2 right-2">
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            {Number(item.rating).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content - Compact */}
                    <div className="p-3 md:p-4">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm md:text-base font-semibold text-foreground truncate">
                          {item.name}
                        </h3>
                        <span className="text-sm md:text-base font-bold text-primary whitespace-nowrap">
                          ₹{item.price}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {item.category}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full text-xs h-8 border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => window.location.href = `/menu/${item.id}`}
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
              onClick={() => scroll('right')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 border border-gray-200 dark:border-gray-700 ${
                isMobile ? '-mr-2 p-1.5' : '-mr-4 p-2'
              }`}
              aria-label="Next"
            >
              <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-gray-700 dark:text-gray-300`} />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}