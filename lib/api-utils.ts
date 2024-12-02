import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.gridape.com/api/v1';
const CSRF_COOKIE_URL =
  process.env.NEXT_PUBLIC_CSRF_COOKIE_URL || `${BASE_URL.split('/api/v1')[0]}/sanctum/csrf-cookie`;

async function ensureCsrfToken() {
  try {
    console.log('Fetching CSRF token from:', CSRF_COOKIE_URL); 
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
    console.log('Fetched CSRF token:', csrfToken);
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
}

export async function handleApiRequest(
  request: NextRequest,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
) {
  let csrfToken;
  try {
    console.log('Ensuring CSRF token...'); 
    csrfToken = await ensureCsrfToken();
    
    const cookieStore = cookies();
    const access_token = cookieStore.get('token')?.value;

    console.log('Access token from cookies:', access_token);

    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': csrfToken || '',
      Authorization: access_token 
        ? `Bearer ${access_token}` 
        : `Bearer 28|XiAfsgLdenpa3KzxrbEClzlvNn0Xg9uT0b7Z1A5h414f7f21`
    };

    console.log('Headers prepared for API request:', headers);

    const body = method !== 'GET' ? await request.text() : undefined;

    console.log(`Sending ${method} request to: ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response from API:', data);
      throw new Error(data.error || 'An error occurred');
    }

    console.log('API response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        csrfToken: csrfToken,
      },
      { status: 500 }
    );
  }
}
