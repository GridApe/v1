import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    if (!planId) {
      return NextResponse.json(
        { status: 'error', message: 'planId is required' },
        { status: 400 }
      );
    }

    return await handleApiRequest(request, `/user/subscriptions/subscribe/${planId}`, 'POST');
  } catch (error) {
    // console.error('Error processing subscription request:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
