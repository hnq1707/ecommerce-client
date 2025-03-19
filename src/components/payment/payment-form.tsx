"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StripePaymentElement } from "./stripe-payment-element"
import { Skeleton } from "@/components/ui/skeleton"
import { useDispatch, useSelector } from "react-redux"
import {
  getOrderDetails,
  selectOrderDetails,
  selectOrderLoading,
} from "@/lib/redux/features/order/orderSlice"
import App from "next/app"
import { AppDispatch } from "@/lib/redux/store"

// Đảm bảo gọi loadStripe bên ngoài render của component để tránh
// tạo lại đối tượng Stripe trong mỗi lần render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  orderId: string
}

export function PaymentForm({ orderId }: PaymentFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  // Redux state
  const isLoading = useSelector(selectOrderLoading)
  const orderDetails = useSelector(selectOrderDetails)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderTotal, setOrderTotal] = useState(0)



  useEffect(() => {
    // Lấy client secret từ tham số URL (được truyền từ trang checkout)
    const secret = searchParams.get("clientSecret")

    if (secret) {
      setClientSecret(secret)

      // Lấy thông tin đơn hàng
      dispatch(getOrderDetails(orderId)).then((action) => {
        if (getOrderDetails.fulfilled.match(action)) {
          setOrderTotal(action.payload.totalPrice)
        }
      })
    
    }
  }, [dispatch, orderId, router, searchParams])

  if (isLoading || !clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0f172a",
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoàn Tất Thanh Toán</CardTitle>
        <CardDescription>Thanh toán an toàn cho đơn hàng #{orderId}</CardDescription>
      </CardHeader>
      <Elements stripe={stripePromise} options={options}>
        <StripePaymentElement orderId={orderId} amount={orderTotal} />
      </Elements>
    </Card>
  )
}

