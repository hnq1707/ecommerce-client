import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params
    const { paymentIntentId, status } = await request.json()

    const response = await fetch(`https://your-backend-url/api/orders/payment-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ paymentIntentId, status })
    })
    const data = await response.json()

    // Phản hồi mẫu cho mục đích minh họa
    const mockResponse = {
      orderId,
      status: "success",
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error)
    return NextResponse.json({ error: "Không thể cập nhật trạng thái thanh toán" }, { status: 500 })
  }
}

