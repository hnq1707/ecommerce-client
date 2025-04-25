/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type React from 'react';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/lib/redux/features/user/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Plus,
  Trash,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserOrders,
  selectOrders,
  selectOrderLoading,
  selectOrderError,
} from '@/lib/redux/features/order/orderSlice';
import type { AppDispatch } from '@/lib/redux/store';
import type { Order } from '@/lib/types/Order';
import { AddAddressDialog } from '@/components/address/AddAddressDialog';
import api from '@/lib/utils/api';

const ProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, loading, error, fetchUser, updateUserData, setUserState } = useUsers();
  const [activeTab, setActiveTab] = useState('info');
  const dispatch = useDispatch<AppDispatch>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Redux state for orders
  const orders = useSelector(selectOrders) as Order[] | undefined;
  const isOrdersLoading = useSelector(selectOrderLoading);
  const ordersError = useSelector(selectOrderError);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        fetchUser(session.user.id);
      }
    };
    fetchData();
  }, [session?.user?.id]);

  // Fetch orders when the orders tab is selected
  useEffect(() => {
    if (activeTab === 'orders' && session?.user?.id) {
      dispatch(getUserOrders({ page: 0, size: 5 }));
    }
  }, [activeTab, dispatch, session?.user?.id]);
  const handleAddressAdded = () => {
    // Gọi lại fetchUser để lấy danh sách địa chỉ mới nhất
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  };
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <X className="h-8 w-8 text-destructive" />
              <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
              <p className="text-sm text-muted-foreground">
                Không thể tải thông tin người dùng. Vui lòng thử lại sau.
              </p>
              <Button onClick={() => router.refresh()} className="mt-4">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <User className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Không tìm thấy dữ liệu</h3>
              <p className="text-sm text-muted-foreground">Không tìm thấy thông tin người dùng.</p>
              <Button onClick={() => router.refresh()} className="mt-4">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const imageUrl = data.filePath;

      if (imageUrl) {
        setUserState({
          ...user,
          imageUrl: imageUrl,
        });
        toast({
          title: 'Tải ảnh thành công',
          description: 'Ảnh đại diện của bạn đã được cập nhật.',
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Tải ảnh thất bại',
        description: 'Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;
    try {
      if (session?.user?.id) {
        await updateUserData(session.user.id, user);
        toast({
          title: 'Cập nhật thành công',
          description: 'Thông tin cá nhân của bạn đã được cập nhật.',
        });
        setIsEditing(false);
        router.refresh();
      } else {
        console.error('Session or user ID is missing');
        toast({
          title: 'Cập nhật thất bại',
          description: 'Không tìm thấy thông tin phiên đăng nhập.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      toast({
        title: 'Cập nhật thất bại',
        description: 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await api.delete(`/api/address/${addressId}`);
      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Xóa địa chỉ thành công',
          description: 'Địa chỉ đã được xóa khỏi tài khoản của bạn.',
        });
        // Gọi lại fetchUser để lấy danh sách user.addressList mới nhất
        if (session?.user?.id) {
          fetchUser(session.user.id);
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      toast({
        title: 'Xóa địa chỉ thất bại',
        description: 'Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  const cancelEditing = () => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getRoleBadges = () => {
    if (!user.roles || user.roles.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {user.roles.map((role, index) => (
          <Badge key={index} variant="outline" className="px-2 py-1">
            {role.name}
          </Badge>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Đang xử lý
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Đã xác nhận
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Đang giao hàng
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Đã giao hàng
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ShoppingBag className="h-5 w-5 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold">Thông tin cá nhân</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={cancelEditing} className="gap-2">
                  <X className="h-4 w-4" />
                  Hủy
                </Button>
                <Button onClick={handleUpdateUser} className="gap-2">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-40 w-40 border-4 border-background shadow-md">
                  <AvatarImage
                    src={user?.imageUrl || ''}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback className="text-4xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs font-medium">Tải ảnh lên</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadAvatar}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{`${user?.firstName || ''} ${
                  user?.lastName || ''
                }`}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                {getRoleBadges()}
              </div>
            </div>

            <div>
              <Tabs
                defaultValue="info"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="info" className="gap-2">
                    <User className="h-4 w-4" />
                    Thông tin cơ bản
                  </TabsTrigger>
                  <TabsTrigger value="address" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Đơn hàng
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          value={user?.firstName || ''}
                          disabled={!isEditing}
                          onChange={(e) => setUserState({ ...user, firstName: e.target.value })}
                          className={isEditing ? 'pr-10 border-primary' : ''}
                        />
                        {isEditing && (
                          <Edit className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          value={user?.lastName || ''}
                          disabled={!isEditing}
                          onChange={(e) => setUserState({ ...user, lastName: e.target.value })}
                          className={isEditing ? 'pr-10 border-primary' : ''}
                        />
                        {isEditing && (
                          <Edit className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          value={user?.phoneNumber || ''}
                          disabled={!isEditing}
                          onChange={(e) => setUserState({ ...user, phoneNumber: e.target.value })}
                          className={isEditing ? 'pr-10 border-primary' : ''}
                        />
                        {isEditing && (
                          <Edit className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-6">
                  {user?.addressList && user.addressList.length > 0 ? (
                    user.addressList.map((address, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium">
                              {address.name || `Địa chỉ ${index + 1}`}
                            </CardTitle>
                            {isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash className="h-3.5 w-3.5" />
                                <span className="text-xs">Xóa</span>
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Đường</Label>
                              <p>{address.street || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Quận/Huyện</Label>
                              <p>{address.district || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Tỉnh/Thành Phố
                              </Label>
                              <p>{address.city || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Mã bưu điện</Label>
                              <p>{address.zipCode || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <Label className="text-xs text-muted-foreground">
                                Số điện thoại liên hệ
                              </Label>
                              <p>{address.phoneNumber || 'Chưa cập nhật'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">Chưa có địa chỉ nào</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        Bạn chưa thêm địa chỉ nào vào tài khoản
                      </p>

                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <Plus className="h-4 w-4" />
                        Thêm địa chỉ mới
                      </Button>
                      <AddAddressDialog
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                        onAddressAdded={handleAddressAdded}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Đơn hàng gần đây</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/orders" className="gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Xem tất cả
                      </Link>
                    </Button>
                  </div>

                  {isOrdersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="h-5 w-24 bg-muted rounded"></div>
                              <div className="h-6 w-24 bg-muted rounded-full"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-full bg-muted rounded"></div>
                              <div className="h-4 w-3/4 bg-muted rounded"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : ordersError ? (
                    <Card className="border-destructive/50">
                      <CardContent className="p-6 text-center">
                        <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                        <h4 className="font-medium">Không thể tải đơn hàng</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Đã xảy ra lỗi khi tải đơn hàng của bạn. Vui lòng thử lại sau.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => dispatch(getUserOrders({ page: 0, size: 5 }))}
                        >
                          Thử lại
                        </Button>
                      </CardContent>
                    </Card>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                          <Card
                            className="overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 group-hover:border-primary"
                            style={{
                              borderLeftColor:
                                order.orderStatus === 'PENDING'
                                  ? '#eab308'
                                  : order.orderStatus === 'CONFIRMED'
                                  ? '#3b82f6'
                                  : order.orderStatus === 'SHIPPED'
                                  ? '#6366f1'
                                  : order.orderStatus === 'DELIVERED'
                                  ? '#22c55e'
                                  : order.orderStatus === 'CANCELLED'
                                  ? '#ef4444'
                                  : '#e5e7eb',
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Đơn #{order.id}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(order.orderDate), 'dd/MM/yyyy')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(order.orderStatus)}
                                  {getStatusBadge(order.orderStatus)}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Sản phẩm:</span>
                                  <span>{order.orderItemList?.length || 0} sản phẩm</span>
                                </div>

                                {order.orderItemList && order.orderItemList.length > 0 && (
                                  <div className="text-sm line-clamp-1">
                                    {order.orderItemList[0].product.name}
                                    {order.orderItemList.length > 1 &&
                                      ` và ${order.orderItemList.length - 1} sản phẩm khác`}
                                  </div>
                                )}

                                <div className="flex justify-between items-center pt-2">
                                  <div className="font-medium">
                                    {formatCurrency(order.totalPrice || 0)}
                                  </div>
                                  <div className="text-primary flex items-center text-sm font-medium group-hover:underline">
                                    Xem chi tiết
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h4 className="text-lg font-medium">Chưa có đơn hàng nào</h4>
                        <p className="text-muted-foreground mt-1 mb-4">
                          Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                        </p>
                        <Button asChild>
                          <Link href="/products">Khám phá sản phẩm</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
