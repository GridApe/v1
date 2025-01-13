import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { templateid: string } }
): Promise<NextResponse> {
  const { templateid } = params;
  return handleApiRequest(request, `/user/email-templates/${templateid}`, 'PUT');
}