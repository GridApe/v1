import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
): Promise<NextResponse> {
  try {
    const cookieStore = cookies();
    const access_token = cookieStore.get('token')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/avatars/${params.filename}`, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
        'Authorization': `Bearer ${access_token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch avatar');
    }

    // Get the content type from the response
    const contentType = response.headers.get('content-type') || 'image/*';

    // Return the image with the correct content type
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Avatar fetch error:', error);
    return new NextResponse(null, { status: 404 });
  }
} 
