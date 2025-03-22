'use client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Trang {currentPage} / {totalPages}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            // Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
            return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
          })
          .map((page, index, array) => {
            // Thêm dấu ... nếu có khoảng cách giữa các trang
            if (index > 0 && page - array[index - 1] > 1) {
              return (
                <Button key={`ellipsis-${page}`} variant="outline" size="icon" disabled>
                  ...
                </Button>
              );
            }
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
