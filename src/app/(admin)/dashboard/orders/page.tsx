'use client';

import { useState, useEffect, JSX } from 'react';
import {
  Search,
  Eye,
  Download,
  MoreHorizontal,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useOrder } from '@/lib/redux/features/order/useOrder';
import type { Order } from '@/lib/type/Order';
import type { Product } from '@/lib/type/Product';
import { exportInvoicePDF } from '@/lib/utils/extract_pdf';
import ProtectedRoute from '@/components/auth/protected-route';
import PermissionGuard from '@/components/auth/permission-guard';

export default function OrdersPage() {
  // Bảo vệ toàn bộ trang - chỉ người dùng có quyền orders_view mới có thể truy cập
  return (
    <ProtectedRoute requiredPermission="orders_view">
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  // Sử dụng hook useOrder, bao gồm hàm updateStatus để cập nhật trạng thái đơn hàng qua Redux
  const { orders, loading, error, fetchAllOrders, updateStatus } = useOrder();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<keyof Order | 'customerName'>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof Order | 'customerName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Gọi API lấy đơn hàng khi component được mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Lọc đơn hàng theo từ khóa tìm kiếm và bộ lọc
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase());

      // Lọc theo ngày (so sánh ngày)
      const matchesDate = dateFilter
        ? new Date(order.orderDate).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true;

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      let valueA, valueB;
      if (sortField === 'customerName') {
        valueA = a.address.name.toLowerCase();
        valueB = b.address.name.toLowerCase();
      } else if (sortField === 'orderDate') {
        valueA = new Date(a.orderDate).getTime();
        valueB = new Date(b.orderDate).getTime();
      } else if (sortField === 'totalPrice') {
        valueA = a.totalPrice;
        valueB = b.totalPrice;
      } else if (sortField === 'totalAmount') {
        valueA = a.totalAmount;
        valueB = b.totalAmount;
      } else {
        valueA = String(a[sortField]).toLowerCase();
        valueB = String(b[sortField]).toLowerCase();
      }
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const paginatedOrders = (orders: Order[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return orders.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPagesCalc = (orders: Order[]) => Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getSortIcon = (field: keyof Order | 'customerName') => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Format giá tiền
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format ngày giờ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Hiển thị trạng thái đơn hàng
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Package className="mr-1 h-3 w-3" />
            Chờ xử lý
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đã xác nhận
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge className="bg-indigo-500 hover:bg-indigo-600">
            <Truck className="mr-1 h-3 w-3" />
            Đang giao hàng
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đã giao hàng
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="mr-1 h-3 w-3" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Xử lý cập nhật trạng thái đơn hàng bằng cách gọi updateStatus từ hook useOrder
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    updateStatus(orderId, newStatus);
    fetchAllOrders();
  };

  // Xuất hóa đơn
  const handleExportInvoice = (order: Order) => {
    console.log('Xuất hóa đơn cho đơn hàng:', order.id);
    exportInvoicePDF(order);
  };

  // Lấy ảnh chính của sản phẩm
  const getProductImage = (product: Product) => {
    const primaryImage = product.resources.find((res) => res.isPrimary);
    return primaryImage ? primaryImage.url : '/placeholder.svg?height=50&width=50';
  };

  // Tính tổng số lượng sản phẩm trong đơn hàng
  const getTotalItems = (order: Order) => {
    return order.orderItemList.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">Quản lý và xử lý đơn đặt hàng của khách hàng</p>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Badge className="bg-yellow-500">
              {orders.filter((o) => o.orderStatus === 'PENDING').length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                orders
                  .filter((o) => o.orderStatus === 'PENDING')
                  .reduce((sum, order) => sum + order.totalPrice, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang giao</CardTitle>
            <Badge className="bg-indigo-500">
              {orders.filter((o) => o.orderStatus === 'SHIPPED').length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                orders
                  .filter((o) => o.orderStatus === 'SHIPPED')
                  .reduce((sum, order) => sum + order.totalPrice, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
            <Badge className="bg-green-500">
              {orders.filter((o) => o.orderStatus === 'DELIVERED').length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                orders
                  .filter((o) => o.orderStatus === 'DELIVERED')
                  .reduce((sum, order) => sum + order.totalPrice, 0),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả đơn hàng</TabsTrigger>
          <TabsTrigger value="PENDING">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="SHIPPED">Đang giao hàng</TabsTrigger>
          <TabsTrigger value="DELIVERED">Đã giao hàng</TabsTrigger>
          <TabsTrigger value="CANCELLED">Đã hủy</TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="w-[180px]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <OrderTable
            orders={paginatedOrders(filteredOrders)}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            onViewOrder={(order: Order) => {
              setCurrentOrder(order);
              setIsViewDialogOpen(true);
            }}
            onUpdateStatus={handleUpdateOrderStatus}
            onExportInvoice={handleExportInvoice}
            getTotalItems={getTotalItems}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            getSortIcon={getSortIcon}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPagesCalc(filteredOrders)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalItems={filteredOrders.length}
          />
        </TabsContent>

        {['PENDING', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => {
          const statusOrders = filteredOrders.filter((o) => o.orderStatus === status);
          return (
            <TabsContent key={status} value={status} className="mt-4">
              <OrderTable
                orders={paginatedOrders(statusOrders)}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                onViewOrder={(order: Order) => {
                  setCurrentOrder(order);
                  setIsViewDialogOpen(true);
                }}
                onUpdateStatus={handleUpdateOrderStatus}
                onExportInvoice={handleExportInvoice}
                getTotalItems={getTotalItems}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                getSortIcon={getSortIcon}
              />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPagesCalc(statusOrders)}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalItems={statusOrders.length}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn hàng</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Đơn hàng #{currentOrder.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ngày đặt: {formatDate(currentOrder.orderDate)}
                  </p>
                  <div className="mt-2">{getStatusBadge(currentOrder.orderStatus)}</div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium">Tổng giá trị đơn hàng</p>
                  <p className="text-xl font-bold">{formatCurrency(currentOrder.totalPrice)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                  <p className="text-sm">{currentOrder.address.name}</p>
                  <p className="text-sm">SĐT: {currentOrder.address.phoneNumber}</p>
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-1">Phương thức thanh toán</h4>
                    <Badge variant="outline" className="font-normal">
                      {currentOrder.paymentMethod === 'COD'
                        ? 'Thanh toán khi nhận hàng'
                        : 'Chuyển khoản ngân hàng'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Địa chỉ giao hàng</h3>
                  <p className="text-sm">{currentOrder.address.name}</p>
                  <p className="text-sm">{currentOrder.address.street}</p>
                  <p className="text-sm">
                    {currentOrder.address.district}, {currentOrder.address.city}{' '}
                    {currentOrder.address.zipCode}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-1">Thông tin vận chuyển</h4>
                    <p className="text-sm">
                      Mã vận đơn: <span className="font-medium">{currentOrder.shipmentNumber}</span>
                    </p>
                    <p className="text-sm">
                      Dự kiến giao: {formatDate(currentOrder.expectedDeliveryDate)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">
                  Sản phẩm ({currentOrder.totalAmount} sản phẩm)
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.orderItemList.map((item) => {
                        const variant = item.product.productVariants.find(
                          (v) => v.id === item.productVariantId,
                        );
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={getProductImage(item.product) || '/placeholder.svg'}
                                  alt={item.product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.product.brand}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {variant ? (
                                <div className="text-sm">
                                  <span className="inline-flex items-center gap-1">
                                    <span
                                      className="w-3 h-3 rounded-full inline-block"
                                      style={{
                                        backgroundColor:
                                          variant.color.toLowerCase() === 'trắng'
                                            ? '#f8fafc'
                                            : variant.color.toLowerCase() === 'đen'
                                            ? '#000'
                                            : variant.color.toLowerCase() === 'đỏ'
                                            ? '#ef4444'
                                            : variant.color.toLowerCase() === 'xanh'
                                            ? '#3b82f6'
                                            : variant.color.toLowerCase() === 'xanh đen'
                                            ? '#1e3a8a'
                                            : variant.color.toLowerCase() === 'nâu'
                                            ? '#92400e'
                                            : '#ddd',
                                      }}
                                    ></span>
                                    {variant.color}
                                  </span>
                                  {variant.size !== 'N/A' && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                                      {variant.size}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">Mặc định</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.itemPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.itemPrice * item.quantity)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          Tổng cộng
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(currentOrder.totalPrice)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Cập nhật trạng thái</h3>
                  <PermissionGuard permission="orders_edit">
                    <Select
                      value={currentOrder.orderStatus}
                      onValueChange={(value: Order['orderStatus']) =>
                        handleUpdateOrderStatus(currentOrder.id, value)
                      }
                    >
                      <SelectTrigger className="w-[200px] mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                        <SelectItem value="IN_PROGRESS">Đã xác nhận</SelectItem>
                        <SelectItem value="SHIPPED">Đang giao hàng</SelectItem>
                        <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </PermissionGuard>
                </div>
                <PermissionGuard permission="orders_export">
                  <Button onClick={() => handleExportInvoice(currentOrder)}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất hóa đơn
                  </Button>
                </PermissionGuard>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-muted-foreground">
        Hiển thị {totalItems > 0 ? startItem : 0}-{endItem} trên tổng số {totalItems} đơn hàng
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Hiển thị:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              onPageChange(1); // Reset trang khi thay đổi số lượng item mỗi trang
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Trang đầu</span>
            <span aria-hidden="true">«</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Trang trước</span>
            <span aria-hidden="true">‹</span>
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(pageNum)}
              >
                <span className="sr-only">Trang {pageNum}</span>
                <span aria-hidden="true">{pageNum}</span>
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Trang sau</span>
            <span aria-hidden="true">›</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Trang cuối</span>
            <span aria-hidden="true">»</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderTable({
  orders,
  formatCurrency,
  formatDate,
  getStatusBadge,
  onViewOrder,
  onUpdateStatus,
  onExportInvoice,
  getTotalItems,

  onSort,
  getSortIcon,
}: {
  orders: Order[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, newStatus: Order['orderStatus']) => void;
  onExportInvoice: (order: Order) => void;
  getTotalItems: (order: Order) => number;
  sortField: keyof Order | 'customerName';
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Order | 'customerName') => void;
  getSortIcon: (field: keyof Order | 'customerName') => JSX.Element;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => onSort('id')}>
              <div className="flex items-center">
                Mã đơn hàng
                {getSortIcon('id')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('customerName')}>
              <div className="flex items-center">
                Khách hàng
                {getSortIcon('customerName')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('orderDate')}>
              <div className="flex items-center">
                Ngày đặt
                {getSortIcon('orderDate')}
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => onSort('totalAmount')}>
              <div className="flex items-center justify-center">
                Số SP
                {getSortIcon('totalAmount')}
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => onSort('totalPrice')}>
              <div className="flex items-center justify-end">
                Tổng tiền
                {getSortIcon('totalPrice')}
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => onSort('orderStatus')}>
              <div className="flex items-center justify-center">
                Trạng thái
                {getSortIcon('orderStatus')}
              </div>
            </TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p>{order.address.name}</p>
                    <p className="text-sm text-muted-foreground">{order.address.phoneNumber}</p>
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell className="text-center">{getTotalItems(order)}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell className="text-center">{getStatusBadge(order.orderStatus)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewOrder(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <PermissionGuard permission="orders_export">
                        <DropdownMenuItem onClick={() => onExportInvoice(order)}>
                          <Download className="mr-2 h-4 w-4" />
                          Xuất hóa đơn
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <DropdownMenuSeparator />
                      <PermissionGuard permission="orders_edit">
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'IN_PROGRESS')}>
                          Xác nhận đơn hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'SHIPPED')}>
                          Chuyển sang đang giao
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'DELIVERED')}>
                          Đánh dấu đã giao
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                        >
                          Hủy đơn hàng
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
