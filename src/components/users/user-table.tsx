"use client"
import { Edit, MoreHorizontal, UserX, Shield, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/type/User"
import { UsersIcon } from "lucide-react"

interface UserTableProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onDisable: (user: User) => void
  onManageRoles: (user: User) => void
}

export function UserTable({ users, loading, onEdit, onDisable, onManageRoles }: UserTableProps) {
  // Hiển thị badge cho vai trò người dùng
  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return <Badge className="bg-purple-500">Quản trị viên</Badge>
      case "MANAGER":
        return <Badge className="bg-blue-500">Quản lý</Badge>
      case "STAFF":
        return <Badge className="bg-green-500">Nhân viên</Badge>
      case "USER":
        return <Badge className="bg-gray-500">Khách hàng</Badge>
      default:
        return <Badge>{roleName}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <p>Đang tải dữ liệu...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user: User) => (
              <TableRow key={user.id} className={!user.enabled ? "opacity-60" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.imageUrl || "/placeholder.svg"}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role, index) => <span key={index}>{getRoleBadge(role.name)}</span>)
                    ) : (
                      <Badge variant="outline">Chưa có vai trò</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.enabled ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600">Đang hoạt động</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-600">Đã vô hiệu hóa</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageRoles(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Quản lý vai trò
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => onDisable(user)}>
                        <UserX className="mr-2 h-4 w-4" />
                        {user.enabled ? "Vô hiệu hóa" : "Kích hoạt"}
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
  )
}
