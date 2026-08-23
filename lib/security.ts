import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * Sanitize text inputs to prevent XSS and HTML injection
 */
export function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Hash a plain text password using bcryptjs
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare plain text password against hashed password
 */
export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Verify server-side authentication cookie on API routes
 */
export function verifyAdminSession(): boolean {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin_session');
    return Boolean(sessionToken && sessionToken.value === 'authenticated_token_nursery_2026');
  } catch (error) {
    return false;
  }
}
