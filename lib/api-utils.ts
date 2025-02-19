import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.gridape.com/api/v1';
const CSRF_COOKIE_URL =
  process.env.NEXT_PUBLIC_CSRF_COOKIE_URL || `${BASE_URL.split('/api/v1')[0]}/sanctum/csrf-cookie`;

async function ensureCsrfToken() {
  try {
    // console.log('Fetching CSRF token from:', CSRF_COOKIE_URL);
    const response = await fetch(CSRF_COOKIE_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const cookieHeader = response.headers.get('set-cookie');
    const csrfTokenMatch = cookieHeader?.match(/XSRF-TOKEN=([^;]+)/);
    const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : '';
    // console.log('Fetched CSRF token:', csrfToken);
    return csrfToken;
  } catch (error) {
    // console.error('Error fetching CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
}

export async function handleApiRequest(
  request: NextRequest,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET'
) {
  let csrfToken;
  try {
    csrfToken = await ensureCsrfToken();

    const cookieStore = cookies();
    const access_token = cookieStore.get('token')?.value;

    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': csrfToken || '',
      Authorization: `Bearer ${access_token}`,
    };

    const body = method !== 'GET' ? await request.text() : undefined;

    console.log(`Sending ${method} request to: ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(method !== 'DELETE' && { body }), // Exclude body if method is DELETE
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response from API:', data);

      throw new Error(
        typeof data === 'object' ? JSON.stringify(data) : data || 'An error occurred'
      );
    }

    console.log('API response data:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);

    let errorMessage = 'An unexpected error occurred';
    let errorDetails = null;

    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        if (typeof parsedError === 'object') {
          errorMessage = parsedError.message || 'Validation failed.';
          errorDetails = parsedError.errors || null;
        }
      } catch {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        csrfToken: csrfToken,
      },
      { status: 500 }
    );
  }
}
