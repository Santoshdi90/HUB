import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { comparePassword, hashPassword, sanitizeInput } from '@/lib/security';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimiter';

export async function POST(request: Request) {
  try {
    // Extract Client IP
    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate Limiting Check
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      const waitSec = Math.ceil((rateCheck.remainingMs || 0) / 1000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Please try again in ${waitSec} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = sanitizeInput(body.username || '');
    const password = body.password || '';

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const settings = getSettings();
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';

    // Check username
    if (username !== expectedUsername) {
      recordFailedAttempt(clientIp);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    let isValidPassword = false;

    if (settings.passwordHash) {
      isValidPassword = await comparePassword(password, settings.passwordHash);
    } else {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      if (password === defaultPassword) {
        isValidPassword = true;
        // Hash and store for future authentication
        const newHash = await hashPassword(defaultPassword);
        saveSettings({ passwordHash: newHash });
      }
    }

    if (!isValidPassword) {
      recordFailedAttempt(clientIp);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Reset rate limiter on successful authentication
    resetRateLimit(clientIp);

    const response = NextResponse.json({
      success: true,
      user: { username },
    });

    response.cookies.set('admin_session', 'authenticated_token_nursery_2026', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('API /auth/login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
