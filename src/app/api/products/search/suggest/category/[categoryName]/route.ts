// src/app/api/products/search/suggest/category/[categoryName]/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  // NOTE: params bây giờ là Promise<{ categoryName: string }>
  { params }: { params: Promise<{ categoryName: string }> }
) {
  // bắt buộc await mới lấy được object { categoryName }
  const { categoryName } = await params;

  if (!categoryName) {
    return NextResponse.json(
      { error: 'Category is required' },
      { status: 400 }
    );
  }

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
    const response = await fetch(
      `${backendUrl}/api/products/search/suggest/category/${encodeURIComponent(
        categoryName
      )}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Category suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to get category suggestions' },
      { status: 500 }
    );
  }
}
