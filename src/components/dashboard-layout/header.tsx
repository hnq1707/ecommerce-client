"use client"

import type React from "react"

import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Menu, Search, ChevronDown, User, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AdminNotificationBell from "@/components/admin-notification/admin-notification-bell"
import UserAvatar from "./user-avatar"
import { Session } from 'next-auth';

interface HeaderProps {
  isMobile: boolean
  setIsOpen: (isOpen: boolean) => void
  pathname: string
  searchQuery: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  session: Session | null
  status: string
  getUserInitials: () => string
  getDisplayName: () => string
  handleLogout: () => Promise<void>
}

const Header = memo(
  ({
     isMobile,
     setIsOpen,
     pathname,
     searchQuery,
     handleSearchChange,
     session,
     status,
     getUserInitials,
     getDisplayName,
     handleLogout,
   }: HeaderProps) => {
    return (
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
        {isMobile && (
          <Button variant="outline" size="icon" className="mr-2 lg:hidden" onClick={() => setIsOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden md:flex">
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
          </Button>

          <nav className="hidden md:flex items-center gap-1">
            <span className="text-muted-foreground mx-2">/</span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {pathname !== "/dashboard" && pathname.startsWith("/dashboard/") && (
              <>
                <span className="text-muted-foreground mx-2">/</span>
                <Button variant="ghost" size="sm" className="capitalize">
                  {pathname.split("/").pop()}
                </Button>
              </>
            )}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-64 pl-8 bg-background"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>

          <AdminNotificationBell />
          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserAvatar
                    user={{
                      name: session?.user?.name || undefined,
                      email: session?.user?.email || undefined,
                      image: session?.user?.image || undefined
                    }}
                    fallback={getUserInitials}
                  />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{getDisplayName()}</span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.scope
                        ? session.user.scope
                        .split(" ")
                        .find((s) => s.trim().startsWith("ROLE_"))
                        ?.trim()
                        .replace(/^ROLE_/, "") || ""
                        : "User"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2 md:hidden">
                  <div className="flex flex-col">
                    <span className="font-medium">{getDisplayName()}</span>
                    <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    )
  },
)

Header.displayName = "Header"

export default Header
