import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  return NextResponse.json(
    { message: 'Cookie set' },
    {
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict;`,
      },
    }
  );
}
