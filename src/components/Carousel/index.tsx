'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';

const slides = [
  {
    id: 1,
    title: 'Summer Sale Collections',
    description: 'Sale! Up to 50% off!',
    img: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '/',
    bg: 'bg-gradient-to-r from-yellow-50 to-pink-50',
  },
  {
    id: 2,
    title: 'Winter Sale Collections',
    description: 'Sale! Up to 50% off!',
    img: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '/',
    bg: 'bg-gradient-to-r from-pink-50 to-blue-50',
  },
  {
    id: 3,
    title: 'Spring Sale Collections',
    description: 'Sale! Up to 50% off!',
    img: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: '/',
    bg: 'bg-gradient-to-r from-blue-50 to-yellow-50',
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // Auto play: luôn chạy slide chuyển động mỗi 5 giây
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [nextSlide]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <div
      className="relative h-[calc(100vh-80px)] overflow-hidden"
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional banners"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Carousel Track */}
      <div
        className="h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            className={cn(
              slide.bg,
              'w-full h-full flex flex-col gap-8 md:gap-12 xl:flex-row shrink-0',
            )}
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={current !== index}
          >
            {/* Text Container */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-6 md:gap-8 2xl:gap-12 text-center px-6 md:px-12">
              <span className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-medium text-gray-700 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                {slide.description}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                {slide.title}
              </h1>
              <Link
                href={slide.url}
                className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base md:text-lg bg-black hover:bg-gray-800 transition-colors"
                >
                  SHOP NOW
                </Button>
              </Link>
            </div>

            {/* Image Container */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              <Image
                src={slide.img || '/placeholder.svg'}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover animate-in fade-in duration-1000"
                onLoad={(e) => {
                  // Remove loading animation when image loads
                  (e.target as HTMLImageElement).parentElement?.classList.remove(
                    'bg-gray-200',
                    'animate-pulse',
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border-none shadow-md hidden md:flex"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border-none shadow-md hidden md:flex"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              current === index ? 'bg-black scale-125' : 'bg-black/30 hover:bg-black/50',
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-300 ease-linear"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Carousel;
