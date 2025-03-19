'use client';

import { Resource } from '@/lib/type/Resource';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImagesProps {
  items?: Resource[];
}

const ProductImages = ({ items = [] }: ProductImagesProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Get all image URLs
  const images =
    items.length > 0
      ? [
          // Primary image first
          ...items.filter((resource) => resource.isPrimary).map((resource) => resource.url),
          // Then secondary images
          ...items.filter((resource) => !resource.isPrimary).map((resource) => resource.url),
        ]
      : [];

  // Set primary image as selected on initial load
  useEffect(() => {
    const primaryIndex = items.findIndex((resource) => resource.isPrimary);
    setSelectedImageIndex(primaryIndex !== -1 ? primaryIndex : 0);
  }, [items]);

  // Handle navigation
  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') setIsZoomed(false);
        return;
      }

      if (e.key === 'ArrowLeft') goToPrevImage();
      else if (e.key === 'ArrowRight') goToNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNextImage();
    } else if (distance < -minSwipeDistance) {
      goToPrevImage();
    }
  };

  // Render empty state if no images
  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-center p-4">
            <p>No Images Available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image container */}
      <div
        className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading placeholder */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />

        {/* Main image */}
        <Image
          src={images[selectedImageIndex] || '/placeholder.svg'}
          alt={`Product Image ${selectedImageIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-opacity duration-300"
          onLoad={(e) => {
            // Remove loading animation when image loads
            const target = e.target as HTMLImageElement;
            if (target.parentElement) {
              const placeholder = target.parentElement.querySelector('.animate-pulse');
              if (placeholder) placeholder.classList.remove('animate-pulse');
            }
          }}
        />

        {/* Zoom button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-none shadow-md"
          onClick={() => setIsZoomed(true)}
          aria-label="Zoom image"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        {/* Navigation arrows (only show if more than one image) */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-none shadow-md"
              onClick={goToPrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-none shadow-md"
              onClick={goToNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, index) => (
            <button
              key={index}
              className={cn(
                'relative aspect-square rounded-md overflow-hidden border-2 transition-all',
                selectedImageIndex === index
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-transparent hover:border-gray-300',
              )}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedImageIndex === index}
            >
              <Image
                src={url || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox for zoomed view */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsZoomed(false)}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 border-none text-white z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
            aria-label="Close zoom view"
          >
            <X className="h-5 w-5" />
          </Button>

          <div
            className="relative w-full h-full max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex] || '/placeholder.svg'}
              alt={`Product Image ${selectedImageIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {/* Navigation in lightbox */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 border-none text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevImage();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 border-none text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
