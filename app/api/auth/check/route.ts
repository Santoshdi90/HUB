import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session');

  if (sessionToken && sessionToken.value === 'authenticated_token_nursery_2026') {
    return NextResponse.json({
      authenticated: true,
      username: process.env.ADMIN_USERNAME || 'admin',
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
