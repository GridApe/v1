import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  return handleApiRequest(request, `/user/profile/avatar/`, 'POST');
}