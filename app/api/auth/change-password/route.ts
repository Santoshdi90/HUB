import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { comparePassword, hashPassword, verifyAdminSession } from '@/lib/security';

export async function POST(request: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const settings = getSettings();
    let isCurrentValid = false;

    if (settings.passwordHash) {
      isCurrentValid = await comparePassword(currentPassword, settings.passwordHash);
    } else {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Rani@123';
      isCurrentValid = currentPassword === defaultPassword;
    }

    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash and save new password
    const newHash = await hashPassword(newPassword);
    saveSettings({ passwordHash: newHash });

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully',
    });
  } catch (error) {
    console.error('API /auth/change-password error:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
