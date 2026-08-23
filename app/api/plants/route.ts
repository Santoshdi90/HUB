import { NextResponse } from 'next/server';
import { getPlants, savePlants } from '@/lib/db';
import { Plant } from '@/lib/types';
import { sanitizeInput, verifyAdminSession } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let plants = getPlants();

    if (category && category !== 'All') {
      plants = plants.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      plants = plants.filter(
        p =>
          p.commonName.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.varieties.some(v => v.varietyName.toLowerCase().includes(q))
      );
    }

    return NextResponse.json(plants);
  } catch (error) {
    console.error('API /plants GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const commonName = sanitizeInput(body.commonName || '');
    const category = body.category;

    if (!commonName || !category) {
      return NextResponse.json(
        { error: 'Common name and category are required' },
        { status: 400 }
      );
    }

    const plants = getPlants();
    const newPlant: Plant = {
      id: `crop-${Date.now()}`,
      commonName,
      scientificName: sanitizeInput(body.scientificName || ''),
      category,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      description: sanitizeInput(body.description || ''),
      isFeatured: Boolean(body.isFeatured),
      varieties: body.varieties || [],
    };

    plants.unshift(newPlant);
    savePlants(plants);

    return NextResponse.json(newPlant, { status: 201 });
  } catch (error) {
    console.error('API /plants POST error:', error);
    return NextResponse.json({ error: 'Failed to add plant' }, { status: 500 });
  }
}
