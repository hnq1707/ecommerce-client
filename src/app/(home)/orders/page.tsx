'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserOrders,
  selectOrders,
  selectOrderLoading,
  selectOrderError,
  selectTotalPages,
  selectCurrentPage,
} from '@/lib/redux/features/order/orderSlice';
import OrderList from '@/components/orders/order-list';
import OrderSkeleton from '@/components/orders/order-skeleton';
import type { AppDispatch } from '@/lib/redux/store';
import type { Order } from '@/lib/types/Order';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Package2,
  RefreshCcw,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  // Redux state
  const orders = useSelector(selectOrders) as Order[] | undefined;
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    dispatch(getUserOrders({ page: currentPage, size: 8, sortBy }));
  }, [dispatch, currentPage, sortBy]);
  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setIsChangingPage(true);
      dispatch(getUserOrders({ page: newPage, size: 8, sortBy })).finally(() => {
        setTimeout(() => setIsChangingPage(false), 300);
      });
    }
  };
  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders?.filter((order) => order.orderStatus === filterStatus);
  }, [orders, filterStatus]);
  // Xử lý retry khi có lỗi
  const handleRetry = () => {
    dispatch(getUserOrders({ page: currentPage, size: 8 }));
  };

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(0);
        pageNumbers.push(-1);
        for (let i = totalPages - 4; i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(0);
        pageNumbers.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages - 1);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Đơn Hàng Của Tôi</h1>

          {/* Filter & Sort Controls */}
          {!isLoading && orders && orders.length > 0 && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Sắp xếp</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="newest">Mới nhất</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Cũ nhất</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-high">
                      Giá cao đến thấp
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-low">
                      Giá thấp đến cao
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Lọc</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                    <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="PENDING">Đang xử lý</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="SHIPPED">Đang giao</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="COMPLETED">Đã giao</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="CANCELLED">Đã hủy</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isLoading && !isChangingPage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <OrderSkeleton count={3} />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 border rounded-lg bg-destructive/10 text-destructive flex flex-col items-center justify-center space-y-4"
            >
              <p className="text-center font-medium">{error}</p>
              <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Thử lại
              </Button>
            </motion.div>
          ) : (filteredOrders?.length ?? 0) > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={isChangingPage ? 'opacity-60 pointer-events-none' : ''}
            >
              <OrderList orders={filteredOrders} />

              {/* Pagination */}
              {filteredOrders && filteredOrders.length >= 8 && totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {currentPage + 1} / {totalPages}
                  </p>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0 || isChangingPage}
                      aria-label="Trang trước"
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="hidden sm:flex items-center gap-1">
                      {getPageNumbers().map((pageNum, index) =>
                        pageNum === -1 ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isChangingPage}
                            aria-label={`Trang ${pageNum + 1}`}
                            aria-current={pageNum === currentPage ? 'page' : undefined}
                            className="h-8 w-8"
                          >
                            {pageNum + 1}
                          </Button>
                        ),
                      )}
                    </div>

                    <Select
                      value={currentPage.toString()}
                      onValueChange={(value) => handlePageChange(Number.parseInt(value))}
                      disabled={isChangingPage}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={currentPage + 1} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1 || isChangingPage}
                      aria-label="Trang sau"
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-12 border rounded-lg flex flex-col items-center justify-center text-center space-y-4"
            >
              <Package2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Chưa có đơn hàng nào</h3>
              <p className="text-muted-foreground max-w-md">
                Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay.
              </p>
              <Button asChild className="mt-2">
                <Link href="/products">Khám phá sản phẩm</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
