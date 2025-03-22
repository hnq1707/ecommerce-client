/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@/components/ui/badge';

import { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Filter,
  Package,
  ShoppingBag,
  AlertCircle,
  Loader2,
  ImageIcon,
  FileIcon,
  VideoIcon,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import useProducts from '@/lib/redux/features/product/useProductStore';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/type/Product';
import ProtectedRoute from '@/components/auth/protected-route';
import PermissionGuard from '@/components/auth/permission-guard';

// Import các component con
import { ProductList } from '@/components/product-page/product-list';
import { ProductFilters } from '@/components/product-page/product-filter';
import { Pagination } from '@/components/product-page/pagination';
import { ResourceUploader } from '@/components/product-page/resource-upload';
import { ProductVariants } from '@/components/product-page/product-variant';
import { ProductFormBasic } from '@/components/product-page/product-form';
import { ProductDetailView } from '@/components/product-page/product-detail-view';
import useCategories from '@/lib/redux/features/category/useCategoryStore';
import Image from 'next/image';

export default function ProductsPage() {
  // Bảo vệ toàn bộ trang - chỉ người dùng có quyền products_view mới có thể truy cập
  return (
    <ProtectedRoute requiredPermission="products_view">
      <ProductsContent />
    </ProtectedRoute>
  );
}

function ProductsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('basic');

  // Khởi tạo newProduct với đầy đủ các trường theo cấu trúc product
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    brand: '',
    rating: 0,
    categoryId: '',
    thumbnail: '',
    slug: '',
    categoryName: '',
    categoryTypeId: '',
    categoryTypeName: '',
    productVariants: [],
    resources: [],
    newArrival: false,
  });

  const { products, loading, error, getProducts, addProduct, modifyProduct, removeProduct } =
    useProducts();

  useEffect(() => {
    getProducts();
    fetchCategories();
  }, []);

  // Sử dụng hook để lấy danh sách danh mục
  const {
    categories: categoryData,
    loading: categoriesLoading,
    error: categoriesError,
    getCategories: fetchCategories,
  } = useCategories();

  // Chuyển đổi dữ liệu danh mục để sử dụng
  const categories = useMemo(() => {
    if (!categoryData) return [];
    return categoryData.map((category) => ({
      id: category.id,
      name: category.name,
      code: category.code,
      types: category.categoryTypes || [],
    }));
  }, [categoryData]);

  // Hàm tính tổng tồn kho từ các productVariants
  const getTotalStock = (product: Product) =>
    product.productVariants?.reduce(
      (total: number, variant: any) => total + variant.stockQuantity,
      0,
    ) || 0;

  // Xử lý cập nhật sản phẩm bằng cách gọi modifyProduct từ store
  const handleUpdateProduct = () => {
    if (!currentProduct) return;

    try {
      modifyProduct(currentProduct.id, currentProduct);
      setIsEditDialogOpen(false);
      toast({
        title: 'Cập nhật thành công',
        description: `Sản phẩm "${currentProduct.name}" đã được cập nhật.`,
      });

      // Reload products after updating
      getProducts();
    } catch (error) {
      toast({
        title: 'Lỗi cập nhật',
        description: 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
        variant: 'destructive',
      });
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = () => {
    if (!currentProduct) return;

    try {
      removeProduct(currentProduct.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Xóa thành công',
        description: `Sản phẩm "${currentProduct.name}" đã được xóa.`,
      });

      // Reload products after deleting
      getProducts();
    } catch (error) {
      toast({
        title: 'Lỗi xóa sản phẩm',
        description: 'Đã xảy ra lỗi khi xóa sản phẩm.',
        variant: 'destructive',
      });
    }
  };

  // Xử lý thêm sản phẩm mới bằng cách gọi addProduct từ store
  const handleAddProduct = () => {
    try {
      const { id, productVariants, resources, ...productData } = newProduct;

      // Loại bỏ `id` của từng `productVariant`
      const updatedVariants = productVariants?.map(({ id, ...variant }) => variant) || [];

      // Loại bỏ `id` của từng `resource`
      const updatedResources = resources?.map(({ id, ...resource }) => resource) || [];

      // Tạo dữ liệu cuối cùng
      const finalProductData = {
        ...productData,
        productVariants: updatedVariants,
        resources: updatedResources,
      };
      console.log(productData);
      addProduct(finalProductData);
      setIsAddDialogOpen(false);
      toast({
        title: 'Thêm thành công',
        description: `Sản phẩm "${newProduct.name}" đã được thêm vào hệ thống.`,
      });

      // Reload products after adding
      getProducts();

      // Reset form
      setNewProduct({
        id: '',
        name: '',
        description: '',
        price: 0,
        brand: '',
        rating: 0,
        categoryId: '',
        thumbnail: '',
        slug: '',
        categoryName: '',
        categoryTypeId: '',
        categoryTypeName: '',
        productVariants: [],
        resources: [],
        newArrival: false,
      });
    } catch (error) {
      toast({
        title: 'Lỗi thêm sản phẩm',
        description: 'Đã xảy ra lỗi khi thêm sản phẩm mới.',
        variant: 'destructive',
      });
    }
  };

  // Format giá tiền
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Hiển thị trạng thái sản phẩm dựa trên newArrival và tồn kho
  const getStatusBadge = (product: Product) => {
    const stock = getTotalStock(product);

    if (product.newArrival) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Mới</Badge>;
    } else if (stock <= 0) {
      return <Badge variant="destructive">Hết hàng</Badge>;
    } else if (stock < 10) {
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Sắp hết
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-emerald-500 border-emerald-500">
          Còn hàng
        </Badge>
      );
    }
  };

  // Hiển thị icon cho loại tài nguyên
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <VideoIcon className="h-4 w-4 text-red-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm, danh mục và trạng thái
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Lọc theo danh mục
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.categoryId === categoryFilter);
    }

    // Lọc theo trạng thái
    if (statusFilter) {
      switch (statusFilter) {
        case 'in-stock':
          filtered = filtered.filter((product) => getTotalStock(product) > 10);
          break;
        case 'low-stock':
          filtered = filtered.filter((product) => {
            const stock = getTotalStock(product);
            return stock > 0 && stock <= 10;
          });
          break;
        case 'out-of-stock':
          filtered = filtered.filter((product) => getTotalStock(product) <= 0);
          break;
        case 'new-arrival':
          filtered = filtered.filter((product) => product.newArrival);
          break;
      }
    }

    return filtered;
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Phân trang
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Xử lý chọn tất cả sản phẩm
  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((product) => product.id));
    }
  };

  // Xử lý chọn một sản phẩm
  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Xử lý xóa nhiều sản phẩm
  const handleBulkDelete = () => {
    try {
      selectedProducts.forEach((id) => removeProduct(id));
      toast({
        title: 'Xóa thành công',
        description: `Đã xóa ${selectedProducts.length} sản phẩm.`,
      });
      setSelectedProducts([]);

      // Reload products after bulk deletion
      getProducts();
    } catch (error) {
      toast({
        title: 'Lỗi xóa sản phẩm',
        description: 'Đã xảy ra lỗi khi xóa sản phẩm.',
        variant: 'destructive',
      });
    }
  };

  // Tạo slug tự động từ tên sản phẩm
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  // Xử lý cập nhật newProduct
  const handleNewProductChange = (partialProduct: Partial<Product>) => {
    setNewProduct((prev) => ({
      ...prev,
      ...partialProduct,
    }));
  };

  // Xử lý cập nhật currentProduct
  const handleCurrentProductChange = (partialProduct: Partial<Product>) => {
    if (!currentProduct) return;
    setCurrentProduct({
      ...currentProduct,
      ...partialProduct,
    });
  };

  // Hiển thị skeleton loading khi đang tải dữ liệu
  if (loading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-4 border-b last:border-0">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error || categoriesError) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Không thể tải dữ liệu</h3>
        <p className="text-center text-red-600 mb-4">{error || categoriesError}</p>
        <div className="flex gap-2">
          {error && (
            <Button variant="outline" onClick={() => getProducts()} className="gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Tải lại sản phẩm
            </Button>
          )}
          {categoriesError && (
            <Button variant="outline" onClick={() => fetchCategories()} className="gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Tải lại danh mục
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Hiển thị khi không có sản phẩm nào
  if (products.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
        <p className="text-center text-gray-600 mb-4">Hãy thêm sản phẩm đầu tiên vào hệ thống</p>
        <PermissionGuard
          permission="products_create"
          fallback={
            <p className="text-sm text-muted-foreground italic">
              Bạn không có quyền thêm sản phẩm mới
            </p>
          }
        >
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>Nhập thông tin để tạo sản phẩm mới</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="mt-4" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="variants">Biến thể sản phẩm</TabsTrigger>
                  <TabsTrigger value="resources">Hình ảnh & Tài nguyên</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="py-4">
                  <ProductFormBasic
                    product={newProduct}
                    onProductChange={handleNewProductChange}
                    categories={categories}
                    generateSlug={generateSlug}
                  />
                </TabsContent>

                <TabsContent value="variants" className="py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Biến thể sản phẩm</CardTitle>
                      <CardDescription>
                        Thêm các biến thể về màu sắc, kích thước và số lượng
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProductVariants
                        variants={newProduct.productVariants}
                        onVariantsChange={(variants) =>
                          handleNewProductChange({ productVariants: variants })
                        }
                        productId={newProduct.id || crypto.randomUUID()}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hình ảnh & Tài nguyên</CardTitle>
                      <CardDescription>Thêm hình ảnh và tài nguyên cho sản phẩm</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResourceUploader
                        resources={newProduct.resources}
                        onResourcesChange={(resources) => handleNewProductChange({ resources })}
                        onThumbnailChange={(thumbnail) => handleNewProductChange({ thumbnail })}
                        currentThumbnail={newProduct.thumbnail}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.slug || newProduct.price <= 0}
                >
                  Thêm sản phẩm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>
    );
  }

  // Hiển thị khi không tìm thấy sản phẩm nào sau khi lọc
  if (filteredProducts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
            <p className="text-muted-foreground">Quản lý danh sách sản phẩm trong hệ thống</p>
          </div>
          <PermissionGuard
            permission="products_create"
            fallback={
              <Button variant="outline" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            }
          >
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </PermissionGuard>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categories={categories}
        />

        <div className="mt-12 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-center text-gray-600 mb-4">
            Không có sản phẩm nào phù hợp với bộ lọc hiện tại
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Dialog Thêm sản phẩm */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          {selectedProducts.length > 0 && (
            <PermissionGuard permission="products_delete">
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa ({selectedProducts.length})
              </Button>
            </PermissionGuard>
          )}
          <PermissionGuard
            permission="products_create"
            fallback={
              <Button variant="outline" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            }
          >
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sản phẩm
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                  <DialogDescription>Nhập thông tin để tạo sản phẩm mới</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="mt-4" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                    <TabsTrigger value="variants">Biến thể sản phẩm</TabsTrigger>
                    <TabsTrigger value="resources">Hình ảnh & Tài nguyên</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="py-4">
                    <ProductFormBasic
                      product={newProduct}
                      onProductChange={handleNewProductChange}
                      categories={categories}
                      generateSlug={generateSlug}
                    />
                  </TabsContent>

                  <TabsContent value="variants" className="py-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Biến thể sản phẩm</CardTitle>
                        <CardDescription>
                          Thêm các biến thể về màu sắc, kích thước và số lượng
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ProductVariants
                          variants={newProduct.productVariants}
                          onVariantsChange={(variants) =>
                            handleNewProductChange({ productVariants: variants })
                          }
                          productId={newProduct.id || crypto.randomUUID()}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="py-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Hình ảnh & Tài nguyên</CardTitle>
                        <CardDescription>Thêm hình ảnh và tài nguyên cho sản phẩm</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResourceUploader
                          resources={newProduct.resources}
                          onResourcesChange={(resources) => handleNewProductChange({ resources })}
                          onThumbnailChange={(thumbnail) => handleNewProductChange({ thumbnail })}
                          currentThumbnail={newProduct.thumbnail}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    disabled={!newProduct.name || !newProduct.slug || newProduct.price <= 0}
                  >
                    Thêm sản phẩm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      {/* Search & Filter */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categories={categories}
      />

      {/* Thông tin số lượng sản phẩm */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
          {searchTerm && ` (đang tìm kiếm: "${searchTerm}")`}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="items-per-page">Hiển thị:</Label>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <ProductList
        products={paginatedProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
        onViewProduct={(product) => {
          // Make sure we have the complete product data with resources
          const fullProduct = products.find((p) => p.id === product.id) || product;
          setCurrentProduct(fullProduct);
          setIsViewDialogOpen(true);
        }}
        onEditProduct={(product) => {
          // Make sure we have the complete product data with resources
          const fullProduct = products.find((p) => p.id === product.id) || product;
          console.log('Sản phẩm đầy đủ:', fullProduct);
          console.log('Resources:', fullProduct.resources);
          setCurrentProduct(fullProduct);
          setIsEditDialogOpen(true);
        }}
        onDeleteProduct={(product) => {
          // Make sure we have the complete product data with resources
          const fullProduct = products.find((p) => p.id === product.id) || product;
          setCurrentProduct(fullProduct);
          setIsDeleteDialogOpen(true);
        }}
        formatCurrency={formatCurrency}
        getTotalStock={getTotalStock}
        getStatusBadge={getStatusBadge}
        canEdit={(product) => true} // Thay bằng kiểm tra quyền thực tế
        canDelete={(product) => true} // Thay bằng kiểm tra quyền thực tế
      />

      {/* Phân trang */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Dialog Xem chi tiết sản phẩm */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            <DialogDescription>Thông tin chi tiết về sản phẩm</DialogDescription>
          </DialogHeader>

          {currentProduct && (
            <ProductDetailView
              product={currentProduct}
              formatCurrency={formatCurrency}
              getTotalStock={getTotalStock}
              getStatusBadge={getStatusBadge}
              getResourceIcon={getResourceIcon}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
            <PermissionGuard permission="products_edit">
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </PermissionGuard>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Chỉnh sửa sản phẩm */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (open && currentProduct) {
            // Đảm bảo resources được khởi tạo đúng cách
            if (!currentProduct.resources) {
              setCurrentProduct({
                ...currentProduct,
                resources: [],
              });
            }
          }
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>

          {currentProduct && (
            <Tabs defaultValue="basic" className="mt-4" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="variants">Biến thể sản phẩm</TabsTrigger>
                <TabsTrigger value="resources">Hình ảnh & Tài nguyên</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="py-4">
                <ProductFormBasic
                  product={currentProduct}
                  onProductChange={handleCurrentProductChange}
                  categories={categories}
                  generateSlug={generateSlug}
                />
              </TabsContent>

              <TabsContent value="variants" className="py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Biến thể sản phẩm</CardTitle>
                    <CardDescription>
                      Quản lý các biến thể về màu sắc, kích thước và số lượng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductVariants
                      variants={currentProduct.productVariants}
                      onVariantsChange={(variants) =>
                        handleCurrentProductChange({ productVariants: variants })
                      }
                      productId={currentProduct.id}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hình ảnh & Tài nguyên</CardTitle>
                    <CardDescription>Quản lý hình ảnh và tài nguyên cho sản phẩm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentProduct && (
                      <>
                        {console.log('Resources trong tab:', currentProduct.resources)}
                        <ResourceUploader
                          resources={currentProduct.resources || []}
                          onResourcesChange={(resources) =>
                            handleCurrentProductChange({ resources })
                          }
                          onThumbnailChange={(thumbnail) =>
                            handleCurrentProductChange({ thumbnail })
                          }
                          currentThumbnail={currentProduct.thumbnail}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateProduct}
              disabled={
                !currentProduct?.name || !currentProduct?.slug || currentProduct?.price <= 0
              }
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác nhận xóa sản phẩm */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="flex items-center gap-4 p-4 border rounded-md my-4">
              <Image
                src={currentProduct.thumbnail || '/placeholder.svg?height=50&width=50'}
                alt={currentProduct.name}
                className="h-12 w-12 rounded-md object-cover"
                width={50}
                height={50}
              />
              <div>
                <p className="font-medium">{currentProduct.name}</p>
                <p className="text-sm text-muted-foreground">{currentProduct.categoryName}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
