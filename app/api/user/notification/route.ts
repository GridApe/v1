import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequest(request, '/user/notifications/', 'GET');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get('notificationId');
  const action = searchParams.get('action');

  if (action === 'markAsRead' && notificationId) {
    return handleApiRequest(request, `/user/notifications/${notificationId}/read`, 'PATCH');
  } else if (action === 'markAllAsRead') {
    return handleApiRequest(request, '/user/notifications/mark-all-read', 'PATCH');
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get('notificationId');

  if (notificationId) {
    return handleApiRequest(request, `/user/notifications/${notificationId}`, 'DELETE');
  }

  return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
}

