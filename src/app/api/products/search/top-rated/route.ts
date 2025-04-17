import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace with your actual backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/products/search/top-rated`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Top rated products error:', error);
    return NextResponse.json({ error: 'Failed to get top rated products' }, { status: 500 });
  }
}
