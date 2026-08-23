import { NextResponse } from 'next/server';
import { getPlants, savePlants } from '@/lib/db';
import { sanitizeInput, verifyAdminSession } from '@/lib/security';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();
    const plants = getPlants();
    const index = plants.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Plant crop not found' }, { status: 404 });
    }

    plants[index] = {
      ...plants[index],
      commonName: sanitizeInput(body.commonName ?? plants[index].commonName),
      scientificName: sanitizeInput(body.scientificName ?? plants[index].scientificName),
      category: body.category ?? plants[index].category,
      imageUrl: body.imageUrl ?? plants[index].imageUrl,
      description: sanitizeInput(body.description ?? plants[index].description),
      isFeatured: body.isFeatured ?? plants[index].isFeatured,
      varieties: body.varieties ?? plants[index].varieties,
    };

    savePlants(plants);
    return NextResponse.json(plants[index]);
  } catch (error) {
    console.error('API /plants/[id] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update plant crop' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const plants = getPlants();
    const filtered = plants.filter(p => p.id !== id);

    if (plants.length === filtered.length) {
      return NextResponse.json({ error: 'Plant crop not found' }, { status: 404 });
    }

    savePlants(filtered);
    return NextResponse.json({ success: true, message: 'Plant crop deleted' });
  } catch (error) {
    console.error('API /plants/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete plant crop' }, { status: 500 });
  }
}
