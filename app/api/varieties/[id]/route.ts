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

    const varietyId = params.id;
    const body = await request.json();
    const plants = getPlants();

    let found = false;
    let updatedVariety = null;

    for (let p of plants) {
      if (!p.varieties) continue;
      const vIndex = p.varieties.findIndex(v => v.id === varietyId);
      if (vIndex !== -1) {
        found = true;
        p.varieties[vIndex] = {
          ...p.varieties[vIndex],
          varietyName: sanitizeInput(body.varietyName ?? p.varieties[vIndex].varietyName),
          price: Number(body.price ?? p.varieties[vIndex].price),
          unit: sanitizeInput(body.unit ?? p.varieties[vIndex].unit),
          stockStatus: body.stockStatus ?? p.varieties[vIndex].stockStatus,
          imageUrl: body.imageUrl ?? p.varieties[vIndex].imageUrl,
          yieldTraits: sanitizeInput(body.yieldTraits ?? p.varieties[vIndex].yieldTraits),
          daysToMaturity: sanitizeInput(body.daysToMaturity ?? p.varieties[vIndex].daysToMaturity),
          careGuidelines: sanitizeInput(body.careGuidelines ?? p.varieties[vIndex].careGuidelines),
          sunlight: body.sunlight ?? p.varieties[vIndex].sunlight,
          watering: body.watering ?? p.varieties[vIndex].watering,
          isPopular: body.isPopular ?? p.varieties[vIndex].isPopular,
        };
        updatedVariety = p.varieties[vIndex];
        break;
      }
    }

    if (!found) {
      return NextResponse.json({ error: 'Variety not found' }, { status: 404 });
    }

    savePlants(plants);
    return NextResponse.json(updatedVariety);
  } catch (error) {
    console.error('API /varieties/[id] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update variety' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const varietyId = params.id;
    const body = await request.json(); // e.g. { stockStatus: 'In Stock' | 'Out of Stock' | 'Pre-Booking' }
    const plants = getPlants();

    let found = false;
    let updatedVariety = null;

    for (let p of plants) {
      if (!p.varieties) continue;
      const vIndex = p.varieties.findIndex(v => v.id === varietyId);
      if (vIndex !== -1) {
        found = true;
        if (body.stockStatus) {
          p.varieties[vIndex].stockStatus = body.stockStatus;
        }
        updatedVariety = p.varieties[vIndex];
        break;
      }
    }

    if (!found) {
      return NextResponse.json({ error: 'Variety not found' }, { status: 404 });
    }

    savePlants(plants);
    return NextResponse.json(updatedVariety);
  } catch (error) {
    console.error('API /varieties/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to toggle variety stock' }, { status: 500 });
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

    const varietyId = params.id;
    const plants = getPlants();
    let deleted = false;

    for (let p of plants) {
      if (!p.varieties) continue;
      const initialLen = p.varieties.length;
      p.varieties = p.varieties.filter(v => v.id !== varietyId);
      if (p.varieties.length < initialLen) {
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Variety not found' }, { status: 404 });
    }

    savePlants(plants);
    return NextResponse.json({ success: true, message: 'Variety deleted successfully' });
  } catch (error) {
    console.error('API /varieties/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete variety' }, { status: 500 });
  }
}
