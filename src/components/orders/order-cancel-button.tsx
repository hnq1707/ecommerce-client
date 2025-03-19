"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {  useDispatch, useSelector } from "react-redux"
import { cancelOrder, selectOrderLoading } from "@/lib/redux/features/order/orderSlice"
import { AppDispatch } from "@/lib/redux/store"

interface OrderCancelButtonProps {
  orderId: string
}

export function OrderCancelButton({ orderId }: OrderCancelButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()

  // Redux state
  const isLoading = useSelector(selectOrderLoading)

  const [isOpen, setIsOpen] = useState(false)

  const handleCancel = async () => {
    dispatch(cancelOrder(orderId)).then((action) => {
      if (cancelOrder.fulfilled.match(action)) {
        toast({
          title: "Thành công",
          description: "Đơn hàng đã được hủy thành công.",
        })

        // Cập nhật UI
        router.refresh()
      } else if (cancelOrder.rejected.match(action)) {
        toast({
          title: "Lỗi",
          description: (action.payload as string) || "Không thể hủy đơn hàng. Vui lòng thử lại.",
          variant: "destructive",
        })
      }

      setIsOpen(false)
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Hủy đơn hàng</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Xác nhận hủy đơn hàng
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleCancel()
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

