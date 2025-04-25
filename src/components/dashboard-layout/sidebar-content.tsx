"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChevronDown, LogOut, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings } from "lucide-react"
import UserAvatar from "./user-avatar"
import NavItem from "./nav-item"
import type { NavItem as NavItemType } from "@/lib/types/dashboard"
import { Session } from 'next-auth';

interface SidebarContentProps {
  isCollapsed: boolean
  toggleSidebar: () => void
  navItems: NavItemType[]
  pathname: string
  session: Session | null
  status: string
  handleLogout: () => Promise<void>
  getUserInitials: () => string
  getDisplayName: () => string
  isMobile: boolean
}

const SidebarContent = memo(
  ({
     isCollapsed,
     toggleSidebar,
     navItems,
     pathname,
     session,
     status,
     handleLogout,
     getUserInitials,
     getDisplayName,
     isMobile,
   }: SidebarContentProps) => {
    return (
      <div
        className={`flex h-screen flex-col bg-background transition-all duration-300 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <div className={`flex h-16 shrink-0 items-center border-b px-4 ${isCollapsed ? "justify-center" : ""}`}>
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.png" alt="Logo" width={90} height={90} />
          </Link>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:flex"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <ScrollArea className={`flex-1 ${isCollapsed ? "px-1 py-4" : "px-2 py-4"}`}>
          <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col gap-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return <NavItem key={index} item={item} isActive={isActive} isCollapsed={isCollapsed} />
              })}
            </nav>
          </TooltipProvider>
        </ScrollArea>

        <div className={`shrink-0 border-t p-4 ${isCollapsed ? "flex justify-center" : ""}`}>
          {status === "loading" ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              {!isCollapsed && (
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center gap-2 ${isCollapsed ? "flex-col" : ""}`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full p-0">
                    <UserAvatar
                      user={{
                        name: session?.user?.name ?? undefined,
                        email: session?.user?.email ?? undefined,
                        image: session?.user?.image ?? undefined
                      }}
                      fallback={getUserInitials}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isCollapsed ? "center" : "end"}>
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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

              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
                </div>
              )}

              {!isCollapsed && (
                <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
)

SidebarContent.displayName = "SidebarContent"

export default SidebarContent
