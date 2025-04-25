"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"
import { AuthProvider } from "@/lib/utils/auth/auth-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUserProfile } from "@/hooks/use-user-profile"
import { navItems } from "@/constants/nav-items"
import SidebarContent from "@/components/dashboard-layout/sidebar-content"
import Header from "@/components/dashboard-layout/header"
import LoadingScreen from "@/components/dashboard-layout/loading-screen"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const { getUserInitials, getDisplayName } = useUserProfile(session)

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Handle logout
  const handleLogout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  // Show loading state while checking authentication
  if (status === "loading") {
    return <LoadingScreen />
  }

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-muted/20">
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                navItems={navItems}
                pathname={pathname}
                session={session}
                status={status}
                handleLogout={handleLogout}
                getUserInitials={getUserInitials}
                getDisplayName={getDisplayName}
                isMobile={isMobile}
              />
            </SheetContent>
          </Sheet>
        ) : (
          <div
            className={`hidden lg:block transition-all duration-300 ${
              isCollapsed ? "lg:w-16" : "lg:w-64"
            } border-r bg-background`}
          >
            <SidebarContent
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              navItems={navItems}
              pathname={pathname}
              session={session}
              status={status}
              handleLogout={handleLogout}
              getUserInitials={getUserInitials}
              getDisplayName={getDisplayName}
              isMobile={isMobile}
            />
          </div>
        )}
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <Header
            isMobile={isMobile}
            setIsOpen={setIsOpen}
            pathname={pathname}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            session={session}
            status={status}
            getUserInitials={getUserInitials}
            getDisplayName={getDisplayName}
            handleLogout={handleLogout}
          />
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 lg:p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
