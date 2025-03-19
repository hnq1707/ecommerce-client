import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    // Lấy token xác thực từ cookies
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Không tìm thấy token xác thực" }, { status: 401 })
    }

    // Lưu ý: API endpoint này không có trong OrderController
    // Trong trường hợp thực tế, bạn cần thêm endpoint này vào backend Java
    // hoặc sử dụng một endpoint khác để lấy thông tin payment intent

    // Dữ liệu mẫu cho mục đích minh họa
    const mockResponse = {
      client_secret:
        "pi_mock_" +
        Math.random().toString(36).substring(2, 15) +
        "_secret_" +
        Math.random().toString(36).substring(2, 15),
      amount: 35997, // Số tiền tính bằng xu (359.97 USD)
      currency: "usd",
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Lỗi khi lấy payment intent:", error)
    return NextResponse.json({ error: "Không thể lấy payment intent" }, { status: 500 })
  }
}

