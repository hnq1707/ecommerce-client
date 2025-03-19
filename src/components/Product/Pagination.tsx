'use client';

import type React from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '../ui/pagination';
import { useCallback, useMemo } from 'react';

interface PaginationProps {
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationProps> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Tạo URL mới với tham số page được cập nhật
  const createPageURL = useCallback(
    (pageNumber: number | string) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  // Xử lý chuyển trang mà không reload toàn bộ trang
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        router.push(createPageURL(newPage));
      }
    },
    [router, createPageURL, totalPages],
  );

  // Tính toán các trang cần hiển thị
  const pageItems = useMemo(() => {
    // Nếu ít hơn 7 trang, hiển thị tất cả
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Luôn hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
    const items = [1];

    // Tính toán phạm vi trang cần hiển thị
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Điều chỉnh để luôn hiển thị 3 trang ở giữa
    if (startPage === 2) endPage = Math.min(4, totalPages - 1);
    if (endPage === totalPages - 1) startPage = Math.max(totalPages - 3, 2);

    // Thêm dấu ... trước nếu cần
    if (startPage > 2) items.push(-1); // -1 đại diện cho dấu ...

    // Thêm các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Thêm dấu ... sau nếu cần
    if (endPage < totalPages - 1) items.push(-2); // -2 đại diện cho dấu ... thứ hai

    // Thêm trang cuối
    if (totalPages > 1) items.push(totalPages);

    return items;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
            onClick={(e) => {
              if (currentPage > 1) {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              } else {
                e.preventDefault();
              }
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {pageItems.map((page, index) => {
          // Xử lý dấu ...
          if (page < 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
            onClick={(e) => {
              if (currentPage < totalPages) {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              } else {
                e.preventDefault();
              }
            }}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
