'use client';

import type React from 'react';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
    <div
      className={cn(
        'transition-all duration-200',
        compact && !isExpanded ? 'w-12' : 'w-full md:max-w-md',
      )}
    >
      {compact && !isExpanded ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          className="h-12 w-12 rounded-full"
          aria-label="Open search"
        >
          <Search className="h-6 w-6" />
        </Button>
      ) : (
        <form
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
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
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
        </form>
      )}
    </div>
  );
};

export default SearchBar;
