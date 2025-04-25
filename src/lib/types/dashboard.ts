import type { ReactNode } from "react"

export interface NavItem {
  title: string
  href: string
  icon: ReactNode
  badge?: number
  permission: string
}

