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
  const [isMobile, setIsMobile] = useState(false)

  // Touch drag state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)

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
  }, [itemsPerView])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = isMobile ? 280 : 320
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
      
      const cardWidth = isMobile ? 280 : 320
      const newIndex = Math.round(scrollLeft / (cardWidth * itemsPerView))
      setCurrentIndex(newIndex)
    }
  }

  // ========== SWIPE / DRAG HANDLERS ==========
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeftStart(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.style.cursor = 'grabbing'
    scrollContainerRef.current.style.userSelect = 'none'
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = 'auto'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeftStart(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Create slides array
  const slides = []
  for (let i = 0; i < items.length; i += itemsPerView) {
    slides.push(items.slice(i, i + itemsPerView))
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-6 md:mb-10 text-center">
          <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-primary">Guest favourites</p>
          <h2 className="mt-1 md:mt-2 font-serif text-2xl md:text-3xl font-bold sm:text-4xl">Signature dishes</h2>
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
              <ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5 md:h-6 md:w-6'} text-gray-700 dark:text-gray-300`} />
            </button>
          )}

          {/* Scroll Container with Drag/Swipe */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-hidden scroll-smooth cursor-grab select-none"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex gap-3 md:gap-6 transition-all duration-300" style={{ width: '100%' }}>
              {slides.map((slide, slideIndex) => (
                <div 
                  key={slideIndex}
                  className="flex gap-3 md:gap-6 flex-shrink-0"
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

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 border border-gray-200 dark:border-gray-700 ${
                isMobile ? '-mr-2 p-1.5' : '-mr-4 p-2'
              }`}
              aria-label="Next"
            >
              <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5 md:h-6 md:w-6'} text-gray-700 dark:text-gray-300`} />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  if (scrollContainerRef.current) {
                    const cardWidth = isMobile ? 280 : 320
                    scrollContainerRef.current.scrollTo({
                      left: index * (cardWidth * itemsPerView),
                      behavior: 'smooth'
                    })
                  }
                }}
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