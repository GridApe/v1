import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return handleApiRequest(request, `/user/campaigns/${params.id}`, 'DELETE');
} 
