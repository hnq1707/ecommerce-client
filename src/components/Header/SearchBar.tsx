'use client';

import { Search, X, Filter, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useDebounce } from '@/hooks/use-debounce';
import { Product } from '@/lib/type/Product';

interface SearchBarProps {
  compact?: boolean;
}

const SearchBar = ({ compact = false }: SearchBarProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchMode, setSearchMode] = useState<'basic' | 'advanced'>('basic');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close results dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch search results when debounced search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const endpoint =
          searchMode === 'advanced'
            ? `/api/products/search/advanced?keyword=${encodeURIComponent(debouncedSearchTerm)}`
            : `/api/products/search?keyword=${encodeURIComponent(debouncedSearchTerm)}`;

        const response = await fetch(endpoint);
        console.log(endpoint);

        const data = await response.json();
        console.log(data);

        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      fetchSearchResults();
    }
  }, [debouncedSearchTerm, searchMode]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      router.push(`/list?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const toggleSearchMode = () => {
    setSearchMode(searchMode === 'basic' ? 'advanced' : 'basic');
  };

  // For mobile compact view
  const toggleExpand = () => {
    if (compact) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setShowResults(false);
      }
    }
  };

  return (
    <div className="relative" ref={searchResultsRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'transition-all duration-200',
          compact && !isExpanded ? 'w-12' : 'w-full md:max-w-md',
        )}
      >
        <AnimatePresence mode="wait">
          {compact && !isExpanded ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpand}
                className="h-12 w-12 rounded-full"
                aria-label="Open search"
              >
                <Search className="h-6 w-6" />
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="expanded"
              initial={{ opacity: 0, width: compact ? 0 : '100%' }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex items-center gap-3 bg-gray-100 rounded-full overflow-hidden transition-all duration-200',
                compact ? 'p-2' : 'p-3',
              )}
              onSubmit={handleSearch}
            >
              <button
                type="submit"
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 bg-transparent outline-none text-base"
                autoComplete="off"
              />

              {isLoading && (
                <div className="flex-shrink-0 p-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}

              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={handleClear}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}

              <button
                type="button"
                onClick={toggleSearchMode}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label={`Switch to ${searchMode === 'basic' ? 'advanced' : 'basic'} search`}
                title={`${searchMode === 'basic' ? 'Advanced' : 'Basic'} search`}
              >
                <Filter className={cn('h-5 w-5', searchMode === 'advanced' && 'text-blue-600')} />
              </button>

              {compact && (
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors ml-1"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden max-h-[70vh] overflow-y-auto"
          >
            <div className="p-2">
              <div className="flex justify-between items-center mb-2 px-2">
                <h3 className="text-sm font-medium text-gray-700">Kết quả tìm kiếm</h3>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${product.slug}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="h-12 w-12 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          <Search className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-sm font-medium text-blue-600">
                          {product.price.toLocaleString('vi-VN')}₫
                        </p>
                        <span className="mx-2 text-gray-300">|</span>
                        <p className="text-xs text-gray-500 truncate">{product.categoryName}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    router.push(`/list?keyword=${encodeURIComponent(searchTerm.trim())}`);
                    setShowResults(false);
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
                >
                  Xem tất cả kết quả
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
