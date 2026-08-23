import { NextResponse } from 'next/server';
import { getGalleryItems, saveGalleryItems } from '@/lib/db';
import { GalleryItem } from '@/lib/types';
import { sanitizeInput, verifyAdminSession } from '@/lib/security';

export async function GET() {
  try {
    const items = getGalleryItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('API /gallery GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = sanitizeInput(body.title || '');
    const imageUrl = body.imageUrl;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Photo title and Cloudinary image URL are required' },
        { status: 400 }
      );
    }

    const items = getGalleryItems();
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title,
      category: body.category || 'Greenhouse',
      imageUrl,
      caption: sanitizeInput(body.caption || ''),
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    items.unshift(newItem);
    saveGalleryItems(items);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('API /gallery POST error:', error);
    return NextResponse.json({ error: 'Failed to add gallery photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID required' }, { status: 400 });
    }

    const items = getGalleryItems();
    const filtered = items.filter(item => item.id !== id);

    saveGalleryItems(filtered);
    return NextResponse.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    console.error('API /gallery DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
