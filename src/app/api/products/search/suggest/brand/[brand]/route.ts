import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { brand: string } }) {
  const brand = params.brand;

  if (!brand) {
    return NextResponse.json({ error: 'Brand is required' }, { status: 400 });
  }

  try {
    // Replace with your actual backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(
      `${backendUrl}/api/products/search/suggest/brand/${encodeURIComponent(brand)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Brand suggestion error:', error);
    return NextResponse.json({ error: 'Failed to get brand suggestions' }, { status: 500 });
  }
}
