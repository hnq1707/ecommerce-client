import type React from "react"
import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import PermissionGuard from "@/components/auth/permission-guard"

interface NavItemProps {
  item: {
    title: string
    href: string
    icon: React.ReactNode
    badge?: number
    permission: string
  }
  isActive: boolean
  isCollapsed: boolean
}

const NavItem = memo(({ item, isActive, isCollapsed }: NavItemProps) => {
  const NavButton = (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className={`justify-start relative ${isCollapsed ? "w-10 h-10 p-0 justify-center" : ""}`}
    >
      <Link href={item.href}>
        {item.icon}
        {!isCollapsed && <span className="ml-2">{item.title}</span>}
        {item.badge && !isCollapsed && (
          <Badge variant="destructive" className="ml-auto">
            {item.badge}
          </Badge>
        )}
        {item.badge && isCollapsed && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  )

  return (
    <PermissionGuard permission={item.permission}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      ) : (
        NavButton
      )}
    </PermissionGuard>
  )
})

NavItem.displayName = "NavItem"

export default NavItem
