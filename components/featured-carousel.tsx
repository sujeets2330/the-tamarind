"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MenuCard } from "@/components/menu-card"
import type { MenuItem } from "@/lib/types"

export function FeaturedCarousel({ items }: { items: MenuItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3
  const totalSlides = Math.ceil(items.length / itemsPerView)

  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 320
      const newIndex = direction === 'left' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(totalSlides - 1, currentIndex + 1)
      
      setCurrentIndex(newIndex)
      scrollContainerRef.current.scrollTo({
        left: newIndex * (cardWidth * itemsPerView),
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      
      const cardWidth = 320
      const newIndex = Math.round(scrollLeft / (cardWidth * itemsPerView))
      setCurrentIndex(newIndex)
    }
  }

  const slides = []
  for (let i = 0; i < items.length; i += itemsPerView) {
    slides.push(items.slice(i, i + itemsPerView))
  }

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Guest favourites</p>
          <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Signature dishes</h2>
        </div>
        
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 -ml-4 border border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-hidden scroll-smooth"
          >
            <div className="flex gap-6 transition-all duration-300" style={{ width: '100%' }}>
              {slides.map((slide, slideIndex) => (
                <div 
                  key={slideIndex}
                  className="flex gap-6 flex-shrink-0"
                  style={{ width: '100%' }}
                >
                  {slide.map((item) => (
                    <div key={item.id} className="flex-1 min-w-0">
                      <MenuCard item={item} />
                    </div>
                  ))}
                  {slide.length < itemsPerView && 
                    Array.from({ length: itemsPerView - slide.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="flex-1 min-w-0" />
                    ))
                  }
                </div>
              ))}
            </div>
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 -mr-4 border border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}