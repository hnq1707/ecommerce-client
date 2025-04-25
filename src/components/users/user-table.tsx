"use client"
import { Edit, MoreHorizontal, UserX, Shield, CheckCircle, XCircle, UsersIcon } from "lucide-react"
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
import type { User } from "@/lib/types/User"

interface UserTableProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onDisable: (user: User) => void
  onManageRoles: (user: User) => void
}

const ROLE_BADGES = {
  ADMIN: { label: 'Quản trị viên', className: 'bg-purple-500' },
  MANAGER: { label: 'Quản lý', className: 'bg-blue-500' },
  STAFF: { label: 'Nhân viên', className: 'bg-green-500' },
  USER: { label: 'Khách hàng', className: 'bg-gray-500' },
} as const

const LoadingState = () => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell colSpan={4} className="text-center h-24">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
            <p>Đang tải dữ liệu...</p>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

const EmptyState = () => (
  <div className="rounded-md border">
    <Table>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center h-24">
            <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
)


const UserStatus = ({ enabled }: { enabled: boolean }) => (
  <div className="flex items-center">
    {enabled ? (
      <>
        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
        <span className="text-green-600">Đang hoạt động</span>
      </>
    ) : (
      <>
        <XCircle className="h-4 w-4 text-red-500 mr-1" />
        <span className="text-red-600">Đã vô hiệu hóa</span>
      </>
    )}
  </div>
)

const RoleBadge = ({ roleName }: { roleName: string }) => {
  const role = ROLE_BADGES[roleName as keyof typeof ROLE_BADGES]
  return (
    <Badge className={role?.className || ''}>
      {role?.label || roleName}
    </Badge>
  )
}

const getInitials = (firstName: string | null, lastName: string | null): string => {
  if (!firstName && !lastName) return '?'
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`
}

export function UserTable({ users, loading, onEdit, onDisable, onManageRoles }: UserTableProps) {
  if (loading) return <LoadingState />
  if (!users.length) return <EmptyState />

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
          {users.map((user) => (
            <TableRow key={user.id} className={!user.enabled ? "opacity-60" : ""}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={`${user.firstName || ''} ${user.lastName || ''}`}
                    />
                    <AvatarFallback>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 
                    ? user.roles.map((role, index) => (
                        <RoleBadge key={index} roleName={role.name} />
                      ))
                    : <Badge variant="outline">Chưa có vai trò</Badge>
                  }
                </div>
              </TableCell>
              <TableCell>
                <UserStatus enabled={user.enabled} />
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}