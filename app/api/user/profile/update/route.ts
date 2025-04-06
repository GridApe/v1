import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
): Promise<NextResponse> {
  return handleApiRequest(request, `/user/profile/{}`, 'PUT');
}