'use client';

import type React from 'react';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';

interface SearchBarProps {
  compact?: boolean;
}

const SearchBar = ({ compact = false }: SearchBarProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/list?name=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  // For mobile compact view
  const toggleExpand = () => {
    if (compact) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
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
              name="name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-base"
              autoComplete="off"
            />

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
  );
};

export default SearchBar;
