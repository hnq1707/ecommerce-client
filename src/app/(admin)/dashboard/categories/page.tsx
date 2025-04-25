/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Layers,
  AlertCircle,
  Loader2,
  X,
  Info,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import useCategories from '@/lib/redux/features/category/useCategoryStore';
import type { Category } from '@/lib/types/Category';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CategoryType } from '@/lib/types/Category';
import ProtectedRoute from '@/components/auth/protected-route';
import PermissionGuard from '@/components/auth/permission-guard';

export default function CategoriesPage() {
  // Bảo vệ toàn bộ trang - chỉ người dùng có quyền categories_view mới có thể truy cập
  return (
    <ProtectedRoute requiredPermission="categories_view">
      <CategoriesContent />
    </ProtectedRoute>
  );
}

function CategoriesContent() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [newCategory, setNewCategory] = useState<Category>({
    id: '',
    name: '',
    code: '',
    description: '',
    categoryTypes: [],
  });
  const [isViewTypesDialogOpen, setIsViewTypesDialogOpen] = useState(false);

  // Sử dụng hook để lấy danh sách danh mục
  const { categories, loading, error, getCategories, addCategory, modifyCategory, removeCategory } =
    useCategories();

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Ctrl/Cmd + N to add new category
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsAddDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tạo slug tự động từ tên danh mục
  const generateCode = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  // Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(
    (category) =>
      (typeof category.name === 'string' &&
        category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof category.code === 'string' &&
        category.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof category.description === 'string' &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Xử lý thêm danh mục mới
  const handleAddCategory = () => {
    try {
      addCategory(newCategory);
      setNewCategory({
        id: '',
        name: '',
        code: '',
        description: '',
        categoryTypes: [],
      });
      setIsAddDialogOpen(false);
      toast({
        title: 'Thêm thành công',
        description: `Danh mục "${newCategory.name}" đã được thêm vào hệ thống.`,
      });

      // Reload categories after adding
      getCategories();
    } catch (error) {
      toast({
        title: 'Lỗi thêm danh mục',
        description: 'Đã xảy ra lỗi khi thêm danh mục mới.',
        variant: 'destructive',
      });
    }
  };

  // Xử lý cập nhật danh mục
  const handleUpdateCategory = () => {
    if (!currentCategory) return;

    try {
      modifyCategory(currentCategory.id, currentCategory);
      setIsEditDialogOpen(false);
      toast({
        title: 'Cập nhật thành công',
        description: `Danh mục "${currentCategory.name}" đã được cập nhật.`,
      });

      // Reload categories after updating
      getCategories();
    } catch (error) {
      toast({
        title: 'Lỗi cập nhật',
        description: 'Đã xảy ra lỗi khi cập nhật danh mục.',
        variant: 'destructive',
      });
    }
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = () => {
    if (!currentCategory) return;

    try {
      removeCategory(currentCategory.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Xóa thành công',
        description: `Danh mục "${currentCategory.name}" đã được xóa.`,
      });

      // Reload categories after deleting
      getCategories();
    } catch (error) {
      toast({
        title: 'Lỗi xóa danh mục',
        description: 'Đã xảy ra lỗi khi xóa danh mục.',
        variant: 'destructive',
      });
    }
  };

  // Hiển thị skeleton loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-10 w-32 ml-2" />
            </div>

            <div className="rounded-md border">
              <div className="p-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 py-4 border-b last:border-0"
                    >
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-5 w-40 flex-1" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Không thể tải dữ liệu</h3>
        <p className="text-center text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => getCategories()} className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Tải lại danh mục
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách danh mục sản phẩm trong hệ thống
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Chỉ hiển thị nút thêm danh mục nếu người dùng có quyền categories_create */}
              <PermissionGuard
                permission="categories_create"
                fallback={
                  <Button variant="outline" disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm danh mục
                  </Button>
                }
              >
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm danh mục
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Thêm danh mục mới</DialogTitle>
                      <DialogDescription>
                        Nhập thông tin để tạo danh mục sản phẩm mới
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="name">Tên danh mục</Label>
                              <span className="text-xs text-muted-foreground">
                                {newCategory.name.length}/50
                              </span>
                            </div>
                            <Input
                              id="name"
                              value={newCategory.name}
                              onChange={(e) => {
                                const name = e.target.value.slice(0, 50);
                                setNewCategory({
                                  ...newCategory,
                                  name,
                                  code: generateCode(name),
                                });
                              }}
                              placeholder="Nhập tên danh mục"
                              className={
                                newCategory.name.length > 0 && newCategory.name.length < 3
                                  ? 'border-red-500 focus-visible:ring-red-500'
                                  : ''
                              }
                            />
                            {newCategory.name.length > 0 && newCategory.name.length < 3 && (
                              <p className="text-xs text-red-500">
                                Tên danh mục phải có ít nhất 3 ký tự
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="code">Mã danh mục</Label>
                            <Input
                              id="code"
                              value={newCategory.code}
                              onChange={(e) =>
                                setNewCategory({ ...newCategory, code: e.target.value })
                              }
                              placeholder="nhap-ma-danh-muc"
                              className={
                                newCategory.code.length > 0 && newCategory.code.length < 3
                                  ? 'border-red-500 focus-visible:ring-red-500'
                                  : ''
                              }
                            />
                            {newCategory.code.length > 0 && newCategory.code.length < 3 && (
                              <p className="text-xs text-red-500">
                                Mã danh mục phải có ít nhất 3 ký tự
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                              id="description"
                              value={newCategory.description || ''}
                              onChange={(e) =>
                                setNewCategory({ ...newCategory, description: e.target.value })
                              }
                              placeholder="Mô tả ngắn về danh mục (không bắt buộc)"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Loại danh mục</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Add a new empty category types
                                const newType: CategoryType = {
                                  id: `temp-${Date.now()}`, // Temporary ID until saved
                                  name: '',
                                  code: '',
                                  description: '',
                                };

                                setNewCategory({
                                  ...newCategory,
                                  categoryTypes: [...(newCategory.categoryTypes || []), newType],
                                });
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Thêm loại
                            </Button>
                          </div>

                          <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
                            {newCategory.categoryTypes?.length ? (
                              <div className="divide-y">
                                {newCategory.categoryTypes.map(
                                  (type: CategoryType, index: number) => (
                                    <div
                                      key={type.id}
                                      className="p-3 bg-background hover:bg-muted/50"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-sm">
                                          {type.name || 'Loại mới'}
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => {
                                            // Remove this category types
                                            const updatedTypes = [
                                              ...(newCategory.categoryTypes || []),
                                            ];
                                            updatedTypes.splice(index, 1);
                                            setNewCategory({
                                              ...newCategory,
                                              categoryTypes: updatedTypes,
                                            });
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <div className="grid gap-2 mb-2">
                                        <div className="flex gap-2">
                                          <Input
                                            placeholder="Tên loại"
                                            value={type.name}
                                            onChange={(e) => {
                                              const updatedTypes = [
                                                ...(newCategory.categoryTypes || []),
                                              ];
                                              updatedTypes[index] = {
                                                ...type,
                                                name: e.target.value,
                                                code: type.code || generateCode(e.target.value),
                                              };
                                              setNewCategory({
                                                ...newCategory,
                                                categoryTypes: updatedTypes,
                                              });
                                            }}
                                            className="text-sm"
                                          />
                                          <Input
                                            placeholder="Mã loại"
                                            value={type.code}
                                            onChange={(e) => {
                                              const updatedTypes = [
                                                ...(newCategory.categoryTypes || []),
                                              ];
                                              updatedTypes[index] = {
                                                ...type,
                                                code: e.target.value,
                                              };
                                              setNewCategory({
                                                ...newCategory,
                                                categoryTypes: updatedTypes,
                                              });
                                            }}
                                            className="text-sm"
                                          />
                                        </div>
                                        <Textarea
                                          placeholder="Mô tả loại (không bắt buộc)"
                                          value={type.description || ''}
                                          onChange={(e) => {
                                            const updatedTypes = [
                                              ...(newCategory.categoryTypes || []),
                                            ];
                                            updatedTypes[index] = {
                                              ...type,
                                              description: e.target.value,
                                            };
                                            setNewCategory({
                                              ...newCategory,
                                              categoryTypes: updatedTypes,
                                            });
                                          }}
                                          className="text-sm"
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-6 bg-muted/30">
                                <Layers className="h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Chưa có loại danh mục nào
                                </p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="mt-1"
                                  onClick={() => {
                                    // Add a new empty category types
                                    const newType: CategoryType = {
                                      id: `temp-${Date.now()}`, // Temporary ID until saved
                                      name: '',
                                      code: '',
                                      description: '',
                                    };

                                    setNewCategory({
                                      ...newCategory,
                                      categoryTypes: [
                                        ...(newCategory.categoryTypes || []),
                                        newType,
                                      ],
                                    });
                                  }}
                                >
                                  Thêm loại mới
                                </Button>
                              </div>
                            )}
                          </div>

                          {newCategory.categoryTypes?.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {newCategory.categoryTypes.length} loại danh mục
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button
                        onClick={handleAddCategory}
                        disabled={
                          !newCategory.name ||
                          !newCategory.code ||
                          newCategory.name.length < 3 ||
                          newCategory.code.length < 3 ||
                          newCategory.categoryTypes?.some(
                            (type) =>
                              !type.name ||
                              !type.code ||
                              type.name.length < 2 ||
                              type.code.length < 2,
                          )
                        }
                      >
                        Thêm danh mục
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Thêm danh mục mới (Ctrl+N)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Tổng cộng {categories.length} danh mục, hiển thị {filteredCategories.length} kết quả
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm danh mục..."
                className="pl-8 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Xóa tìm kiếm</span>
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hidden sm:inline-block">
                      Ctrl+F
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nhấn Ctrl+F để tìm kiếm nhanh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mã danh mục</TableHead>
                  <TableHead className="text-center">Số loại</TableHead>
                  <TableHead className="text-center">Loại danh mục</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <Layers className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground">Không tìm thấy danh mục nào</p>
                      {searchTerm && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchTerm('');
                          }}
                          className="mt-2"
                        >
                          Xóa bộ lọc
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">{category.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{category.code}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {category.categoryTypes?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setCurrentCategory(category);
                            setIsViewTypesDialogOpen(true);
                          }}
                          disabled={!category.categoryTypes?.length}
                        >
                          <Layers className="mr-1 h-3 w-3" />
                          Xem {category.categoryTypes?.length || 0} loại
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {/* Chỉ hiển thị nút chỉnh sửa nếu người dùng có quyền categories_edit */}
                                <PermissionGuard permission="categories_edit">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      setCurrentCategory(category);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Chỉnh sửa</span>
                                  </Button>
                                </PermissionGuard>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Chỉnh sửa danh mục</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Chỉ hiển thị tùy chọn chỉnh sửa nếu người dùng có quyền categories_edit */}
                              <PermissionGuard permission="categories_edit">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentCategory(category);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              {/* Chỉ hiển thị tùy chọn xóa nếu người dùng có quyền categories_delete */}
                              <PermissionGuard permission="categories_delete">
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setCurrentCategory(category);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </PermissionGuard>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredCategories.length > 0 && (
            <div className="text-xs text-muted-foreground mt-4 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Nhấp vào hàng để xem thêm tùy chọn
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa danh mục */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục sản phẩm</DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-name">Tên danh mục</Label>
                      <span className="text-xs text-muted-foreground">
                        {currentCategory.name.length}/50
                      </span>
                    </div>
                    <Input
                      id="edit-name"
                      value={currentCategory.name}
                      onChange={(e) => {
                        const name = e.target.value.slice(0, 50);
                        setCurrentCategory({
                          ...currentCategory,
                          name,
                          // Chỉ tự động cập nhật code nếu code trước đó trống
                          code: currentCategory.code ? currentCategory.code : generateCode(name),
                        });
                      }}
                      className={
                        currentCategory.name.length > 0 && currentCategory.name.length < 3
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }
                    />
                    {currentCategory.name.length > 0 && currentCategory.name.length < 3 && (
                      <p className="text-xs text-red-500">Tên danh mục phải có ít nhất 3 ký tự</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-code">Mã danh mục</Label>
                    <Input
                      id="edit-code"
                      value={currentCategory.code}
                      onChange={(e) =>
                        setCurrentCategory({ ...currentCategory, code: e.target.value })
                      }
                      className={
                        currentCategory.code.length > 0 && currentCategory.code.length < 3
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }
                    />
                    {currentCategory.code.length > 0 && currentCategory.code.length < 3 && (
                      <p className="text-xs text-red-500">Mã danh mục phải có ít nhất 3 ký tự</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Mô tả</Label>
                    <Textarea
                      id="edit-description"
                      value={currentCategory.description || ''}
                      onChange={(e) =>
                        setCurrentCategory({ ...currentCategory, description: e.target.value })
                      }
                      placeholder="Mô tả ngắn về danh mục (không bắt buộc)"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Loại danh mục</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Add a new empty category types
                        const newType: CategoryType = {
                          id: `temp-${Date.now()}`, // Temporary ID until saved
                          name: '',
                          code: '',
                          description: '',
                        };

                        setCurrentCategory({
                          ...currentCategory,
                          categoryTypes: [...(currentCategory.categoryTypes || []), newType],
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Thêm loại
                    </Button>
                  </div>

                  <div className="border rounded-md overflow-hidden max-h-[400px] overflow-y-auto">
                    {currentCategory.categoryTypes?.length ? (
                      <div className="divide-y">
                        {currentCategory.categoryTypes.map((type: CategoryType, index: number) => (
                          <div key={type.id} className="p-3 bg-background hover:bg-muted/50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-sm">{type.name || 'Loại mới'}</div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  // Remove this category types
                                  const updatedTypes = [...(currentCategory.categoryTypes || [])];
                                  updatedTypes.splice(index, 1);
                                  setCurrentCategory({
                                    ...currentCategory,
                                    categoryTypes: updatedTypes,
                                  });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid gap-2 mb-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Tên loại"
                                  value={type.name}
                                  onChange={(e) => {
                                    const updatedTypes = [...(currentCategory.categoryTypes || [])];
                                    updatedTypes[index] = {
                                      ...type,
                                      name: e.target.value,
                                      code: type.code || generateCode(e.target.value),
                                    };
                                    setCurrentCategory({
                                      ...currentCategory,
                                      categoryTypes: updatedTypes,
                                    });
                                  }}
                                  className="text-sm"
                                />
                                <Input
                                  placeholder="Mã loại"
                                  value={type.code}
                                  onChange={(e) => {
                                    const updatedTypes = [...(currentCategory.categoryTypes || [])];
                                    updatedTypes[index] = {
                                      ...type,
                                      code: e.target.value,
                                    };
                                    setCurrentCategory({
                                      ...currentCategory,
                                      categoryTypes: updatedTypes,
                                    });
                                  }}
                                  className="text-sm"
                                />
                              </div>
                              <Textarea
                                placeholder="Mô tả loại (không bắt buộc)"
                                value={type.description || ''}
                                onChange={(e) => {
                                  const updatedTypes = [...(currentCategory.categoryTypes || [])];
                                  updatedTypes[index] = {
                                    ...type,
                                    description: e.target.value,
                                  };
                                  setCurrentCategory({
                                    ...currentCategory,
                                    categoryTypes: updatedTypes,
                                  });
                                }}
                                className="text-sm"
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 bg-muted/30">
                        <Layers className="h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                        <p className="text-sm text-muted-foreground">Chưa có loại danh mục nào</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-1"
                          onClick={() => {
                            // Add a new empty category types
                            const newType: CategoryType = {
                              id: `temp-${Date.now()}`, // Temporary ID until saved
                              name: '',
                              code: '',
                              description: '',
                            };

                            setCurrentCategory({
                              ...currentCategory,
                              categoryTypes: [...(currentCategory.categoryTypes || []), newType],
                            });
                          }}
                        >
                          Thêm loại mới
                        </Button>
                      </div>
                    )}
                  </div>

                  {currentCategory.categoryTypes?.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {currentCategory.categoryTypes.length} loại danh mục
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={
                !currentCategory?.name ||
                !currentCategory?.code ||
                currentCategory.name.length < 3 ||
                currentCategory.code.length < 3 ||
                currentCategory.categoryTypes?.some(
                  (type : CategoryType) =>
                    !type.name || !type.code || type.name.length < 2 || type.code.length < 2,
                )
              }
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa danh mục */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="p-4 border rounded-md my-4">
              <p className="font-medium">{currentCategory.name}</p>
              <p className="text-sm text-muted-foreground">Mã: {currentCategory.code}</p>
              {currentCategory.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentCategory.description}</p>
              )}
              {currentCategory.categoryTypes?.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Cảnh báo: Danh mục này có {currentCategory.categoryTypes.length} loại danh mục
                    con. Việc xóa danh mục này có thể ảnh hưởng đến dữ liệu liên quan.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem loại danh mục */}
      <Dialog open={isViewTypesDialogOpen} onOpenChange={setIsViewTypesDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Loại danh mục</DialogTitle>
            <DialogDescription>
              {currentCategory && `Các loại danh mục thuộc "${currentCategory.name}"`}
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <>
              {currentCategory.categoryTypes?.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead>Tên loại</TableHead>
                        <TableHead>Mã loại</TableHead>
                        <TableHead>Mô tả</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCategory.categoryTypes.map((type: CategoryType) => (
                        <TableRow key={type.id}>
                          <TableCell className="font-mono text-xs">{type.id}</TableCell>
                          <TableCell className="font-medium">{type.name}</TableCell>
                          <TableCell className="font-mono text-sm">{type.code}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {type.description || (
                              <span className="text-muted-foreground italic">Không có mô tả</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg">
                  <Layers className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">Danh mục này chưa có loại danh mục nào</p>
                </div>
              )}
            </>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewTypesDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
