/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Package } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dữ liệu mẫu cho sản phẩm
const initialProducts = [
  {
    id: 1,
    name: 'Áo thun nam cổ tròn',
    sku: 'AT-NAM-001',
    price: 250000,
    stock: 45,
    category: 'Quần áo nam',
    status: 'in-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 2,
    name: 'Áo sơ mi nữ dài tay',
    sku: 'ASM-NU-002',
    price: 350000,
    stock: 32,
    category: 'Quần áo nữ',
    status: 'in-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 3,
    name: 'Quần jean nam slim fit',
    sku: 'QJ-NAM-003',
    price: 450000,
    stock: 28,
    category: 'Quần áo nam',
    status: 'in-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 4,
    name: 'Váy liền thân nữ',
    sku: 'V-NU-004',
    price: 550000,
    stock: 15,
    category: 'Quần áo nữ',
    status: 'low-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 5,
    name: 'Giày thể thao nam',
    sku: 'G-NAM-005',
    price: 850000,
    stock: 20,
    category: 'Giày dép nam',
    status: 'in-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 6,
    name: 'Túi xách nữ da cao cấp',
    sku: 'TX-NU-006',
    price: 1250000,
    stock: 8,
    category: 'Túi xách',
    status: 'low-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 7,
    name: 'Đồng hồ nam dây da',
    sku: 'DH-NAM-007',
    price: 1850000,
    stock: 12,
    category: 'Đồng hồ',
    status: 'in-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 8,
    name: 'Nước hoa nữ Chanel',
    sku: 'NH-NU-008',
    price: 2500000,
    stock: 0,
    category: 'Nước hoa',
    status: 'out-of-stock',
    image: '/placeholder.svg?height=50&width=50',
  },
];

// Danh sách danh mục
const categories = [
  'Quần áo nam',
  'Quần áo nữ',
  'Giày dép nam',
  'Giày dép nữ',
  'Túi xách',
  'Đồng hồ',
  'Nước hoa',
  'Phụ kiện',
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'in-stock',
    image: '/placeholder.svg?height=50&width=50',
  });

  // Lọc sản phẩm theo từ khóa tìm kiếm và bộ lọc
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesStatus = statusFilter ? product.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Xử lý thêm sản phẩm mới
  const handleAddProduct = () => {
    const id = Math.max(...products.map((p) => p.id)) + 1;
    setProducts([...products, { ...newProduct, id }]);
    setNewProduct({
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      category: '',
      status: 'in-stock',
      image: '/placeholder.svg?height=50&width=50',
    });
    setIsAddDialogOpen(false);
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = () => {
    if (!currentProduct) return;

    setProducts(
      products.map((product) => (product.id === currentProduct.id ? currentProduct : product)),
    );
    setIsEditDialogOpen(false);
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = () => {
    if (!currentProduct) return;

    setProducts(products.filter((product) => product.id !== currentProduct.id));
    setIsDeleteDialogOpen(false);
  };

  // Format giá tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Hiển thị trạng thái sản phẩm
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-500">Còn hàng</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-500">Sắp hết</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500">Hết hàng</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm trong hệ thống</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo sản phẩm mới</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">Mã SKU</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="VD: SP-001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Giá bán</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Số lượng tồn kho</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={newProduct.status}
                  onValueChange={(value) => setNewProduct({ ...newProduct, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">Còn hàng</SelectItem>
                    <SelectItem value="low-stock">Sắp hết</SelectItem>
                    <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea id="description" placeholder="Nhập mô tả sản phẩm" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddProduct}>Thêm sản phẩm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="in-stock">Còn hàng</SelectItem>
              <SelectItem value="low-stock">Sắp hết</SelectItem>
              <SelectItem value="out-of-stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Giá bán</TableHead>
              <TableHead className="text-center">Tồn kho</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(product.status)}</TableCell>
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
                            setCurrentProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setCurrentProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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

      {/* Dialog chỉnh sửa sản phẩm */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Tên sản phẩm</Label>
                <Input
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sku">Mã SKU</Label>
                <Input
                  id="edit-sku"
                  value={currentProduct.sku}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Giá bán</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Số lượng tồn kho</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={currentProduct.stock}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Danh mục</Label>
                <Select
                  value={currentProduct.category}
                  onValueChange={(value) =>
                    setCurrentProduct({ ...currentProduct, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select
                  value={currentProduct.status}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">Còn hàng</SelectItem>
                    <SelectItem value="low-stock">Sắp hết</SelectItem>
                    <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="edit-description">Mô tả sản phẩm</Label>
                <Textarea id="edit-description" placeholder="Nhập mô tả sản phẩm" rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateProduct}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa sản phẩm */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Xóa sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
