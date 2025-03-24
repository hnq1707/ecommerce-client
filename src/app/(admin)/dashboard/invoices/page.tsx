/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Search, Download, MoreHorizontal, FileText, Printer, Mail } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useInvoices from '@/lib/redux/features/invoice/useInvoice';

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // statusFilter: '', 'paid' hoặc 'pending'
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);

  // Lấy dữ liệu từ Redux thông qua custom hook
  const { invoices, loading, getInvoices } = useInvoices();

  // Hàm xử lý tìm kiếm, thay đổi bộ lọc theo trạng thái
  const handleSearch = () => {
    const filter: 'all' | 'paid' | 'unpaid' =
      statusFilter === 'paid' ? 'paid' : statusFilter === 'pending' ? 'unpaid' : 'all';
    getInvoices(0, 10, filter);
  };

  useEffect(() => {
    getInvoices(0, 10, 'all');
  }, []);

  // Hàm định dạng Address thành chuỗi hiển thị
  const formatAddress = (address: any) => {
    if (!address) return '';
    // Ví dụ: hiển thị tên, đường và thành phố
    return `${address.name}, ${address.street}, ${address.city}`;
  };

  // Lọc dữ liệu dựa theo từ khóa và ngày
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatAddress(invoice.billingAddress).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter
      ? statusFilter === 'true'
        ? invoice.isPaid === true
        : statusFilter === 'false'
        ? invoice.isPaid === false
        : true
      : true;

    const matchesDate = dateFilter
      ? new Date(invoice.issuedDate).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Format giá tiền
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format ngày sử dụng issuedDate hoặc các ngày khác
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Hiển thị trạng thái hóa đơn dựa trên trường isPaid
  const getStatusBadge = (isPaid: boolean) => {
    return !isPaid ? (
      <Badge className="bg-green-500">Đã thanh toán</Badge>
    ) : (
      <Badge className="bg-yellow-500">Chờ thanh toán</Badge>
    );
  };

  // Các hàm thao tác khác (xuất, in, gửi email)
  const handleExportInvoice = (invoice: any) => {
    console.log('Xuất hóa đơn:', invoice.id);
    // Gọi API tạo và tải PDF thực tế ở đây
  };

  const handlePrintInvoice = (invoice: any) => {
    console.log('In hóa đơn:', invoice.id);
    // Mở cửa sổ in thực tế ở đây
  };

  const handleSendInvoice = (invoice: any) => {
    console.log('Gửi hóa đơn qua email:', invoice.id);
    // Gọi API gửi email thực tế ở đây
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý hóa đơn</h1>
        <p className="text-muted-foreground">Quản lý và xuất hóa đơn cho đơn hàng</p>
      </div>

      {/* Thông tin tổng hợp */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <Badge className="bg-green-500">{invoices.filter((i) => !i.isPaid).length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices
                  .filter((i) => !i.isPaid)
                  .reduce((sum, invoice) => sum + invoice.totalPrice, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
            <Badge className="bg-yellow-500">{invoices.filter((i) => i.isPaid).length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices
                  .filter((i) => i.isPaid)
                  .reduce((sum, invoice) => sum + invoice.totalPrice, 0),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phần tìm kiếm và lọc */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm hóa đơn..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đã thanh toán</option>
            <option value="false">Chờ thanh toán</option>
          </select>
          <div className="flex items-center">
            <Input
              type="date"
              className="w-[180px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>
      </div>

      {/* Bảng danh sách hóa đơn */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Địa chỉ thanh toán</TableHead>
              <TableHead>Ngày phát hành</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Không tìm thấy hóa đơn nào</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{formatAddress(invoice.billingAddress)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(invoice.issuedDate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.totalPrice)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(invoice.isPaid)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentInvoice(invoice);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleExportInvoice(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrintInvoice(invoice)}>
                          <Printer className="mr-2 h-4 w-4" />
                          In hóa đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Gửi qua email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog xem chi tiết hóa đơn */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn</DialogTitle>
            <DialogDescription>Thông tin chi tiết về hóa đơn</DialogDescription>
          </DialogHeader>
          {currentInvoice && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Hóa đơn #{currentInvoice.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Mã đơn hàng: {currentInvoice.order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ngày đặt hàng: {formatDate(currentInvoice.order.orderDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trạng thái đơn hàng: {currentInvoice.order.orderStatus}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phương thức thanh toán: {currentInvoice.order.paymentMethod}
                  </p>
                  <div className="mt-2">{getStatusBadge(currentInvoice.isPaid)}</div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium">Tổng giá trị hóa đơn</p>
                  <p className="text-xl font-bold">{formatCurrency(currentInvoice.totalPrice)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                  <p className="text-sm">{formatAddress(currentInvoice.billingAddress)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                  <p className="text-sm">
                    Ngày giao hàng dự kiến: {formatDate(currentInvoice.order.expectedDeliveryDate)}
                  </p>
                  <p className="text-sm">Giảm giá: {currentInvoice.order.discount}</p>
                  <p className="text-sm">
                    Tình trạng thanh toán: {currentInvoice.order.payment?.paymentStatus}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Sản phẩm</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentInvoice.order.orderItemList?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.productVariantId}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.itemPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.itemPrice * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handlePrintInvoice(currentInvoice)}>
                  <Printer className="mr-2 h-4 w-4" />
                  In hóa đơn
                </Button>
                <Button onClick={() => handleExportInvoice(currentInvoice)}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống PDF
                </Button>
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
