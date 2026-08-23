import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { sanitizeInput, verifyAdminSession } from '@/lib/security';

export async function GET() {
  try {
    const settings = getSettings();
    // Exclude password hash from public GET response
    const { passwordHash, ...safeSettings } = settings;
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error('API /settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const sanitizedUpdates = {
      ...body,
      nurseryName: body.nurseryName ? sanitizeInput(body.nurseryName) : undefined,
      locationTagline: body.locationTagline ? sanitizeInput(body.locationTagline) : undefined,
      phone1: body.phone1 ? sanitizeInput(body.phone1) : undefined,
      phone2: body.phone2 ? sanitizeInput(body.phone2) : undefined,
      whatsappNumber: body.whatsappNumber ? sanitizeInput(body.whatsappNumber) : undefined,
      address: body.address ? sanitizeInput(body.address) : undefined,
      timings: body.timings ? sanitizeInput(body.timings) : undefined,
    };

    // Remove undefined values
    Object.keys(sanitizedUpdates).forEach(
      key => (sanitizedUpdates as any)[key] === undefined && delete (sanitizedUpdates as any)[key]
    );

    const updated = saveSettings(sanitizedUpdates);
    const { passwordHash, ...safeSettings } = updated;
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error('API /settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
