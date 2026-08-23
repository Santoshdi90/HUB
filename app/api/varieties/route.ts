import { NextResponse } from 'next/server';
import { getPlants, savePlants } from '@/lib/db';
import { PlantVariety } from '@/lib/types';
import { sanitizeInput, verifyAdminSession } from '@/lib/security';

export async function POST(request: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const plantId = body.plantId;
    const varietyName = sanitizeInput(body.varietyName || '');

    if (!plantId || !varietyName) {
      return NextResponse.json(
        { error: 'Parent plant ID and variety name are required' },
        { status: 400 }
      );
    }

    const plants = getPlants();
    const parentIndex = plants.findIndex(p => p.id === plantId);

    if (parentIndex === -1) {
      return NextResponse.json({ error: 'Parent plant crop not found' }, { status: 404 });
    }

    const newVariety: PlantVariety = {
      id: `var-${Date.now()}`,
      plantId,
      varietyName,
      price: Number(body.price) || 1.0,
      unit: sanitizeInput(body.unit || 'per sapling'),
      stockStatus: body.stockStatus || 'In Stock',
      imageUrl: body.imageUrl || plants[parentIndex].imageUrl,
      yieldTraits: sanitizeInput(body.yieldTraits || ''),
      daysToMaturity: sanitizeInput(body.daysToMaturity || '60 days'),
      careGuidelines: sanitizeInput(body.careGuidelines || ''),
      sunlight: body.sunlight || 'Full Sun',
      watering: body.watering || 'Moderate',
      isPopular: Boolean(body.isPopular),
    };

    if (!plants[parentIndex].varieties) {
      plants[parentIndex].varieties = [];
    }

    plants[parentIndex].varieties.unshift(newVariety);
    savePlants(plants);

    return NextResponse.json(newVariety, { status: 201 });
  } catch (error) {
    console.error('API /varieties POST error:', error);
    return NextResponse.json({ error: 'Failed to add variety' }, { status: 500 });
  }
}
