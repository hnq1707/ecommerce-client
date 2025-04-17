import { type NextRequest, NextResponse } from 'next/server';

// This is a client-side proxy to your Java backend
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    // Replace with your actual backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(
      `${backendUrl}/api/products/search/advanced?keyword=${encodeURIComponent(keyword)}`,
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
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
