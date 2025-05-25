// app/api/products/search/suggest/brand/[brand]/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  // bọc params vào Promise<{ brand: string }>
  { params }: { params: Promise<{ brand: string }> },
) {
  // vì params là Promise, phải await nó mới lấy được object
  const { brand } = await params;

  if (!brand) {
    return NextResponse.json({ error: 'Brand is required' }, { status: 400 });
  }

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(
      `${backendUrl}/api/products/search/suggest/brand/${encodeURIComponent(
        brand,
      )}`,
      { headers: { 'Content-Type': 'application/json' } },
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Brand suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to get brand suggestions' },
      { status: 500 },
    );
  }
}
