import { handleApiRequest } from '@/lib/api-utils'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return handleApiRequest(request, 'auth/resend-verification-mail', 'POST')
}