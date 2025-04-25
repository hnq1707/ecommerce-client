import { BarChart3, Package, ShoppingBag, Users, Settings, Layers, FileText, ShieldCheck } from "lucide-react"
import type { NavItem } from "@/lib/types/dashboard"

export const navItems: NavItem[] = [
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    permission: "dashboard_access",
  },
  {
    title: "Danh mục",
    href: "/dashboard/categories",
    icon: <Layers className="h-5 w-5" />,
    permission: "categories_view",
  },
  {
    title: "Sản phẩm",
    href: "/dashboard/products",
    icon: <Package className="h-5 w-5" />,
    permission: "products_view",
  },
  {
    title: "Đơn hàng",
    href: "/dashboard/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
    // badge: 5,
    permission: "orders_view",
  },
  {
    title: "Người dùng",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
    permission: "users_view",
  },
  {
    title: "Phân quyền",
    href: "/dashboard/roles",
    icon: <ShieldCheck className="h-5 w-5" />,
    permission: "roles_view",
  },
  {
    title: "Hóa đơn",
    href: "/dashboard/invoices",
    icon: <FileText className="h-5 w-5" />,
    permission: "orders_export",
  },
  {
    title: "Coupons",
    href: "/dashboard/coupons",
    icon: <FileText className="h-5 w-5" />,
    permission: "coupons_view",
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    permission: "dashboard_access",
  },
]
